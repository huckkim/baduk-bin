import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import HomeScreen from './Components/HomeScreen'

import './Styles/Board.css'
import './Styles/App.css'
import './Styles/PlayerDisplay.css'
import './Styles/Sidebar.css'

import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <BrowserRouter>
    <HomeScreen />
  </BrowserRouter>,
  document.getElementById('root')
);
