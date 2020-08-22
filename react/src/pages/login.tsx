import React from 'react';
import '../assets/css/login.css';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link'; // Use react-router link instead?
import TextField from '@material-ui/core/TextField';
import { Container, Typography, FormControl } from '@material-ui/core';

type LoginProps = {
}

type LoginState = {
    username : string;
    password : string;
    error : string;
}

class Login extends React.Component<LoginProps, LoginState> {
    state: LoginState = {
        username: '',
        password: '',
        error: '',
    };

    handleLogin = (username: string, password: string) => {
        const inputBody = JSON.stringify({
            "username": username,
            "password": password,
        });

        const headers = {
            'Content-Type': 'application/json'
        };

        fetch('/login',
        {
            method: 'POST',
            body: inputBody,
            headers: headers
        })
        .then(function(res) {
            return res.json();
        }).then(function(body) {
            console.log(body);
        });
    }

    render() {
        return (
            <Container component="main" maxWidth='xs'>
                <div>
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
                            onChange={(e) => this.setState({username: e.target.value})}
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
                            onChange={(e) => this.setState({password: e.target.value})}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={() => this.handleLogin(this.state.username, this.state.password)}
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
                    </FormControl>
                </div>
            </Container>
        )
    }
}

export default Login;