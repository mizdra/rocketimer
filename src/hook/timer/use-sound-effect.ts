import { useMemo, useEffect, useCallback } from 'react';
import { formatDuration } from '../../lib/timer/duration';
import tickTackAudioPath from '../../audio/ticktack.mp3';
import endedAudioPath from '../../audio/ended.mp3';
import { usePrevious } from '../use-previous';
import { useRecoilValue } from 'recoil';
import { statusState, currentLapRemainState, currentLapIndexState } from '../../recoil/cascade-timer';

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
  const currentLapRemain = useRecoilValue(currentLapRemainState);
  const currentLapIndex = useRecoilValue(currentLapIndexState);

  const { play: playTickTack } = useAudio(tickTackAudioPath);
  const { play: playEndedAudio } = useAudio(endedAudioPath);

  const prevStatus = usePrevious(status);
  const prevCurrentLapIndex = usePrevious(currentLapIndex);
  const { seconds } = formatDuration(currentLapRemain);
  const prevSeconds = usePrevious(seconds);

  useEffect(() => {
    if (prevStatus === 'countdowning' && status === 'ended') {
      void playEndedAudio();
    } else if (status === 'countdowning' && prevCurrentLapIndex !== currentLapIndex) {
      void playEndedAudio();
    } else if (status === 'countdowning' && prevSeconds !== seconds && currentLapRemain < 10 * 1000) {
      void playTickTack();
    }
  }, [
    currentLapIndex,
    currentLapRemain,
    playEndedAudio,
    playTickTack,
    prevCurrentLapIndex,
    prevSeconds,
    prevStatus,
    seconds,
    status,
  ]);
}
