import { CascadeTimer } from './cascade-timer';
import { TestableTimerController } from './timer-controller';

function createTimer(lapDurations: number[], offset: number) {
  const controller = new TestableTimerController();
  const timer = new CascadeTimer(lapDurations, offset, controller);
  const listener = jest.fn();
  timer.addListener('tick', listener);
  return { controller, timer, listener };
}

function createStartedTimer(lapDurations: number[], offset: number) {
  const { controller, timer, listener } = createTimer(lapDurations, offset);
  timer.start();
  return { controller, timer, listener };
}

function createElapsedTimer(lapDurations: number[], offset: number, elapsed: number) {
  const { controller, timer, listener } = createStartedTimer(lapDurations, offset);
  controller.advanceBy(elapsed);
  return { controller, timer, listener };
}

describe('Timer', () => {
  describe('#constructor', () => {
    test('インスタンスが作成できる', () => {
      const { timer } = createTimer([1000, 2000, 3000], 0);
      expect(timer.getState()).toEqual({
        status: 'initial',
        currentLapRemain: 1000,
        currentLapIndex: 0,
        offset: 0,
      });
    });
    test('ラップ数が 0 のタイマーのインスタンスは作成できない', () => {
      expect(() => {
        createTimer([], 0);
      }).toThrow();
    });
    test('オフセットを指定できる', () => {
      const { timer } = createTimer([1000, 2000, 3000], 500);
      expect(timer.getState()).toEqual({
        status: 'initial',
        currentLapRemain: 500,
        currentLapIndex: 0,
        offset: 500,
      });
    });
    test('負のオフセットを指定できる', () => {
      const { timer } = createTimer([1000, 2000, 3000], -500);
      expect(timer.getState()).toEqual({
        status: 'initial',
        currentLapRemain: 1500,
        currentLapIndex: 0,
        offset: -500,
      });
    });
  });

  describe('初期状態', () => {
    let context: ReturnType<typeof createTimer>;
    beforeEach(() => {
      context = createTimer([1000, 2000], 500);
    });
    describe('#getState', () => {
      test('現在のタイマーの状態を返す', () => {
        expect(context.timer.getState()).toEqual({
          status: 'initial',
          currentLapRemain: 500,
          currentLapIndex: 0,
          offset: 500,
        });
      });
    });
    describe('#start', () => {
      test('カウントダウンを開始できる', () => {
        context.timer.start();
        expect(context.timer.getState()).toEqual({
          status: 'countdowning',
          currentLapRemain: 500,
          currentLapIndex: 0,
          offset: 500,
        });
      });
    });
    describe('#reset', () => {
      test('リセットできる', () => {
        context.timer.reset();
        expect(context.timer.getState()).toEqual({
          status: 'initial',
          currentLapRemain: 500,
          currentLapIndex: 0,
          offset: 500,
        });
      });
    });
    describe('#setOffset', () => {
      test('オフセットを変更できる', () => {
        context.timer.setOffset(100);
        expect(context.timer.getState()).toEqual({
          status: 'initial',
          currentLapRemain: 900,
          currentLapIndex: 0,
          offset: 100,
        });
      });
      test('大きなオフセットを指定すると最初のラップが飛ばされることがある', () => {
        context.timer.setOffset(1000);
        expect(context.timer.getState()).toEqual({
          status: 'initial',
          currentLapRemain: 2000,
          currentLapIndex: 1,
          offset: 1000,
        });
      });
      test('非常に大きなオフセットを指定するとカウント時間が 0 秒の状態になることがある', () => {
        context.timer.setOffset(3000);
        expect(context.timer.getState()).toEqual({
          status: 'initial',
          currentLapRemain: 0,
          currentLapIndex: 1,
          offset: 3000,
        });
      });
      test('ラップ 0 の時に大きな負のオフセットを指定するとラップのカウント時間よりも残り時間が大きくなることがある', () => {
        context.timer.setOffset(-1000);
        expect(context.timer.getState()).toEqual({
          status: 'initial',
          currentLapRemain: 2000,
          currentLapIndex: 0,
          offset: -1000,
        });
      });
    });
    describe('@tick', () => {
      test('どれだけ待っても発火しない', () => {
        expect(context.listener.mock.calls.length).toBe(0);
        context.controller.advanceBy(1);
        expect(context.listener.mock.calls.length).toBe(0);
      });
    });
  });

  describe('タイマーを開始した直後の状態', () => {
    let context: ReturnType<typeof createTimer>;
    beforeEach(() => {
      context = createStartedTimer([1000, 2000], 500);
    });
    describe('#getState', () => {
      test('現在のタイマーの状態を返す', () => {
        expect(context.timer.getState()).toEqual({
          status: 'countdowning',
          currentLapRemain: 500,
          currentLapIndex: 0,
          offset: 500,
        });
      });
    });
    describe('#start', () => {
      test('例外が発生する', () => {
        expect(() => {
          context.timer.start();
        }).toThrow();
        expect(context.timer.getState()).toEqual({
          status: 'countdowning',
          currentLapRemain: 500,
          currentLapIndex: 0,
          offset: 500,
        });
      });
    });
    describe('#reset', () => {
      test('リセットできる', () => {
        context.timer.reset();
        expect(context.timer.getState()).toEqual({
          status: 'initial',
          currentLapRemain: 500,
          currentLapIndex: 0,
          offset: 500,
        });
      });
    });
    describe('#setOffset', () => {
      test('オフセットを変更できる', () => {
        context.timer.setOffset(100);
        expect(context.timer.getState()).toEqual({
          status: 'countdowning',
          currentLapRemain: 900,
          currentLapIndex: 0,
          offset: 100,
        });
      });
      test('大きなオフセットを指定すると最初のラップが飛ばされることがある', () => {
        context.timer.setOffset(1000);
        expect(context.timer.getState()).toEqual({
          status: 'countdowning',
          currentLapRemain: 2000,
          currentLapIndex: 1,
          offset: 1000,
        });
      });
      test('オフセットの変更によりタイマーが終了することはない', () => {
        context.timer.setOffset(3000);
        expect(context.timer.getState()).toEqual({
          status: 'countdowning',
          currentLapRemain: 0,
          currentLapIndex: 1,
          offset: 3000,
        });
      });
      test('ラップ 0 の時に大きな負のオフセットを指定するとラップのカウント時間よりも残り時間が大きくなることがある', () => {
        context.timer.setOffset(-1000);
        expect(context.timer.getState()).toEqual({
          status: 'countdowning',
          currentLapRemain: 2000,
          currentLapIndex: 0,
          offset: -1000,
        });
      });
    });
    describe('@tick', () => {
      test('時刻の更新に合わせて発火する', () => {
        expect(context.listener.mock.calls.length).toBe(0);
        context.controller.advanceBy(1);
        expect(context.listener.mock.calls.length).toBe(1);
      });
    });
  });

  describe('タイマーを開始してから少し時間が経過した状態', () => {
    let context: ReturnType<typeof createTimer>;
    beforeEach(() => {
      context = createElapsedTimer([1000, 2000], 500, 1500);
    });
    describe('#getState', () => {
      test('現在のタイマーの状態を返す', () => {
        expect(context.timer.getState()).toEqual({
          status: 'countdowning',
          currentLapRemain: 1000,
          currentLapIndex: 1,
          offset: 500,
        });
      });
    });
    describe('#start', () => {
      test('例外が発生する', () => {
        expect(() => {
          context.timer.start();
        }).toThrow();
        expect(context.timer.getState()).toEqual({
          status: 'countdowning',
          currentLapRemain: 1000,
          currentLapIndex: 1,
          offset: 500,
        });
      });
    });
    describe('#reset', () => {
      test('リセットできる', () => {
        context.timer.reset();
        expect(context.timer.getState()).toEqual({
          status: 'initial',
          currentLapRemain: 500,
          currentLapIndex: 0,
          offset: 500,
        });
      });
    });
    describe('#setOffset', () => {
      test('オフセットを変更できる', () => {
        context.timer.setOffset(100);
        expect(context.timer.getState()).toEqual({
          status: 'countdowning',
          currentLapRemain: 1400,
          currentLapIndex: 1,
          offset: 100,
        });
      });
      test('大きな負のオフセットを指定すると前のラップに戻ることがある', () => {
        context.timer.setOffset(-1000);
        expect(context.timer.getState()).toEqual({
          status: 'countdowning',
          currentLapRemain: 500,
          currentLapIndex: 0,
          offset: -1000,
        });
      });
    });
    describe('@tick', () => {
      test('時刻の更新に合わせて発火する', () => {
        expect(context.listener.mock.calls.length).toBe(1);
        context.controller.advanceBy(1);
        expect(context.listener.mock.calls.length).toBe(2);
      });
    });
  });

  describe('タイマーを開始してから十分時間が経過した状態', () => {
    let context: ReturnType<typeof createTimer>;
    beforeEach(() => {
      context = createElapsedTimer([1000, 2000], 500, 3000);
    });
    describe('#getState', () => {
      test('現在のタイマーの状態を返す', () => {
        expect(context.timer.getState()).toEqual({
          status: 'ended',
          currentLapRemain: 0,
          currentLapIndex: 1,
          offset: 500,
        });
      });
    });
    describe('#start', () => {
      test('カウントダウンを開始できる', () => {
        context.timer.start();
        expect(context.timer.getState()).toEqual({
          status: 'countdowning',
          currentLapRemain: 500,
          currentLapIndex: 0,
          offset: 500,
        });
      });
    });
    describe('#reset', () => {
      test('リセットできる', () => {
        context.timer.reset();
        expect(context.timer.getState()).toEqual({
          status: 'initial',
          currentLapRemain: 500,
          currentLapIndex: 0,
          offset: 500,
        });
      });
    });
    describe('#setOffset', () => {
      test('オフセットを変更できる', () => {
        context.timer.setOffset(100);
        expect(context.timer.getState()).toEqual({
          status: 'ended',
          currentLapRemain: 0,
          currentLapIndex: 1,
          offset: 100,
        });
      });
      test('大きな負のオフセットを指定してもカウントダウン中の状態には戻らない', () => {
        context.timer.setOffset(-1000);
        expect(context.timer.getState()).toEqual({
          status: 'ended',
          currentLapRemain: 0,
          currentLapIndex: 1,
          offset: -1000,
        });
      });
    });
    describe('@tick', () => {
      test('どれだけ待っても発火しない', () => {
        expect(context.listener.mock.calls.length).toBe(1);
        context.controller.advanceBy(1);
        expect(context.listener.mock.calls.length).toBe(1);
      });
    });
  });
});
