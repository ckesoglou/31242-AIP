import React from "react";
import "../assets/css/login.css";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link"; // Use react-router link instead?
import TextField from "@material-ui/core/TextField";
import {
  Container,
  Typography,
  FormControl,
  CircularProgress,
} from "@material-ui/core";
import { loginEndpoint } from "../api/endpoints";
import { Redirect, RouteComponentProps } from "react-router-dom";

type LoginState = {
  username: string;
  password: string;
  error: string;
  successfulLogin: boolean;
};

interface LoginProps extends RouteComponentProps {
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

class Login extends React.Component<LoginProps, LoginState> {
  state: LoginState = {
    username: "",
    password: "",
    error: "",
    successfulLogin: false,
  };

  setLoading(): void {
    let signInText = document.getElementById("signInText");
    let loading = document.getElementById("loading");
    if (loading) {
      loading.style.display = "block";
    }
    if (signInText) {
      signInText.innerText = "";
    }
  }

  handleLogin = (username: string, password: string) => {
    this.setLoading();

    const inputBody = JSON.stringify({
      username: username,
      password: password,
    });

    const headers = {
      "Content-Type": "application/json",
    };

    fetch(`${loginEndpoint}`, {
      method: "POST",
      body: inputBody,
      headers: headers,
    })
      .then((res) => {
        return res.json();
      })
      .then((body) => {
        console.log("Success:", body);
        this.setState({ successfulLogin: true });
      })
      .catch((exception) => {
        console.error("Error:", exception);
        this.setState({ error: exception });
      });
  };

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
          <Typography component="h1" variant="h5">
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
              color="primary"
              onClick={() =>
                this.handleLogin(this.state.username, this.state.password)
              }
            >
              <CircularProgress size={35} color="inherit" id="loading" />
              <label id="signInText">Sign In</label>
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#">Forgot password?</Link>
              </Grid>
              <Grid item>
                <Link href="#">{"Don't have an account? Sign Up"}</Link>
              </Grid>
            </Grid>
          </FormControl>
        </div>
      </Container>
    );
  }
}

export default Login;
