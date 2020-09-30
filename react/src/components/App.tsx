import React from "react";
import "../assets/css/App.css";
import { Switch, Route, BrowserRouter as Router, Link } from "react-router-dom";
import Login from "../pages/login";
import SignUp from "../pages/signup";
import UserProfile from "../pages/userprofile";
import { ProtectedRoute } from "./protected-route";
import { UserContext } from "./user-context";
import IouComplete from "./iou-complete";
import IouTask from "./iou-task";


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
            <ProtectedRoute path="/home">
              <h1>You've reached the next page!</h1>
              <IouTask taskDescription="Give me a hug?"/>
              <IouComplete IOUCompleter='John' IOUtimestamp="Completed on: 02/02/2020" taskCompleted={true}/>
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
        </UserContext.Provider>
      </Router>
    );
  }
}

export default App;
