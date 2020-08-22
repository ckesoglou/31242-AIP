import React from 'react';
import '../assets/css/login.css';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link'; // Use react-router link instead?
import TextField from '@material-ui/core/TextField';
import { Container, Typography } from '@material-ui/core';

type SignUpProps = {

}

type SignUpState = {

}

class SignUp extends React.Component<SignUpProps, SignUpState> {
    state: SignUpState = {

    };

    render() {
        return (
            <Container component="main" maxWidth='xs'>
                <div>
                    <Typography component="h1" variant="h5">
                        Sign Up
                    </Typography>
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
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            Sign Up
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="/">
                                    Sign in instead
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>
        )
    }
}

export default SignUp;