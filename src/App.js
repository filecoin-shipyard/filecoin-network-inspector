import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import Store from "./redux/store";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Chain from "./pages/Chain";
import Miners from "./pages/Miners";
import StorageMarket from "./pages/StorageMarket";
import RetrievalMarket from "./pages/RetrievalMarket";

function App() {
  return (
    <center>
      <Provider store={Store}>
        <Router>
          <Switch>
            <Route path="/chain">
              <Chain />
            </Route>
            <Route path="/miners">
              <Miners />
            </Route>
            <Route path="/storage-market">
              <StorageMarket />
            </Route>
            <Route path="/retrieval-market">
              <RetrievalMarket />
            </Route>
          </Switch>
        </Router>
      </Provider>
    </center>
  );
}

export default App;
