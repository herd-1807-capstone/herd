import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom' 
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Store from './store'
import { Provider } from 'react-redux'

ReactDOM.render(<BrowserRouter><Provider store={Store}><App /></Provider></BrowserRouter>, document.getElementById('root'));
registerServiceWorker();
