import React from 'react';
import { render } from 'react-dom';
import { App } from './App';
import CssBaseline from '@material-ui/core/CssBaseline';
import { RecoilRoot } from 'recoil';

render(
  <>
    <RecoilRoot>
      <CssBaseline />
      <App />
    </RecoilRoot>
  </>,
  document.querySelector('#app'),
);
