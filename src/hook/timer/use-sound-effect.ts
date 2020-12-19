import { useMemo, useEffect, useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import endedAudioPath from '../../audio/ended.mp3';
import tickTackAudioPath from '../../audio/ticktack.mp3';
import { formatDuration } from '../../lib/timer/duration';
import { statusState, currentLapRemainState, currentLapIndexState } from '../../recoil/cascade-timer';
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
