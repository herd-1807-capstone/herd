import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom' 
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Store from './store'
import { Provider } from 'react-redux'

ReactDOM.render(<Provider store={Store}><BrowserRouter><App /></BrowserRouter></Provider>, document.getElementById('root'));
registerServiceWorker();
