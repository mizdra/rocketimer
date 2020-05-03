import React from 'react';
import Button from '@material-ui/core/Button';
import { CascadeTimerStatus } from '../../../lib/timer/cascade-timer';

export type TimerControllerProps = {
  status: CascadeTimerStatus;
  onStart: () => void;
  onStop: () => void;
};

export function TimerController({ status, onStart, onStop }: TimerControllerProps) {
  return (
    <div>
      <Button key="1" onClick={status !== 'countdowning' ? onStart : onStop}>
        {status !== 'countdowning' ? '開始' : '停止'}
      </Button>
    </div>
  );
}
