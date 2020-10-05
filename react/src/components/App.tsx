import React from "react";
import "../assets/css/App.css";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import Login from "../pages/login";
import SignUp from "../pages/signup";
import UserProfile from "../pages/userprofile";
import Home from "../pages/home";
import { ProtectedRoute } from "./protected-route";
import { UserContext } from "./user-context";
import Leaderboard from "./leaderboard";

type AppState = {
  user: Object;
  updateUser: (newUser: Object) => void;
};

class App extends React.Component {
  state: AppState = {
    user: {},
    updateUser: (newUser: Object) => {
      this.setState({ user: newUser });
    },
  };

  render() {
    return (
      <Router>
        <UserContext.Provider value={this.state}>
          <Switch>
            <ProtectedRoute
              path="/user"
              component={UserProfile}
            ></ProtectedRoute>
            <ProtectedRoute path="/home" component={Home} />
            <Route path="/signup" component={SignUp} />
            <Route path="/" component={Login} />
          </Switch>
        </UserContext.Provider>
      </Router>
    );
  }
}

export default App;
