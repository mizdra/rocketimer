import EventEmitter from 'eventemitter3';
import { TimeController, PerformanceTimeController } from './timer/time-controller';
import { TickController, AnimationFrameTickController } from './timer/tick-controller';

const INITIAL_STATUS = 'initial';
const INITIAL_START_TIME = 0;
const INITIAL_CURRENT_LAP_INDEX = 0;
// const INITIAL_CURRENT_LAP_REMAIN = 0;
const INITIAL_TIMER_ID = null;

export type ChainedTimerStatus = 'initial' | 'countdowning' | 'ended';

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
export class ChainedTimer {
  readonly #lapDurations: number[];
  readonly #emitter: EventEmitter<EventTypes>;
  readonly #timeController: TimeController;
  readonly #tickController: TickController;

  /** タイマーがカウントダウン中か, 停止しているかを返す */
  status: ChainedTimerStatus;
  #startTime: number;
  /** カウントダウン中のラップの残り時間. 値は `tick` イベントに合わせて更新される. */
  currentLapRemain: number;
  /** カウントダウン中のラップのインデックス. 停止中は最後のラップのインデックスが設定される. */
  currentLapIndex: number;
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

    this.status = INITIAL_STATUS;
    this.#startTime = INITIAL_START_TIME;
    this.currentLapIndex = INITIAL_CURRENT_LAP_INDEX;
    this.currentLapRemain = lapDurations[0];
    this.#timerId = INITIAL_TIMER_ID;
  }

  private updateStateByCurrentTime(currentTime: number) {
    const lastLapIndex = this.#lapDurations.length - 1;
    const elapsed = currentTime - this.#startTime;

    const { currentLapIndex, currentLapRemain } = getCurrentLap(this.#lapDurations, elapsed);

    if (currentLapIndex === lastLapIndex && currentLapRemain === 0) {
      this.status = 'ended';
      // this.#startTime = this.#startTime;
      this.currentLapIndex = lastLapIndex;
      this.currentLapRemain = currentLapRemain;
    } else {
      this.status = 'countdowning';
      // this.#startTime = this.#startTime;
      this.currentLapIndex = currentLapIndex;
      this.currentLapRemain = currentLapRemain;
    }
  }

  /** カウントダウンを開始する. */
  start() {
    const now = this.#timeController.getTime();
    if (this.status === 'countdowning') throw new Error('カウントダウン中は ChainedTimer#start を呼び出せません.');

    const onTick = (timestamp: number) => {
      this.updateStateByCurrentTime(timestamp);
      this.#emitter.emit('tick');

      if (this.status === 'countdowning') {
        this.#timerId = this.#tickController.requestTick(onTick);
      } else {
        this.#timerId = null;
      }
    };

    this.#startTime = now;
    this.updateStateByCurrentTime(now);
    this.#timerId = this.#tickController.requestTick(onTick);
  }

  /** カウントダウンを強制的に停止し, 初期状態に戻す. これにより, `tick` イベントの呼び出しが停止する. */
  reset() {
    if (this.#timerId) this.#tickController.cancelTick(this.#timerId);

    this.status = INITIAL_STATUS;
    this.#startTime = INITIAL_START_TIME;
    this.currentLapIndex = INITIAL_CURRENT_LAP_INDEX;
    this.currentLapRemain = this.#lapDurations[0];
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
