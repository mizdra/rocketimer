import { useMemo, useEffect, useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import endedAudioPath from '../../audio/ended.mp3';
import tickTackAudioPath from '../../audio/ticktack.mp3';
import { formatDuration } from '../../lib/timer/duration';
import { statusState, lapRemainState, lapIndexState } from '../../recoil/cascade-timer';
import { usePrevious } from '../use-previous';

function useAudio(path: string) {
  const audio = useMemo(() => new Audio(path), [path]);
  const play = useCallback(async () => {
    await audio.play();
  }, [audio]);
  return { play };
}

/** 秒の位が変わる時と残り時間が 0 になった時に音を鳴らす */
export function useSoundEffect() {
  const status = useRecoilValue(statusState);
  const lapRemain = useRecoilValue(lapRemainState);
  const lapIndex = useRecoilValue(lapIndexState);

  const { play: playTickTack } = useAudio(tickTackAudioPath);
  const { play: playEndedAudio } = useAudio(endedAudioPath);

  const prevStatus = usePrevious(status);
  const prevLapIndex = usePrevious(lapIndex);
  const { seconds } = formatDuration(lapRemain);
  const prevSeconds = usePrevious(seconds);

  useEffect(() => {
    if (prevStatus === 'countdowning' && status === 'ended') {
      void playEndedAudio();
    } else if (status === 'countdowning' && prevLapIndex !== lapIndex) {
      void playEndedAudio();
    } else if (status === 'countdowning' && prevSeconds !== seconds && lapRemain < 10 * 1000) {
      void playTickTack();
    }
  }, [lapIndex, lapRemain, playEndedAudio, playTickTack, prevLapIndex, prevSeconds, prevStatus, seconds, status]);
}
