import React, { useMemo, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import { useChainedTimer } from './hook/use-chained-timer';
import { TimerCard } from './component/TimeCard';
import { TimerController } from './component/TimerController';
import { Timeline } from './component/Timeline';
import { LapForm } from './component/LapForm';

export type AppProps = {};

const lapConfigs = [
  { title: 'お湯が沸くまで', duration: 3 * 1000 },
  { title: 'カップラーメンができるまで', duration: 5 * 1000 },
  { title: 'お昼休みが終わるまで', duration: 10 * 1000 },
  { title: '定時まで', duration: 10 * 1000 },
  { title: '就寝まで', duration: 10000000 * 1000 },
];
const lapDurations = lapConfigs.map((lapConfig) => lapConfig.duration);

export function App(_props: AppProps) {
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
  } = useChainedTimer(lapDurations);
  const currentLapTitle = useMemo(() => lapConfigs[currentLapIndex].title, [currentLapIndex]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // console.log(`Pressed ${e.key} key`);
      if (e.key === 'ArrowRight' || e.key === 'Right') {
        setOffset(offset + 1000);
      }
      if (e.key === 'ArrowLeft' || e.key === 'Left') {
        setOffset(offset - 1000);
      }
    };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [offset, setOffset]);

  return (
    <Container maxWidth="lg" style={{ padding: 30 }}>
      <LapForm />
      <Timeline totalElapsed={totalElapsed} lapEndTimes={lapEndTimes} />
      <TimerCard title={currentLapTitle} duration={currentLapRemain} />
      <TimerController status={status} onStart={start} onStop={reset} />
    </Container>
  );
}
