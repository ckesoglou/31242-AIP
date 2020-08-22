import React from 'react';
import '../assets/css/App.css';
import {
  Switch,
  Route,
  Link
} from "react-router-dom";
import Login from '../pages/login';
import SignUp from '../pages/signup';

function App() {
  return (
    <div>
      <Link to="/about">About</Link>
      <Link to="/users">User</Link>
      <Link to="/home">Home</Link>
      <Link to="/">Login</Link>
      <Link to="/signup">Sign Up</Link>

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
        <Route path="/signup">
          <SignUp />
        </Route>
        <Route path="/">
          <Login />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
