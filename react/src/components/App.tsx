import React from "react";
import "../assets/css/App.css";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import Login from "../pages/login";
import SignUp from "../pages/signup";
import UserProfile from "../pages/userprofile";
import Home from "../pages/home";
import { ProtectedRoute } from "./protected-route";
import { UserContext } from "./user-context";
import IouComplete from "./iou-complete";
import IouTask from "./iou-task";
import IouProof from "./iou-proof";
import IouFavour from "./iou-single-favour";


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
              <IouProof imagePK="1"/>
              <IouTask taskDescription="Give me a hug?"/>
              <IouComplete IOUCompleter='John' IOUtimestamp="Completed on: 02/02/2020" taskCompleted={false} requestID="1"/>
              <IouFavour giverUsername="James" recieverUsername="Kevin" items={[{id:"2", display_name:"Coffee"}]}/>
            </ProtectedRoute>
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
