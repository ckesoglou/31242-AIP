import React from 'react';
import '../assets/css/login.css';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link'; // Use react-router link instead?
import TextField from '@material-ui/core/TextField';
import { Container, Typography } from '@material-ui/core';
import { testEndpoint, baseUrl } from '../api/endpoints';

type SignUpProps = {

}

type SignUpState = {
    username: string,
    display_name: string,
    password: string,
}

class SignUp extends React.Component<SignUpProps, SignUpState> {
    state: SignUpState = {
        username: '',
        display_name: '',
        password: '',
    };

    // handle field changes
    handleChange = (input: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ [input]: e.target.value } as Pick<SignUpState, keyof SignUpState>);
    }

    // handle Sign Up button click
    handleClick(): ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined {
        const inputBody = JSON.stringify({
            "username": this.state.username,
            "display_name": this.state.display_name,
            "password": this.state.password,
        });
        const headers = {
            'Content-Type': 'application/json'
        };

        fetch(`${baseUrl}/signup`, // TODO: fix endpoints after API implementation
            {
                method: 'POST',
                body: inputBody,
                headers: headers
            })
            .then(function (res) {
                return res.json();
            }).then(function (body) {
                console.log(body);
            });
        // // test API fetch
        // fetch(testEndpoint)
        //     .then(res => res.json())
        //     .then(
        //         (result) => {
        //             console.log('result: ', result);
        //         },
        //         (error) => {
        //             console.log(error);
        //         }
        //     )
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
                            id="display_name"
                            label="Display Name"
                            name="display_name"
                            onChange={this.handleChange('display_name')}
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
                            onClick={() => this.handleClick()}
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