import React from "react";
import "../assets/css/App.css";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import Login from "../pages/login";
import SignUp from "../pages/signup";
import UserProfile from "../pages/userprofile";
import Home from "../pages/home";
import { ProtectedRoute } from "./protected-route";
import { UserContext } from "./user-context";
import Request from "./request";


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
              <Request request={{
                id: "1",
                author: {username:"James", display_name: "James"},
                completed_by: {username:"Kevin", display_name: "Kevin"},
                proof_of_completion: "",
                rewards: [{id:"1", display_name:"Hug"}, {id:"2", display_name:"Coffee"}],
                details: "Clean the fridge",
                created_time: "02/02/2020",
                comletion_time: "02/02/2020",
                is_completed: false,
              }}/>
              <Request request={{
                id: "1",
                author: {username:"James", display_name: "James"},
                completed_by: {username:"Kevin", display_name: "Kevin"},
                proof_of_completion: "",
                rewards: [{id:"1", display_name:"Hug"}],
                details: "Clean the fridge",
                created_time: "02/02/2020",
                comletion_time: "02/02/2020",
                is_completed: false,
              }}/>
              <Request request={{
                id: "1",
                author: {username:"James", display_name: "James"},
                completed_by: {username:"Kevin", display_name: "Kevin"},
                proof_of_completion: "",
                rewards: [{id:"1", display_name:"Hug"}, {id:"2", display_name:"Coffee"}],
                details: "Clean the fridge",
                created_time: "02/02/2020",
                comletion_time: "02/02/2020",
                is_completed: true,
              }}/>
            </ProtectedRoute>
            {/* <ProtectedRoute path="/home" component={Home} /> */}
            <Route path="/signup" component={SignUp} />
            <Route path="/" component={Login} />
          </Switch>
        </UserContext.Provider>
      </Router>
    );
  }
}

export default App;
