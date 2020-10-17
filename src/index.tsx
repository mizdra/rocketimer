import React from 'react';
import { render } from 'react-dom';
import { App } from './App';
import CssBaseline from '@material-ui/core/CssBaseline';
import { RecoilRoot } from 'recoil';
import EventTarget from '@ungap/event-target';

// Safari 向けに EventTarget の polyfill を読み込む
window.EventTarget = EventTarget;

render(
  <>
    <RecoilRoot>
      <CssBaseline />
      <App />
    </RecoilRoot>
  </>,
  document.querySelector('#app'),
);
