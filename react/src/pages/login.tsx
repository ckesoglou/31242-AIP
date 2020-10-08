import React from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";
import "../assets/css/login.css";
import { loginEndpoint } from "../api/endpoints";
import { Authentication } from "../components/protected-route";
import {
  Container,
  Typography,
  CircularProgress,
  FormControl,
  TextField,
  Link,
  Grid,
  Button,
} from "@material-ui/core";
import { UserContext } from "../components/user-context";

type LoginState = {
  username: string;
  password: string;
  error: string;
  submitted: boolean;
  successfulLogin: boolean;
};

interface ILoginProps extends RouteComponentProps {
  location: {
    key: string;
    pathname: string;
    search: string;
    hash: string;
    state: {
      next: {
        pathname: string;
      };
    };
  };
}

class Login extends React.Component<ILoginProps, LoginState> {
  private signInRef: React.RefObject<HTMLLabelElement>;
  private loadingRef: React.RefObject<HTMLInputElement>;

  constructor(props: ILoginProps) {
    super(props);

    this.signInRef = React.createRef();
    this.loadingRef = React.createRef();
  }
  state: LoginState = {
    username: "",
    password: "",
    error: "",
    submitted: false,
    successfulLogin: false,
  };

  static contextType: React.Context<{
    user: {};
    updateUser: (newUser: object) => void;
  }> = UserContext;

  setLoading(): void {
    this.signInRef.current!.innerText = "";
    this.loadingRef.current!.style.display = "block";
  }

  handleLogin(): void {
    this.setLoading();

    fetch(`${loginEndpoint}`, {
      method: "POST",
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((body) => {
        console.log("Success:", body);
        this.setState({ successfulLogin: true }, () => {
          this.context.updateUser({
            name: this.state.username,
            password: this.state.password,
          });
        });
      })
      .catch((exception) => {
        console.error("Error:", exception);
        this.setState({ error: exception });
      });
  }

  render() {
    // redirect to previous protected page if previously not authenticated
    const { next } = this.props.location.state || {
      next: { pathname: "/home" },
    };

    if (this.state.successfulLogin) {
      // TODO: Only for development! To be deleted
      Authentication.authenticate(() => {});
      return <Redirect to={next} />;
    }

    return (
      <Container component="main" maxWidth="xs">
        <div className="paper">
          <Typography id="header" component="h1" variant="h4">
            Sign In
          </Typography>
          <FormControl className="form">
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="User Name"
              name="username"
              value={this.state.username}
              onChange={(e) => this.setState({ username: e.target.value })}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              name="password"
              type="password"
              value={this.state.password}
              onChange={(e) => this.setState({ password: e.target.value })}
            />
            <Button
              id="submit"
              type="submit"
              fullWidth
              size="large"
              variant="contained"
              disabled={
                this.state.submitted ||
                !this.state.username ||
                !this.state.password
              }
              color="primary"
              onClick={() => {
                this.handleLogin();
                this.setState({ submitted: !this.state.submitted });
              }}
            >
              <CircularProgress
                ref={this.loadingRef}
                size={35}
                color="inherit"
                id="loading"
              />
              <label ref={this.signInRef} id="signInText">
                Sign In
              </label>
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#">Forgot password?</Link>
              </Grid>
              <Grid item>
                <Link href="/signup">{"Don't have an account? Sign Up"}</Link>
              </Grid>
            </Grid>
          </FormControl>
        </div>
      </Container>
    );
  }
}

export default Login;
