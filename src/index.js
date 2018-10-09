import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import './css/index.css';
import App from './components/App';
import registerServiceWorker from './utils/registerServiceWorker';
import Store from './store'
import { Provider } from 'react-redux'

ReactDOM.render(
  <Provider store={Store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'));

registerServiceWorker();
