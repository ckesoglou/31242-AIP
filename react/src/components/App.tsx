import React from "react";
import "../assets/css/App.css";
import { Switch, Route, Link, BrowserRouter as Router } from "react-router-dom";
import Login from "../pages/login";

function App() {
  return (
    <Router>
      <div>
        <Link to="/about">About</Link>
        <Link to="/users">User</Link>
        <Link to="/home">Home</Link>
        <Link to="/">Login</Link>

        <Switch>
          <Route path="/about">
            <h1>About!</h1>
          </Route>
          <Route path="/users">
            <h1>Users!</h1>
          </Route>
          <Route path="/home">
            <h1>Home!</h1>
          </Route>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
