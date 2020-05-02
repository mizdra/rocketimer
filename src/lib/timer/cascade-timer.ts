import EventEmitter from 'eventemitter3';
import { TimeController, PerformanceTimeController } from './time-controller';
import { TickController, AnimationFrameTickController } from './tick-controller';

const INITIAL_START_TIME = 0;
const INITIAL_LAST_TICK_TIME = 0;
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
  /** カウントダウン中のタイマーが更新された時に発火するイベント. */
  tick: [];
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

  #status: CascadeTimerStatus;
  #startTime: number;
  #lastTickTime: number;
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

    this.#status = 'initial';
    this.#startTime = INITIAL_START_TIME;
    this.#lastTickTime = INITIAL_LAST_TICK_TIME;
    this.#timerId = INITIAL_TIMER_ID;
  }

  /** タイマーの状態を返す. */
  getState(): CascadeTimerState {
    if (this.#status === 'initial') {
      return {
        status: 'initial',
        ...createCurrentLapState(this.#lapDurations, 0),
      };
    }
    if (this.#status === 'countdowning') {
      return {
        status: 'countdowning',
        ...createCurrentLapState(this.#lapDurations, this.#lastTickTime - this.#startTime),
      };
    }
    return {
      status: 'ended',
      ...createCurrentLapState(this.#lapDurations, Number.MAX_SAFE_INTEGER),
    };
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
      const newStatus = currentLapIndex === lastLapIndex && currentLapRemain === 0 ? 'ended' : 'countdowning';

      if (newStatus === 'countdowning') {
        this.#timerId = this.#tickController.requestTick(onTick);
      } else {
        this.#timerId = null;
      }

      this.#status = newStatus;
      this.#lastTickTime = timestamp;
      this.#emitter.emit('tick');
    };

    this.#status = 'countdowning';
    this.#startTime = startTime ?? now;
    this.#lastTickTime = startTime ?? now;
    this.#timerId = this.#tickController.requestTick(onTick);
  }

  /** カウントダウンを強制的に停止し, 初期状態に戻す. これにより, `tick` イベントの呼び出しが停止する. */
  reset() {
    if (this.#timerId !== null) this.#tickController.cancelTick(this.#timerId);

    this.#status = 'initial';
    this.#startTime = INITIAL_START_TIME;
    this.#lastTickTime = INITIAL_LAST_TICK_TIME;
    this.#timerId = INITIAL_TIMER_ID;
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
