import React from 'react';
import ReactDOM from 'react-dom';
import HomeScreen from './Components/Home'
import App from './Components/App'

import './Styles/Board.css'
import './Styles/App.css'
import './Styles/PlayerDisplay.css'
import './Styles/Sidebar.css'

import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <React.StrictMode>
    <HomeScreen></HomeScreen>
      <App></App>
  </React.StrictMode>,
  document.getElementById('root')
);
