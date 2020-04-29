import EventEmitter from 'eventemitter3';
import { TimeController, PerformanceTimeController } from './time-controller';
import { TickController, AnimationFrameTickController } from './tick-controller';

const INITIAL_STATUS = 'initial';
const INITIAL_START_TIME = 0;
const INITIAL_TIMER_ID = null;

export type CascadeTimerStatus = 'initial' | 'countdowning' | 'ended';

export type EventTypes = {
  /** カウントダウン中のタイマーが更新された時に発火するイベント. */
  tick: [];
};

export type UnsubscribeFn = () => void;

function getCurrentLap(lapDurations: number[], elapsed: number) {
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

  /** タイマーがカウントダウン中か, 停止しているかを返す */
  status: CascadeTimerStatus;
  #startTime: number;
  /** カウントダウン中のラップの残り時間. 値は `tick` イベントに合わせて更新される. */
  currentLapRemain: number;
  /** カウントダウン中のラップのインデックス. 停止中は最後のラップのインデックスが設定される. */
  currentLapIndex: number;
  #timerId: number | null;

  offset: number;

  /**
   * @param lapDurations ラップごとのカウントダウン時間
   */
  constructor(
    lapDurations: number[],
    offset = 0,
    timeController: TimeController = new PerformanceTimeController(),
    tickController: TickController = new AnimationFrameTickController(),
  ) {
    if (lapDurations.length == 0) throw new Error('インスタンスを作成するには少なくとも 1 つのラップが必要です.');
    this.#lapDurations = lapDurations;
    this.#emitter = new EventEmitter();
    this.#timeController = timeController;
    this.#tickController = tickController;

    const elapsed = offset;
    const { currentLapIndex, currentLapRemain } = getCurrentLap(this.#lapDurations, elapsed);

    this.status = INITIAL_STATUS;
    this.#startTime = INITIAL_START_TIME;
    this.currentLapIndex = currentLapIndex;
    this.currentLapRemain = currentLapRemain;
    this.#timerId = INITIAL_TIMER_ID;

    this.offset = offset;
  }

  /**
   * 現在時刻を元にタイマーの状態を更新する.
   * 更新されるプロパティは `status`, `currentLapIndex`, `currentLapRemain`, `#timerId` の4つ.
   * また, このメソッドの呼び出しによってタイマーが終了状態へと移行した場合は, その時点以降の
   * 予約されているタイマーの更新を全てキャンセルする.
   * */
  private syncStateWithCurrentTime(currentTime: number) {
    const lastLapIndex = this.#lapDurations.length - 1;

    if (this.status === 'ended') {
      // 終了状態: どれだけ時間が経過しても終了状態のまま
      // noop
    } else if (this.status === 'initial') {
      // タイマー開始前の状態: オフセットに応じて状態が変化する可能性がある
      const elapsed = this.offset;
      const { currentLapIndex, currentLapRemain } = getCurrentLap(this.#lapDurations, elapsed);
      this.currentLapIndex = currentLapIndex;
      this.currentLapRemain = currentLapRemain;
    } else {
      // カウントダウン中: 最後のラップをカウントダウン中で残り時間が 0 なら終了状態へと移行する
      const elapsed = currentTime - this.#startTime + this.offset;
      const { currentLapIndex, currentLapRemain } = getCurrentLap(this.#lapDurations, elapsed);
      this.currentLapIndex = currentLapIndex;
      this.currentLapRemain = currentLapRemain;
      this.status = currentLapIndex === lastLapIndex && currentLapRemain === 0 ? 'ended' : 'countdowning';
      if (currentLapIndex === lastLapIndex && currentLapRemain === 0) {
        this.status = 'ended';
        if (this.#timerId !== null) {
          this.#tickController.cancelTick(this.#timerId);
          this.#timerId = null;
        }
      }
    }
  }

  /** カウントダウンを開始する. */
  start() {
    const now = this.#timeController.getTime();
    if (this.status === 'countdowning') throw new Error('カウントダウン中は CascadeTimer#start を呼び出せません.');

    const onTick = (timestamp: number) => {
      this.#timerId = this.#tickController.requestTick(onTick);
      this.syncStateWithCurrentTime(timestamp);
      this.#emitter.emit('tick');
    };

    this.#startTime = now;
    this.status = 'countdowning';
    this.#timerId = this.#tickController.requestTick(onTick);
    this.syncStateWithCurrentTime(now);
  }

  /** カウントダウンを強制的に停止し, 初期状態に戻す. これにより, `tick` イベントの呼び出しが停止する. */
  reset() {
    if (this.#timerId !== null) this.#tickController.cancelTick(this.#timerId);

    const elapsed = this.offset;
    const { currentLapIndex, currentLapRemain } = getCurrentLap(this.#lapDurations, elapsed);

    this.status = INITIAL_STATUS;
    this.#startTime = INITIAL_START_TIME;
    this.currentLapIndex = currentLapIndex;
    this.currentLapRemain = currentLapRemain;
    this.#timerId = INITIAL_TIMER_ID;
  }

  /** オフセットを設定する. オフセットはカウントダウン中でもリアルタイムで反映されるため, 調律などに利用できる. */
  setOffset(offset: number) {
    this.offset = offset;
    this.syncStateWithCurrentTime(this.#timeController.getTime());
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
