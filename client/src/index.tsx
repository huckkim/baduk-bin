import React from 'react';
import ReactDOM from 'react-dom';
import App from './Components/App'
import HomeNavbar from './Components/HomeNavBar'

import './Styles/Board.css'
import './Styles/App.css'
import './Styles/PlayerDisplay.css'
import './Styles/Sidebar.css'

import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <React.StrictMode>
    <HomeNavbar></HomeNavbar>
    <App></App>
  </React.StrictMode>,
  document.getElementById('root')
);
