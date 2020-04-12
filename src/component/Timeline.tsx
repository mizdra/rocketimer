import React, { useRef, useEffect } from 'react';
import { Timeline as VisTimeline } from 'vis-timeline/esnext';
import { DataSet } from 'vis-data/esnext';

export type TimelineProps = {};

export function Timeline(props: TimelineProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log(ref.current);
    if (ref.current === null) return;
    const items = new DataSet([
      { id: 1, content: 'item 1', start: '2014-04-20' },
      { id: 2, content: 'item 2', start: '2014-04-14' },
      { id: 3, content: 'item 3', start: '2014-04-18' },
      { id: 4, content: 'item 4', start: '2014-04-16', end: '2014-04-19' },
      { id: 5, content: 'item 5', start: '2014-04-25' },
      { id: 6, content: 'item 6', start: '2014-04-27', type: 'point' },
    ]);
    // Configuration for the Timeline
    const options = {};

    // Create a Timeline
    const timeline = new VisTimeline(ref.current, items, options);
  }, [ref.current]);

  return <div ref={ref} />;
}
