import { useMemo, useEffect } from 'react';
import { CascadeTimerStatus } from '../lib/timer/cascade-timer';
import { formatDuration } from '../lib/timer/duration';
import tickTackAudioPath from '../audio/ticktack.mp3';
import endedAudioPath from '../audio/ended.mp3';
import { usePrevious } from './use-previous';

/** 秒の位が変わる時と残り時間が 0 になった時に音を鳴らす */
export function useSoundEffect(status: CascadeTimerStatus, currentLapRemain: number, currentLapIndex: number) {
  const tickTackAudio = useMemo(() => new Audio(tickTackAudioPath), []);
  const endedAudio = useMemo(() => new Audio(endedAudioPath), []);
  const { seconds } = formatDuration(currentLapRemain);
  const prevStatus = usePrevious(status);
  const prevCurrentLapIndex = usePrevious(currentLapIndex);
  const prevSeconds = usePrevious(seconds);

  useEffect(() => {
    if (prevStatus === 'countdowning' && status === 'ended') {
      endedAudio.play();
    } else if (status === 'countdowning' && prevCurrentLapIndex !== currentLapIndex) {
      endedAudio.play();
    } else if (status === 'countdowning' && prevSeconds !== seconds && seconds < 10) {
      tickTackAudio.play();
    }
  }, [currentLapIndex, endedAudio, prevCurrentLapIndex, prevSeconds, prevStatus, seconds, status, tickTackAudio]);
}
