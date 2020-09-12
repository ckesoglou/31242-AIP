import React from "react";
import "../assets/css/App.css";
import { Switch, Route, BrowserRouter as Router, Link } from "react-router-dom";
import Login from "../pages/login";
import SignUp from "../pages/signup";
import UserProfile from "../pages/userprofile";
import { ProtectedRoute } from "./protectedRoute";

function App() {
  return (
    <Router>
      <Switch>
        <ProtectedRoute path="/user" component={UserProfile}></ProtectedRoute>
        <ProtectedRoute path="/home">
          <h1>You've reached the next page!</h1>
          <h2>
            <Link to="/">Click here to go back!</Link>
          </h2>
          <h2>
            <Link to="/user">Click here for user page!</Link>
          </h2>
        </ProtectedRoute>
        <Route path="/signup" component={SignUp} />
        <Route path="/" component={Login} />
      </Switch>
    </Router>
  );
}

export default App;
