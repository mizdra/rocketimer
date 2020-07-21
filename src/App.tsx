import React, { useCallback } from 'react';
import Container from '@material-ui/core/Container';
import { useCascadeTimer } from './hook/timer/use-cascade-timer';
import { TimerRemainDisplay } from './component/molecules/timer/TimerRemainDisplay';
import { TimerController } from './component/molecules/timer/TimerController';
import { TimerTimeline } from './component/molecules/timer/TimerTimeline';
import { TimerConfigForm, TimerConfig } from './component/molecules/timer/TimerConfigForm';
import { useOffsetChangeShortcut } from './hook/timer/use-offset-change-shortcut';
import { useSoundEffect } from './hook/timer/use-sound-effect';
import { useSetRecoilState } from 'recoil';
import { lapConfigsState } from './recoil/cascade-timer';

export type AppProps = {};

export function App(_props: AppProps) {
  const timer = useCascadeTimer();
  const setLapConfigs = useSetRecoilState(lapConfigsState);

  useOffsetChangeShortcut(timer);
  useSoundEffect(timer);

  const handleConfigSave = useCallback(
    (config: TimerConfig) => {
      setLapConfigs(config.laps);
    },
    [setLapConfigs],
  );

  return (
    <Container maxWidth="lg" style={{ padding: 30 }}>
      <TimerConfigForm onSave={handleConfigSave} />
      <TimerTimeline />
      <TimerRemainDisplay />
      <TimerController onStart={timer.start} onStop={timer.reset} />
    </Container>
  );
}
