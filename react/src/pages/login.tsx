import React from "react";
import "../assets/css/login.css";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link"; // Use react-router link instead?
import TextField from "@material-ui/core/TextField";
import { Container, Typography, FormControl } from "@material-ui/core";
import { loginEndpoint } from "../api/endpoints";
import { Redirect } from "react-router-dom";

type LoginProps = {};

type LoginState = {
  username: string;
  password: string;
  error: string;
  successfulLogin: boolean;
};

class Login extends React.Component<LoginProps, LoginState> {
  state: LoginState = {
    username: "",
    password: "",
    error: "",
    successfulLogin: false,
  };

  handleLogin = (username: string, password: string) => {
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
      .catch((error) => {
        console.error("Error:", error);
        this.setState({ error: document.cookie });
      });
  };

  render() {
    if (this.state.successfulLogin) {
      return (
        <Redirect
          to={{
            pathname: "/home",
            state: { username: this.state.username },
          }}
        />
      );
    }

    return (
      <Container component="main" maxWidth="xs">
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <FormControl>
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
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={() =>
              this.handleLogin(this.state.username, this.state.password)
            }
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#">Forgot password?</Link>
            </Grid>
            <Grid item>
              <Link href="#">{"Don't have an account? Sign Up"}</Link>
            </Grid>
          </Grid>
          <div
            style={{
              textOverflow: "ellipsis",
              width: "10rem",
            }}
          >
            The token is.....{this.state.error}
          </div>
        </FormControl>
      </Container>
    );
  }
}

export default Login;
