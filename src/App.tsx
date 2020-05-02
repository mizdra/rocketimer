import React, { useMemo, useCallback, useState } from 'react';
import Container from '@material-ui/core/Container';
import { useCascadeTimer } from './hook/use-cascade-timer';
import { TimerRemainDisplay } from './component/TimerRemainDisplay';
import { TimerController } from './component/TimerController';
import { TimerTimeline } from './component/TimerTimeline';
import { TimerConfigForm, TimerConfig } from './component/TimerConfigForm';
import { useOffsetChangeShortcut } from './hook/use-offset-change-shortcut';
import { useSoundEffect } from './hook/use-sound-effect';

const DEFAULT_LAP_CONFIGS: TimerConfig['laps'] = [
  { title: 'お湯が沸くまで', duration: 3 * 1000 },
  { title: 'カップラーメンができるまで', duration: 5 * 1000 },
  { title: 'お昼休みが終わるまで', duration: 10 * 1000 },
  { title: '定時まで', duration: 10 * 1000 },
  { title: '就寝まで', duration: 10000000 * 1000 },
];

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

  useSoundEffect(status, currentLapRemain, currentLapIndex);

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
