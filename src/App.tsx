import React, { useMemo, useCallback, useState } from 'react';
import Container from '@material-ui/core/Container';
import { useCascadeTimer } from './hook/timer/use-cascade-timer';
import { TimerRemainDisplay } from './component/molecules/timer/TimerRemainDisplay';
import { TimerController } from './component/molecules/timer/TimerController';
import { TimerTimeline } from './component/molecules/timer/TimerTimeline';
import { TimerConfigForm, TimerConfig } from './component/molecules/timer/TimerConfigForm';
import { useOffsetChangeShortcut } from './hook/timer/use-offset-change-shortcut';
import { useSoundEffect } from './hook/timer/use-sound-effect';

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
  const timer = useCascadeTimer(lapDurations);
  const currentLapTitle = useMemo(() => lapConfigs[timer.currentLapIndex].title, [timer.currentLapIndex, lapConfigs]);

  useOffsetChangeShortcut(timer);
  useSoundEffect(timer);

  const handleConfigSave = useCallback((config: TimerConfig) => {
    setLapConfigs(config.laps);
  }, []);

  return (
    <Container maxWidth="lg" style={{ padding: 30 }}>
      <TimerConfigForm onSave={handleConfigSave} />
      <TimerTimeline totalElapsed={timer.totalElapsed} lapEndTimes={timer.lapEndTimes} />
      <TimerRemainDisplay title={currentLapTitle} remain={timer.currentLapRemain} />
      <TimerController status={timer.status} onStart={timer.start} onStop={timer.reset} />
    </Container>
  );
}
