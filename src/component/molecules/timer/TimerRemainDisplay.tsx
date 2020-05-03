import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { DurationView } from '../../atoms/DurationView';

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

export type TimerRemainDisplayProps = {
  title: string;
  remain: number;
};

export function TimerRemainDisplay({ title, remain }: TimerRemainDisplayProps) {
  const classes = useStyles();
  return (
    <Card>
      <CardContent>
        <Typography className={classes.title}>{title}</Typography>
        <div className={classes.time}>
          <DurationView value={remain} />
        </div>
      </CardContent>
    </Card>
  );
}
