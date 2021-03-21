import { SoundableCascadeTimer } from '../../../src/lib/timer/soundable-cascade-timer';
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
      const { timer } = createTimer([1000, 2000, 3000], 0, 0);
      expect(timer.getState()).toEqual({
        status: 'initial',
        lapRemain: 1000,
        lapIndex: 0,
        offset: 0,
      });
    });
  });
});
