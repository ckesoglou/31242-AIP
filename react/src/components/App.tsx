import React from "react";
import "../assets/css/App.css";
import {
  Switch,
  Route,
  BrowserRouter as Router,
  Redirect,
  Link,
} from "react-router-dom";
import Login from "../pages/login";

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
      </Switch>
    </Router>
  );
}

// mock auth
const Authentication = {
  isAuthenticated: false,
  authenticate(cb: () => void) {
    this.isAuthenticated = true;
    setTimeout(cb, 3000); // fake async
  },
  signout(cb: () => void) {
    this.isAuthenticated = false;
    setTimeout(cb, 3000);
  },
};

// thanks to some random person
const ProtectedRoute: React.ComponentType<any> = ({
  component: Component,
  ...rest
}) => {
  // remove below
  Authentication.authenticate(() => {});
  return (
    <Route
      {...rest}
      render={(props) =>
        // add api get check cookie
        Authentication.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default App;
