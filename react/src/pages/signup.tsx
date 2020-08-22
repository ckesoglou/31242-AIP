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
    username: string,
    displayName: string,
    password: string,
}

class SignUp extends React.Component<SignUpProps, SignUpState> {
    state: SignUpState = {
        username: '',
        displayName: '',
        password: '',
    };

    // handle field changes
    handleChange = (input: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ [input]: e.target.value } as Pick<SignUpState, keyof SignUpState>);
    }

    // handle Sign Up button click
    handleClick(): ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined {
        // throw new Error("Method not implemented.");
        console.log(this.state.username, '\n', this.state.displayName, '\n', this.state.password);
        return;

    }

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
                            onChange={this.handleChange('username')}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="displayName"
                            label="Display Name"
                            name="displayName"
                            onChange={this.handleChange('displayName')}
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
                            onChange={this.handleChange('password')}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={this.handleClick()}
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