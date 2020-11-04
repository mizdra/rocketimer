import React, { useCallback, Suspense } from 'react';
import Container from '@material-ui/core/Container';
import { useCascadeTimer } from './hook/timer/use-cascade-timer';
import { TimerRemainDisplay } from './component/molecules/timer/TimerRemainDisplay';
import { TimerController as TimerControllerComponent } from './component/molecules/timer/TimerController';
import { TimerTimeline } from './component/molecules/timer/TimerTimeline';
import { TimerConfigForm, TimerConfig } from './component/molecules/timer/TimerConfigForm';
import { useSetRecoilState } from 'recoil';
import { lapConfigsState } from './recoil/cascade-timer';
import { TimerController } from './lib/timer/timer-controller';
import { UserPreference } from './component/molecules/UserPreference';

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
      <Suspense fallback={<div>Loading...</div>}>
        <UserPreference />
      </Suspense>
      <TimerTimeline />

      <Suspense fallback={<div>Loading...</div>}>
        <TimerRemainDisplay setOffset={timer.setOffset} />
      </Suspense>
      <TimerControllerComponent onStart={timer.start} onStop={timer.reset} />
    </Container>
  );
}
