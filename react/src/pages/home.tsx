import React from "react";
import { RouteComponentProps, Link as RouterLink } from "react-router-dom";
import "../assets/css/userprofile.css";
import {
  Box,
  Container,
  Grid,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { UserContext } from "../components/user-context";
import SearchIcon from "@material-ui/icons/Search";

type HomeState = {};

interface IHomeProps extends RouteComponentProps {
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

class Home extends React.Component<IHomeProps, HomeState> {
  constructor(props: IHomeProps) {
    super(props);
  }

  state: HomeState = {};

  static contextType: React.Context<{
    user: {};
    updateUser: (newUser: object) => void;
  }> = UserContext;

  render() {
    return (
      <Container component="main" maxWidth="lg">
        <div className="paper">
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <div id="header">
                <Typography component="h2" variant="h4">
                  {"Placeholder IOU"}
                </Typography>
                <Typography component="h1" variant="h4">
                  {"Home"}
                </Typography>
                <Typography component="h3" variant="h4">
                  {"Placeholder Image"}
                </Typography>
              </div>
              <h1>You've reached the next page!</h1>
              <h2>
                <Link component={RouterLink} to="/">
                  Click here to go back!
                </Link>
              </h2>
              <h2>
                <Link component={RouterLink} to="/user">
                  Click here for user page!
                </Link>
                <p>
                  Well well well.. look who it is - {this.context.user.name}!
                </p>
              </h2>
            </Grid>
            <Grid item xs={8}>
              <div className="content">
                <Typography component="h3" variant="h4">
                  {"Requests"}
                </Typography>
                <Box display="inline">
                  <Typography component="h4" variant="h5">
                    {"Filter"}
                  </Typography>
                  <TextField
                    id="filter-input"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </div>
            </Grid>
            <Grid item xs={4}>
              <Paper elevation={3} className="section">
                <Typography component="h3" variant="h4">
                  {"Placeholder Leaderboard"}
                </Typography>
                <Typography>
                  {
                    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
                  }
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Container>
    );
  }
}

export default Home;
