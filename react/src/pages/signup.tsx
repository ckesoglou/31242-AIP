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
  Grow,
  Paper,
} from "@material-ui/core";
import { signUpEndpoint } from "../api/endpoints";
import { Redirect, RouteComponentProps } from "react-router-dom";

type SignUpState = {
  username: string;
  display_name: string;
  password: string;
  error: string;
  submitted: boolean;
  successfulSignUp: boolean;
  showPasswordRequirements: boolean;
  passwordRequirements: PasswordRequirementsObject;
  validPassword: boolean | undefined;
};

interface PasswordRequirementsObject {
  specialCharacter: boolean;
  characterLength: boolean;
  uppercaseCharacter: boolean;
}

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
    submitted: false,
    successfulSignUp: false,
    showPasswordRequirements: false,
    passwordRequirements: {
      specialCharacter: false,
      characterLength: false,
      uppercaseCharacter: false,
    },
    validPassword: undefined,
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

  hasUppercase = (str: string) => {
    return /[A-Z]/.test(str);
  };

  hasSpecialCharacter = (str: string) => {
    var specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    return specialCharacters.test(str);
  };

  handlePasswordFocus(focus: boolean): void {
    this.setState({ showPasswordRequirements: focus });
    focus
      ? (document.getElementById("passwordRequirements")!.style.display =
          "block")
      : (document.getElementById("passwordRequirements")!.style.display =
          "none");
  }

  handlePasswordChange(currentPassword: string): void {
    this.setState({ password: currentPassword });

    // validate character length - seven is used because this event occurs on change
    if (currentPassword.length >= 8) {
      this.setPasswordFieldState("characterLength", true);
    } else {
      this.setPasswordFieldState("characterLength", false);
      this.setState({ validPassword: false });
    }

    // validate upper case character exists
    if (this.hasUppercase(currentPassword)) {
      this.setPasswordFieldState("uppercaseCharacter", true);
    } else {
      this.setPasswordFieldState("uppercaseCharacter", false);
      this.setState({ validPassword: false });
    }

    // validate special character exists
    if (this.hasSpecialCharacter(currentPassword)) {
      this.setPasswordFieldState("specialCharacter", true);
    } else {
      this.setPasswordFieldState("specialCharacter", false);
      this.setState({ validPassword: false });
    }
  }

  setPasswordFieldState(fieldName: string, value: boolean) {
    this.setState(
      (prevState) => {
        let passwordRequirements = Object.assign(
          {},
          prevState.passwordRequirements
        );
        switch (fieldName) {
          case "specialCharacter":
            passwordRequirements.specialCharacter = value ? true : false;
            break;
          case "characterLength":
            passwordRequirements.characterLength = value ? true : false;
            break;
          case "uppercaseCharacter":
            passwordRequirements.uppercaseCharacter = value ? true : false;
            break;
        }
        document.getElementById(fieldName)!.style.color = value ? "" : "red";

        return { passwordRequirements };
      },
      () => {
        // check whether all requirements have been met
        Object.values(this.state.passwordRequirements).every(
          (item) => item === true
        )
          ? this.setState({ validPassword: true })
          : this.setState({ validPassword: false });
      }
    );
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
              onFocus={() => this.handlePasswordFocus(false)}
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
              onFocus={() => this.handlePasswordFocus(false)}
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
              error={
                this.state.validPassword !== undefined &&
                !this.state.validPassword
              }
              onFocus={() => {
                this.handlePasswordFocus(true);
              }}
              // onBlur={() => {
              //   this.handlePasswordFocus(false);
              // }}
              onChange={(e) => this.handlePasswordChange(e.target.value)}
            />
            <div id="passwordRequirements">
              <Grow in={this.state.showPasswordRequirements} timeout={500}>
                <Paper id="passwordCriteria">
                  <p id="passwordCriteriaHeader">Password Criteria</p>
                  <p id="characterLength">Needs to be at least 8 characters</p>
                  <p id="uppercaseCharacter">
                    Needs to have one upper-case character
                  </p>
                  <p id="specialCharacter">
                    Needs to have one special character - e.g. !@#$%
                  </p>
                </Paper>
              </Grow>
            </div>
            <Button
              id="submit"
              type="submit"
              fullWidth
              size="large"
              variant="contained"
              disabled={
                this.state.submitted ||
                this.state.validPassword === undefined ||
                !this.state.validPassword
              }
              color="primary"
              onClick={() => {
                this.handleSignUp(
                  this.state.username,
                  this.state.display_name,
                  this.state.password
                );
                this.setState({ submitted: !this.state.submitted });
              }}
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
