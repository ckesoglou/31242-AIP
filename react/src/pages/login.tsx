import React from "react";
import {
  Redirect,
  RouteComponentProps,
  Link as RouterLink,
} from "react-router-dom";
import "../assets/css/login.css";
import { loginEndpoint } from "../api/endpoints";
import {
  Container,
  Typography,
  CircularProgress,
  FormControl,
  TextField,
  Link,
  Grid,
  Button,
  Snackbar,
} from "@material-ui/core";
import { UserContext } from "../components/user-context";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import { Authentication } from "../components/protected-route";

type LoginState = {
  username: string;
  password: string;
  error: string;
  submitted: boolean;
  successfulLogin: boolean;
  snackMessage: string;
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
    snackMessage: "",
  };

  static contextType: React.Context<{
    user: {};
    updateUser: (newUser: object) => void;
  }> = UserContext;

  startLoading(): void {
    this.signInRef.current!.innerText = "";
    this.loadingRef.current!.style.display = "block";
  }

  stopLoading(): void {
    this.signInRef.current!.innerText = "Sign In";
    this.loadingRef.current!.style.display = "none";
  }

  handleLogin(): void {
    this.startLoading();

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
        if (res.status === 200) {
          // Successful login 200
          // TODO: Only for development?! Handle frontend auth
          Authentication.authenticate(() => {});
          this.setState({ successfulLogin: true }, () => {
            this.context.updateUser({
              name: this.state.username,
              password: this.state.password,
            });
          });
        } else {
          // Unsuccessful login (400 or 401)
          this.stopLoading();
          res
            .json()
            .then((body) => this.setState({ snackMessage: body.errors }));
          this.setState({ submitted: !this.state.submitted });
        }
      })
      .catch(console.log);
  }

  render() {
    // redirect to previous protected page if previously not authenticated
    const { next } = this.props.location.state || {
      next: { pathname: "/home" },
    };

    if (this.state.successfulLogin) {
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
            <Grid container spacing={1}>
              <Grid item xs={7}>
                <Link href="#">Forgot password?</Link>
              </Grid>
              <Grid item xs={5}>
                <Link component={RouterLink} to="/signup">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
              <Grid item xs>
                <div id="goBack">
                  <MeetingRoomIcon fontSize="small" color="primary" />
                  <Link component={RouterLink} to="/home">
                    {"Head back to home"}
                  </Link>
                </div>
              </Grid>
            </Grid>
          </FormControl>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            message={this.state.snackMessage}
            open={this.state.snackMessage !== ""}
            onClose={() => {
              this.setState({ snackMessage: "" });
            }}
            autoHideDuration={5000}
          />
        </div>
      </Container>
    );
  }
}

export default Login;
