import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import Container from '@material-ui/core/Container';
import { useCascadeTimer } from './hook/use-cascade-timer';
import { TimerRemainDisplay } from './component/TimerRemainDisplay';
import { TimerController } from './component/TimerController';
import { TimerTimeline } from './component/TimerTimeline';
import { TimerConfigForm, TimerConfig } from './component/TimerConfigForm';
import { useOffsetChangeShortcut } from './hook/use-offset-change-shortcut';
import { CascadeTimerStatus } from './lib/timer/cascade-timer';
import { formatDuration } from './lib/timer/duration';
import tickTackAudioPath from './audio/ticktack.mp3';
import endedAudioPath from './audio/ended.mp3';

const DEFAULT_LAP_CONFIGS: TimerConfig['laps'] = [
  { title: 'お湯が沸くまで', duration: 3 * 1000 },
  { title: 'カップラーメンができるまで', duration: 5 * 1000 },
  { title: 'お昼休みが終わるまで', duration: 10 * 1000 },
  { title: '定時まで', duration: 10 * 1000 },
  { title: '就寝まで', duration: 10000000 * 1000 },
];

function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function useAlarm(status: CascadeTimerStatus, currentLapRemain: number, currentLapIndex: number) {
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

export type AppProps = {};

export function App(_props: AppProps) {
  const [lapConfigs, setLapConfigs] = useState<TimerConfig['laps']>(DEFAULT_LAP_CONFIGS);
  const lapDurations = useMemo(() => lapConfigs.map((lapConfig) => lapConfig.duration), [lapConfigs]);
  const {
    status,
    currentLapRemain,
    currentLapIndex,
    totalElapsed,
    offset,
    lapEndTimes,
    start,
    reset,
    setOffset,
  } = useCascadeTimer(lapDurations);
  const currentLapTitle = useMemo(() => lapConfigs[currentLapIndex].title, [currentLapIndex, lapConfigs]);

  useOffsetChangeShortcut(offset, setOffset);

  useAlarm(status, currentLapRemain, currentLapIndex);

  const handleConfigSave = useCallback((config: TimerConfig) => {
    setLapConfigs(config.laps);
  }, []);

  return (
    <Container maxWidth="lg" style={{ padding: 30 }}>
      <TimerConfigForm onSave={handleConfigSave} />
      <TimerTimeline totalElapsed={totalElapsed} lapEndTimes={lapEndTimes} />
      <TimerRemainDisplay title={currentLapTitle} remain={currentLapRemain} />
      <TimerController status={status} onStart={start} onStop={reset} />
    </Container>
  );
}
