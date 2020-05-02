import EventEmitter from 'eventemitter3';
import { TimeController, PerformanceTimeController } from './time-controller';
import { TickController, AnimationFrameTickController } from './tick-controller';

const INITIAL_START_TIME = 0;
const INITIAL_TIMER_ID = null;

export type CascadeTimerStatus = 'initial' | 'countdowning' | 'ended';

export type CascadeTimerState = {
  /** タイマーがカウントダウン中か, 停止しているかを返す */
  status: CascadeTimerStatus;
  /** カウントダウン中のラップの残り時間. 値は `tick` イベントに合わせて更新される. */
  currentLapRemain: number;
  /** カウントダウン中のラップのインデックス. 停止中は最後のラップのインデックスが設定される. */
  currentLapIndex: number;
};

export type EventTypes = {
  /** タイマーの状態が更新された時に発火するイベント. */
  statechange: [CascadeTimerState];
};

export type UnsubscribeFn = () => void;

function createCurrentLapState(lapDurations: number[], elapsed: number) {
  let sum = 0;
  for (let i = 0; i < lapDurations.length; i++) {
    sum += lapDurations[i];
    if (elapsed < sum) {
      return {
        currentLapIndex: i,
        currentLapRemain: sum - elapsed,
      };
    }
  }
  return {
    currentLapIndex: lapDurations.length - 1,
    currentLapRemain: 0,
  };
}

/** 高FPSで動作するよう設計された多段カウントダウンタイマー */
export class CascadeTimer {
  readonly #lapDurations: number[];
  readonly #emitter: EventEmitter<EventTypes>;
  readonly #timeController: TimeController;
  readonly #tickController: TickController;

  #startTime: number;
  #timerId: number | null;

  /**
   * @param lapDurations ラップごとのカウントダウン時間
   */
  constructor(
    lapDurations: number[],
    timeController: TimeController = new PerformanceTimeController(),
    tickController: TickController = new AnimationFrameTickController(),
  ) {
    if (lapDurations.length == 0) throw new Error('インスタンスを作成するには少なくとも 1 つのラップが必要です.');
    this.#lapDurations = lapDurations;
    this.#emitter = new EventEmitter();
    this.#timeController = timeController;
    this.#tickController = tickController;

    this.#startTime = INITIAL_START_TIME;
    this.#timerId = INITIAL_TIMER_ID;
  }

  /**
   * カウントダウンを開始する.
   * @param startTime タイマーの開始時刻. 指定しなければ `CascadeTimer#start` を呼び出した時間が用いられる.
   * */
  start(startTime?: number) {
    const now = this.#timeController.getTime();
    if (this.#timerId !== INITIAL_TIMER_ID) throw new Error('カウントダウン中は CascadeTimer#start を呼び出せません.');
    if (startTime !== undefined && startTime > now)
      throw new Error('タイマーの開始時間は現在時刻より前でなければなりません.');

    const lastLapIndex = this.#lapDurations.length - 1;
    const onTick = (timestamp: number) => {
      const elapsed = timestamp - this.#startTime;
      const { currentLapIndex, currentLapRemain } = createCurrentLapState(this.#lapDurations, elapsed);

      const status = currentLapIndex === lastLapIndex && currentLapRemain === 0 ? 'ended' : 'countdowning';
      if (status === 'countdowning') {
        this.#timerId = this.#tickController.requestTick(onTick);
      } else {
        this.#timerId = null;
      }

      this.#emitter.emit('statechange', {
        status,
        currentLapIndex,
        currentLapRemain,
      });
    };

    this.#startTime = startTime ?? now;
    this.#timerId = this.#tickController.requestTick(onTick);
    this.#emitter.emit('statechange', {
      status: 'countdowning',
      ...createCurrentLapState(this.#lapDurations, now - this.#startTime),
    });
  }

  /** カウントダウンを強制的に停止し, 初期状態に戻す. これにより, `tick` イベントの呼び出しが停止する. */
  reset() {
    if (this.#timerId !== null) this.#tickController.cancelTick(this.#timerId);
    this.#startTime = INITIAL_START_TIME;
    this.#timerId = INITIAL_TIMER_ID;

    this.#emitter.emit('statechange', {
      status: 'initial',
      ...createCurrentLapState(this.#lapDurations, 0),
    });
  }

  /**
   * イベントリスナを登録する.
   */
  addListener<T extends keyof EventTypes>(eventName: T, handler: (...args: EventTypes[T]) => void): UnsubscribeFn {
    this.#emitter.addListener(eventName, handler);
    return () => {
      this.#emitter.removeListener(eventName, handler);
    };
  }
}
