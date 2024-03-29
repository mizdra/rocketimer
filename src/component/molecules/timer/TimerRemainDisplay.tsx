import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { UseCascadeTimerResult } from '../../../hook/timer/use-cascade-timer';
import { useOffsetChangeShortcut } from '../../../hook/timer/use-offset-change-shortcut';
import { lapRemainState, lapTitleState } from '../../../recoil/cascade-timer';
import { DurationView } from './TimerRemainDisplay/DurationView';

const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
    fontSize: '3vw',
  },
  time: {
    textAlign: 'center',
    fontSize: '10vw',
  },
}));

export function TimerRemainDisplay(props: { setOffset: UseCascadeTimerResult['setOffset'] }) {
  const lapTitle = useRecoilValue(lapTitleState);
  const lapRemain = useRecoilValue(lapRemainState);

  useOffsetChangeShortcut(props.setOffset);

  const classes = useStyles();
  return (
    <Card>
      <CardContent>
        <Typography className={classes.title}>{lapTitle}</Typography>
        <div className={classes.time}>
          <DurationView value={lapRemain} />
        </div>
      </CardContent>
    </Card>
  );
}
