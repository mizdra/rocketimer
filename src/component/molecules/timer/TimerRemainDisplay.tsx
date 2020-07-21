import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { DurationView } from './TimerRemainDisplay/DurationView';
import { useRecoilValue } from 'recoil';
import { currentLapRemainState, currentLapTitleState } from '../../../recoil/cascade-timer';

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

export function TimerRemainDisplay() {
  const currentLapTitle = useRecoilValue(currentLapTitleState);
  const currentLapRemain = useRecoilValue(currentLapRemainState);

  const classes = useStyles();
  return (
    <Card>
      <CardContent>
        <Typography className={classes.title}>{currentLapTitle}</Typography>
        <div className={classes.time}>
          <DurationView value={currentLapRemain} />
        </div>
      </CardContent>
    </Card>
  );
}
