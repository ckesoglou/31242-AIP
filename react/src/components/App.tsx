import React from "react";
import "../assets/css/App.css";
<<<<<<< HEAD
import { Switch, Route, Link } from "react-router-dom";
import Login from "../pages/login";
import SignUp from "../pages/signup";

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
=======
import { Switch, Route, BrowserRouter as Router, Link } from "react-router-dom";
import Login from "../pages/login";
import { ProtectedRoute } from "./protectedRoute";

function App() {
  return (
    <Router>
      <Switch>
        <ProtectedRoute path="/users"></ProtectedRoute>
        <ProtectedRoute path="/home">
          <h1>You've reached the next page!</h1>
          <h2>
            <Link to="/">Click here to go back!</Link>
          </h2>
        </ProtectedRoute>
        <Route path="/" component={Login} />
>>>>>>> 13584228-login-front-end
      </Switch>
    </Router>
  );
}

export default App;
