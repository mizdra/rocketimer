/** タイマーコントローラ */
export interface TimerController {
  /** 現在時刻を返す */
  getTime(): number;
  /** 次のタイマー更新時にコールバックを呼び出すよう予約する */
  requestTick(cb: (timestamp: number) => void): number;
  /** コールバックの呼び出し予約をキャンセルする */
  cancelTick(tickId: number): void;
}

/** 時刻の取得に Performance API を, コールバックの予約に requestAnimationFrame を用いたコントローラ */
export class OptimizedTimerController implements TimerController {
  getTime() {
    return performance.now();
  }
  requestTick(cb: (timestamp: number) => void): number {
    return requestAnimationFrame(cb);
  }
  cancelTick(tickId: number): void {
    return cancelAnimationFrame(tickId);
  }
}

/** テスト用のコントローラ */
export class TestableTimerController implements TimerController {
  #now: number;
  #cbQueue: FrameRequestCallback[];

  constructor(now = 0) {
    this.#now = now;
    this.#cbQueue = [];
  }
  getTime() {
    return this.#now;
  }
  requestTick(cb: (timestamp: number) => void): number {
    const tickId = this.#cbQueue.length;
    this.#cbQueue.unshift(cb);
    return tickId;
  }
  cancelTick(tickId: number): void {
    this.#cbQueue.splice(tickId, 1);
  }

  /** `requestTick` で登録されたコールバックを呼び出す */
  private fireTick() {
    // NOTE: コールバック内で `requestTick` を呼び出す可能性があるので, キューを空にしてからコールバックを呼び出す
    const oldCbQueue = [...this.#cbQueue];
    this.#cbQueue = [];
    oldCbQueue.forEach((cb) => cb(this.#now));
  }
  /** 時刻を `now` へと変更し, 予約されたコールバックを呼び出す */
  advanceTo(now: number): void {
    this.#now = now;
    this.fireTick();
  }
  /** 時刻を `diff` だけ進め，予約されたコールバックを呼び出す */
  advanceBy(diff: number): void {
    this.#now += diff;
    this.fireTick();
  }
}
