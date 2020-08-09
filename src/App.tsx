import React, { useCallback } from 'react';
import Container from '@material-ui/core/Container';
import { useCascadeTimer } from './hook/timer/use-cascade-timer';
import { TimerRemainDisplay } from './component/molecules/timer/TimerRemainDisplay';
import { TimerController } from './component/molecules/timer/TimerController';
import { TimerConfigForm, TimerConfig } from './component/molecules/timer/TimerConfigForm';
import { useSetRecoilState } from 'recoil';
import { lapConfigsState } from './recoil/cascade-timer';

export type AppProps = {};

export function App(_props: AppProps) {
  const timer = useCascadeTimer();
  const setLapConfigs = useSetRecoilState(lapConfigsState);

  const handleConfigSave = useCallback(
    (config: TimerConfig) => {
      setLapConfigs(config.laps);
    },
    [setLapConfigs],
  );

  return (
    <Container maxWidth="lg" style={{ padding: 30 }}>
      <TimerConfigForm onSave={handleConfigSave} />
      <TimerRemainDisplay setOffset={timer.setOffset} />
      <TimerController onStart={timer.start} onStop={timer.reset} />
    </Container>
  );
}
