import React from 'react';
import ReactDOM from 'react-dom';
import App from './Components/App'

import './Styles/Board.css'
import './Styles/App.css'
import './Styles/PlayerDisplay.css'
import './Styles/Sidebar.css'

ReactDOM.render(
  <React.StrictMode>
    <App></App>
  </React.StrictMode>,
  document.getElementById('root')
);
