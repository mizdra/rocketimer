import CssBaseline from '@material-ui/core/CssBaseline';
import EventTarget from '@ungap/event-target';
import React from 'react';
import { render } from 'react-dom';
import { RecoilRoot } from 'recoil';
import { App } from './App';

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
