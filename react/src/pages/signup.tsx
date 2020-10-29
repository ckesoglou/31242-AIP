import React from "react";
import {
  Redirect,
  RouteComponentProps,
  Link as RouterLink,
} from "react-router-dom";
import "../assets/css/login.css";
import { signUpEndpoint } from "../api/endpoints";
import {
  Container,
  Typography,
  CircularProgress,
  FormControl,
  TextField,
  Link,
  Grid,
  Button,
  Grow,
  Paper,
  Snackbar,
} from "@material-ui/core";
import { UserContext } from "../components/user-context";
import { MeetingRoom } from "@material-ui/icons";

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
  snackMessage: string;
};

type PasswordRequirementsObject = {
  specialCharacter: boolean;
  characterLength: boolean;
  uppercaseCharacter: boolean;
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
  private lengthRef: React.RefObject<HTMLInputElement>;
  private uppercaseRef: React.RefObject<HTMLInputElement>;
  private specialRef: React.RefObject<HTMLInputElement>;
  private signUpRef: React.RefObject<HTMLLabelElement>;
  private loadingRef: React.RefObject<HTMLInputElement>;
  private passwordRequirementsRef: React.RefObject<HTMLInputElement>;

  constructor(props: ISignUpProps) {
    super(props);

    this.lengthRef = React.createRef();
    this.uppercaseRef = React.createRef();
    this.specialRef = React.createRef();
    this.signUpRef = React.createRef();
    this.loadingRef = React.createRef();
    this.passwordRequirementsRef = React.createRef();
  }

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
    snackMessage: "",
  };

  static contextType = UserContext;

  setLoading(loading: boolean): void {
    if (loading) {
      this.signUpRef.current!.innerText = "";
      this.loadingRef.current!.style.display = "block";
    } else {
      this.signUpRef.current!.innerText = "Sign Up";
      this.loadingRef.current!.style.display = "none";
    }
  }

  hasUppercase = (str: string) => {
    return /[A-Z]/.test(str);
  };

  hasSpecialCharacter = (str: string) => {
    var specialCharacters = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;

    return specialCharacters.test(str);
  };

  handlePasswordFocus(focus: boolean): void {
    this.setState({ showPasswordRequirements: focus });
    focus
      ? (this.passwordRequirementsRef.current!.style.display = "block")
      : (this.passwordRequirementsRef.current!.style.display = "none");
  }

  handlePasswordChange(currentPassword: string): void {
    this.setState({ password: currentPassword });

    // validate character length
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
            passwordRequirements.specialCharacter = value;
            this.specialRef.current!.style.color = value ? "#86C232" : "red";
            break;
          case "characterLength":
            passwordRequirements.characterLength = value;
            this.lengthRef.current!.style.color = value ? "#86C232" : "red";
            break;
          case "uppercaseCharacter":
            passwordRequirements.uppercaseCharacter = value;
            this.uppercaseRef.current!.style.color = value ? "#86C232" : "red";
            break;
        }

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
  handleSignUp(): void {
    this.setLoading(true);

    fetch(`${signUpEndpoint}`, {
      method: "POST",
      body: JSON.stringify({
        username: this.state.username,
        displayName: this.state.display_name,
        password: this.state.password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 201) {
          // Successful sign up 201
          this.setState({ successfulSignUp: true }, () => {
            this.context.updateUser({
              name: this.state.username,
              password: this.state.password,
            });
          });
        } else {
          // Unsuccessful sign up (400 or 422)
          this.setLoading(false);
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

    if (this.state.successfulSignUp) {
      return <Redirect to={next} />;
    }

    return (
      <Container component="main" maxWidth="xs">
        <div className="paper">
          <Typography id="header" component="h1" variant="h4">
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
              onChange={(e) => this.handlePasswordChange(e.target.value)}
            />
            <div ref={this.passwordRequirementsRef} id="passwordRequirements">
              <Grow in={this.state.showPasswordRequirements} timeout={500}>
                <Paper id="passwordCriteria">
                  <p id="passwordCriteriaHeader">Password Criteria</p>
                  <p ref={this.lengthRef} id="characterLength">
                    Needs to be at least 8 characters
                  </p>
                  <p ref={this.uppercaseRef} id="uppercaseCharacter">
                    Needs to have one upper-case character
                  </p>
                  <p ref={this.specialRef} id="specialCharacter">
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
                !this.state.validPassword ||
                !this.state.display_name ||
                !this.state.username
              }
              color="primary"
              onClick={() => {
                this.handleSignUp();
                this.setState({ submitted: !this.state.submitted });
              }}
            >
              <CircularProgress
                ref={this.loadingRef}
                size={35}
                color="inherit"
                id="loading"
              />
              <label ref={this.signUpRef} id="signUpText">
                Sign Up
              </label>
            </Button>
            <Grid container spacing={1}>
              <Grid item xs={8}>
                <div id="goBack">
                  <MeetingRoom fontSize="small" color="primary" />
                  <Link component={RouterLink} to="/home">
                    {"Home"}
                  </Link>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div id="goSign">
                  <Link
                    component={RouterLink}
                    to={{
                      pathname: "/login",
                      state: { unauthenticated: "" },
                    }}
                  >
                    {"Sign in instead"}
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

export default SignUp;
