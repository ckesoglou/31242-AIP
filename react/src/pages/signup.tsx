import React from "react";
import "../assets/css/login.css";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link"; // Use react-router link instead?
import TextField from "@material-ui/core/TextField";
import {
  Container,
  Typography,
  CircularProgress,
  FormControl,
} from "@material-ui/core";
import { signUpEndpoint } from "../api/endpoints";
import { Redirect, RouteComponentProps } from "react-router-dom";

type SignUpState = {
  username: string;
  display_name: string;
  password: string;
  error: string;
  successfulSignUp: boolean;
};

interface ISignUpProps extends RouteComponentProps {
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

class SignUp extends React.Component<ISignUpProps, SignUpState> {
  state: SignUpState = {
    username: "",
    display_name: "",
    password: "",
    error: "",
    successfulSignUp: false,
  };

  setLoading(): void {
    let signUpText = document.getElementById("signUpText");
    let loading = document.getElementById("loading");
    if (loading) {
      loading.style.display = "block";
    }
    if (signUpText) {
      signUpText.innerText = "";
    }
  }

  // handle Sign Up button click
  handleSignUp(username: string, display_name: string, password: string): void {
    this.setLoading();

    const inputBody = JSON.stringify({
      username: username,
      display_name: display_name,
      password: password,
    });

    const headers = {
      "Content-Type": "application/json",
    };

    fetch(
      `${signUpEndpoint}`, // TODO: fix endpoints after API implementation
      {
        method: "POST",
        body: inputBody,
        headers: headers,
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((body) => {
        console.log("Success:", body);
        this.setState({ successfulSignUp: true });
      })
      .catch((exception) => {
        console.error("Error:", exception);
        this.setState({ error: exception });
      });
    return;
  }

  render() {
    // redirect to previous protected page if previously not authenticated
    const { next } = this.props.location.state || {
      next: { pathname: "/home" },
    };

    if (this.state.successfulSignUp) {
      return <Redirect to={next} />;
    }

    return (
      <Container component="main" maxWidth="xs">
        <div className="paper">
          <Typography component="h1" variant="h5">
            Sign Up
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
              id="display_name"
              label="Display Name"
              name="display_name"
              value={this.state.display_name}
              onChange={(e) => this.setState({ display_name: e.target.value })}
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
                this.handleSignUp(
                  this.state.username,
                  this.state.display_name,
                  this.state.password
                )
              }
            >
              <CircularProgress size={35} color="inherit" id="loading" />
              <label id="signUpText">Sign Up</label>
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/">Sign in instead</Link>
              </Grid>
            </Grid>
          </FormControl>
        </div>
      </Container>
    );
  }
}

export default SignUp;
