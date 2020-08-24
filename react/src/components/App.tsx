import React from "react";
import "../assets/css/App.css";
import {
  Switch,
  Route,
  Link,
  BrowserRouter as Router,
  Redirect,
  RouteComponentProps,
} from "react-router-dom";
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
          <ProtectedRoute path="/home" component={Home}></ProtectedRoute>
          <Route path="/" component={Login} />
        </Switch>
      </div>
    </Router>
  );
}

interface HomeProps extends RouteComponentProps {}

type HomeState = {
  username: string;
};

class Home extends React.Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
    this.state = {
      username: "",
    };
  }

  render() {
    return (
      <div>
        <h1>Home!</h1>
      </div>
    );
  }
}

// mock auth
const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb: () => void) {
    this.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb: () => void) {
    this.isAuthenticated = false;
    setTimeout(cb, 100);
  },
};

const ProtectedRoute: React.ComponentType<any> = ({
  component: Component,
  ...rest
}) => {
  // remove below
  fakeAuth.authenticate(() => {});
  return (
    <Route
      {...rest}
      render={(props) =>
        // add api get check cookie
        fakeAuth.isAuthenticated ? (
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
