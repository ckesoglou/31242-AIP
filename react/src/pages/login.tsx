import React from 'react';
import '../assets/css/login.css';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link'; // Use react-router link instead?
import TextField from '@material-ui/core/TextField';
import { FormControlLabel, Checkbox } from '@material-ui/core';

type LoginProps = {

}

type LoginState = {

}

class Login extends React.Component<LoginProps, LoginState> {
    state: LoginState = {

    };
    render() {
        return (
            <div>
                <form>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="User Name"
                        name="username"
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
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="#">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        )
    }
}

export default Login;