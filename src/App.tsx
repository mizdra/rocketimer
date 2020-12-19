import Container from '@material-ui/core/Container';
import React, { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { TimerConfigForm, TimerConfig } from './component/molecules/timer/TimerConfigForm';
import { TimerController as TimerControllerComponent } from './component/molecules/timer/TimerController';
import { TimerRemainDisplay } from './component/molecules/timer/TimerRemainDisplay';
import { TimerTimeline } from './component/molecules/timer/TimerTimeline';
import { useCascadeTimer } from './hook/timer/use-cascade-timer';
import { TimerController } from './lib/timer/timer-controller';
import { lapConfigsState } from './recoil/cascade-timer';

export type AppProps = {
  timerOffset?: number;
  timerController?: TimerController;
};

export function App(props: AppProps) {
  const timer = useCascadeTimer({ offset: props.timerOffset, controller: props.timerController });
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
      <TimerTimeline />
      <TimerRemainDisplay setOffset={timer.setOffset} />
      <TimerControllerComponent onStart={timer.start} onStop={timer.reset} />
    </Container>
  );
}
