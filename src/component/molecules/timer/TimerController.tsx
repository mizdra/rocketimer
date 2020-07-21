import React from 'react';
import Button from '@material-ui/core/Button';
import { useRecoilValue } from 'recoil';
import { statusState } from '../../../recoil/cascade-timer';

export type TimerControllerProps = {
  onStart: () => void;
  onStop: () => void;
};

export function TimerController({ onStart, onStop }: TimerControllerProps) {
  const status = useRecoilValue(statusState);
  return (
    <div>
      <Button key="1" onClick={status !== 'countdowning' ? onStart : onStop}>
        {status !== 'countdowning' ? '開始' : '停止'}
      </Button>
    </div>
  );
}
