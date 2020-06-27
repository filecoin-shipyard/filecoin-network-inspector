import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import Store from "./redux/store";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Chain from "./pages/Chain";
import Miners from "./pages/Miners";
import Miner from "./pages/Miner";
import Market from "./pages/Market";
import Deals from "./pages/Deals";
import Deal from "./pages/Deal";
import NavBar from "./components/NavBar";

function App() {
  return (
    <center>
      <Provider store={Store}>
        <Router>
          <NavBar />
          <Switch>
            <Route path="/chain">
              <Chain />
            </Route>
            <Route path="/miners">
              <Miners />
            </Route>
            <Route path="/miner/:id?">
              <Miner />
            </Route>
            <Route path="/market">
              <Market />
            </Route>
            <Route path="/deals">
              <Deals />
            </Route>
            <Route path="/deal/:id?">
              <Deal />
            </Route>
            <Route path="/">
              <Chain />
            </Route>
          </Switch>
        </Router>
      </Provider>
    </center>
  );
}

export default App;
