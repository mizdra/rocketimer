import { checkSoundEvent, SoundableCascadeTimer } from '../../../src/lib/timer/soundable-cascade-timer';
import { TestableTimerController } from '../../../src/lib/timer/timer-controller';

function createTimer(lapDurations: number[], offset: number, soundOffset: number) {
  const controller = new TestableTimerController();
  const timer = new SoundableCascadeTimer(lapDurations, offset, soundOffset, controller);
  const remainChange = jest.fn();
  const ticktack = jest.fn();
  const ticktackEnded = jest.fn();
  timer.addEventListener('remainChange', remainChange);
  timer.addEventListener('ticktack', ticktack);
  timer.addEventListener('ticktackEnded', ticktackEnded);
  return { controller, timer, remainChange, ticktack, ticktackEnded };
}

function createStartedTimer(lapDurations: number[], offset: number, soundOffset: number) {
  const { timer, ...rest } = createTimer(lapDurations, offset, soundOffset);
  timer.start();
  return { timer, ...rest };
}

function createElapsedTimer(lapDurations: number[], offset: number, soundOffset: number, elapsed: number) {
  const { controller, ...rest } = createStartedTimer(lapDurations, offset, soundOffset);
  controller.advanceBy(elapsed);
  return { controller, ...rest };
}

describe('SoundableCascadeTimer', () => {
  describe('#constructor', () => {
    test('インスタンスが作成できる', () => {
      const { timer } = createTimer([1000, 2000, 3000], 100, 200);
      expect(timer.getMainState()).toEqual({
        status: 'initial',
        lapRemain: 900,
        lapIndex: 0,
        offset: 100,
      });
      expect(timer.getSoundState()).toEqual({
        status: 'initial',
        lapRemain: 700,
        lapIndex: 0,
        offset: 300,
      });
    });
  });
  describe('#start', () => {
    test('status が countdowning になる', () => {
      const { timer } = createTimer([1000, 2000, 3000], 100, 200);
      timer.start();
      expect(timer.getMainState()).toEqual({
        status: 'countdowning',
        lapRemain: 900,
        lapIndex: 0,
        offset: 100,
      });
      expect(timer.getSoundState()).toEqual({
        status: 'countdowning',
        lapRemain: 700,
        lapIndex: 0,
        offset: 300,
      });
    });
  });
  describe('#reset', () => {
    test('status が initial になる', () => {
      const { timer } = createStartedTimer([1000, 2000, 3000], 100, 200);
      timer.reset();
      expect(timer.getMainState()).toEqual({
        status: 'initial',
        lapRemain: 900,
        lapIndex: 0,
        offset: 100,
      });
      expect(timer.getSoundState()).toEqual({
        status: 'initial',
        lapRemain: 700,
        lapIndex: 0,
        offset: 300,
      });
    });
  });
  describe('#setMainOffset', () => {
    test('メインタイマーのオフセットが変更できる & メインオフセットはサウンドタイマーのオフセットにも影響する', () => {
      const { timer } = createStartedTimer([1000, 2000, 3000], 100, 200);
      timer.setMainOffset(300);
      expect(timer.getMainState()).toEqual({
        status: 'countdowning',
        lapRemain: 700,
        lapIndex: 0,
        offset: 300,
      });
      expect(timer.getSoundState()).toEqual({
        status: 'countdowning',
        lapRemain: 500,
        lapIndex: 0,
        offset: 500,
      });
    });
  });
  describe('#setSoundOffset', () => {
    test('サウンドタイマーのオフセットが変更できる & サウンドオフセットはメインタイマーのオフセットには影響しない', () => {
      const { timer } = createStartedTimer([1000, 2000, 3000], 100, 200);
      timer.setSoundOffset(300);
      expect(timer.getMainState()).toEqual({
        status: 'countdowning',
        lapRemain: 900,
        lapIndex: 0,
        offset: 100,
      });
      expect(timer.getSoundState()).toEqual({
        status: 'countdowning',
        lapRemain: 600,
        lapIndex: 0,
        offset: 400,
      });
    });
  });
  describe('@remainChange', () => {
    test('時刻の更新に合わせて発火する', () => {
      const context = createStartedTimer([500], 0, 0);
      expect(context.remainChange.mock.calls.length).toBe(0);
      context.controller.advanceBy(1);
      expect(context.remainChange.mock.calls.length).toBe(1);
      context.controller.advanceBy(1);
      expect(context.remainChange.mock.calls.length).toBe(2);
    });
  });
  describe('@ticktack', () => {
    test('checkSoundEvent で ticktack が返ってくるタイミングで発火する', () => {
      const context = createStartedTimer([1001], 0, 0);
      expect(context.ticktack.mock.calls.length).toBe(0);
      context.controller.advanceBy(1); // 残り時間 1000 ms
      expect(context.ticktack.mock.calls.length).toBe(1);
      context.controller.advanceBy(1); // 残り時間 999 ms
      expect(context.ticktack.mock.calls.length).toBe(1);
    });
    test('メインオフセットやサウンドオフセットの影響を受ける', () => {
      const context = createStartedTimer([1301], 100, 200);
      expect(context.ticktack.mock.calls.length).toBe(0);
      context.controller.advanceBy(1);
      expect(context.ticktack.mock.calls.length).toBe(1);
    });
  });
  describe('@ticktackEnded', () => {
    test('checkSoundEvent で ticktackEnded が返ってくるタイミングで発火する', () => {
      const context = createStartedTimer([1, 2000], 0, 0);
      expect(context.ticktackEnded.mock.calls.length).toBe(0);
      context.controller.advanceBy(1); // 1ラップ目の残り時間 0 ms
      expect(context.ticktackEnded.mock.calls.length).toBe(1);
    });
    test('メインオフセットやサウンドオフセットの影響を受ける', () => {
      const context = createStartedTimer([301], 100, 200);
      expect(context.ticktackEnded.mock.calls.length).toBe(0);
      context.controller.advanceBy(1);
      expect(context.ticktackEnded.mock.calls.length).toBe(1);
    });
  });
});

