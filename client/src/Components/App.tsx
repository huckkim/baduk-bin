import { Route, BrowserRouter } from "react-router-dom"
import HomeScreen from "./HomeScreen"
import PlayScreen from "./PlayScreen"
import HomeNavbar from './HomeNavBar'

const App = () => {
  return (
    <BrowserRouter >
      <HomeNavbar />
      <Route exact path="/" component={HomeScreen}/>
      <Route exact path="/play" component={PlayScreen} />
      <Route exact path="/study" />
    </BrowserRouter>

  )
}

export default App;