describe('checkSoundEvent', () => {
  describe('`lapDurations === [11001]` の時', () => {
    test.each([
      [['countdowning', 11001, 0], ['countdowning', 11000, 0], undefined],
      [['countdowning', 11001, 0], ['countdowning', 11000, 0], undefined],
      [['countdowning', 10001, 0], ['countdowning', 10000, 0], 'ticktack'],
      [['countdowning', 10000, 0], ['countdowning', 9999, 0], undefined],
      [['countdowning', 1002, 0], ['countdowning', 1001, 0], undefined],
      [['countdowning', 1001, 0], ['countdowning', 1000, 0], 'ticktack'],
      [['countdowning', 1000, 0], ['countdowning', 999, 0], undefined],
      [['countdowning', 2, 0], ['countdowning', 1, 0], undefined],
      [['countdowning', 1, 0], ['ended', 0, 0], 'ticktackEnded'],
    ] as const)('%p => %p', (prev, next, expected) => {
      expect(
        checkSoundEvent(
          { status: prev[0], lapRemain: prev[1], lapIndex: prev[2], offset: 0 },
          { status: next[0], lapRemain: next[1], lapIndex: next[2], offset: 0 },
        ),
      ).toBe(expected);
    });
  });
  describe('`lapDurations === [1, 11000, 10000]` の時', () => {
    test.each([
      [['countdowning', 1, 0], ['countdowning', 11000, 1], 'ticktackEnded'],
      [['countdowning', 1, 1], ['countdowning', 10000, 2], 'ticktackEnded'],
      [['countdowning', 1, 2], ['ended', 0, 2], 'ticktackEnded'],
    ] as const)('%p => %p', (prev, next, expected) => {
      expect(
        checkSoundEvent(
          { status: prev[0], lapRemain: prev[1], lapIndex: prev[2], offset: 0 },
          { status: next[0], lapRemain: next[1], lapIndex: next[2], offset: 0 },
        ),
      ).toBe(expected);
    });
  });
  describe('複数区間を一気にまたぐ時', () => {
    test.each([
      [['countdowning', 2001, 0], ['countdowning', 1000, 0], 'ticktack'],
      [['countdowning', 2001, 0], ['countdowning', 11000, 1], 'ticktackEnded'],
      [['countdowning', 2001, 0], ['countdowning', 10000, 1], 'ticktackEnded'],
      [['countdowning', 1, 0], ['countdowning', 11000, 1], 'ticktackEnded'],
      [['countdowning', 1, 0], ['countdowning', 10000, 1], 'ticktackEnded'],
      [['countdowning', 2001, 0], ['ended', 0, 0], 'ticktackEnded'],
      [['countdowning', 2001, 0], ['ended', 0, 1], 'ticktackEnded'],
    ] as const)('%p => %p', (prev, next, expected) => {
      expect(
        checkSoundEvent(
          { status: prev[0], lapRemain: prev[1], lapIndex: prev[2], offset: 0 },
          { status: next[0], lapRemain: next[1], lapIndex: next[2], offset: 0 },
        ),
      ).toBe(expected);
    });
  });
});
