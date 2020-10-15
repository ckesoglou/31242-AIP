import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import "../assets/css/home.css";
import {
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  MenuItem,
  Snackbar,
} from "@material-ui/core";
import { UserContext } from "../components/user-context";
import { AvatarWithMenu } from "../components/avatarWithMenu";
import Leaderboard from "../components/leaderboard";
import { Search } from "@material-ui/icons";

type Request = {
  id: string;
  author: {
    username: string;
    display_name: string;
  };
  completed_by: {
    username: string;
    display_name: string;
  };
  proof_of_completion: string; // UUID
  rewards: [
    {
      id: string; // UUID;
      display_name: string;
    }
  ];
  details: string;
  created_time: string;
  is_completed: boolean;
};

type HomeState = {
  filterKey: string | undefined;
  filterValue: string;
  snack: boolean;
  snackMessage: string;
  requests: Request[];
};

class Home extends React.Component<RouteComponentProps, HomeState> {
  private loadingRef: React.RefObject<HTMLInputElement>;

  constructor(props: RouteComponentProps) {
    super(props);

    this.loadingRef = React.createRef();
  }
  state: HomeState = {
    filterKey: undefined,
    filterValue: "",
    snack: false,
    snackMessage: "",
    requests: [],
  };

  static contextType: React.Context<{
    user: {};
    updateUser: (newUser: object) => void;
  }> = UserContext;

  setLoading(value: boolean): void {
    this.loadingRef.current!.style.display = value ? "block" : "none";
  }

  fetchFilter() {
    if (this.state.filterKey) {
      this.setLoading(true);
      let url = new URL("/api/requests", document.baseURI);
      let params: any =
        this.state.filterKey === "Keyword"
          ? { search: this.state.filterValue }
          : { rewards: this.state.filterValue };
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );
      fetch(url.href, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((body) => {
          console.log("Success:", body);
          this.setState({ requests: body });
          this.setState({ snackMessage: "Fetched filtered requests!" });
          this.setLoading(false);
          this.setState({ snack: true });
        })
        .catch((exception) => {
          console.error("Error:", exception);
          this.setState({ snackMessage: exception });
          this.setLoading(false);
          this.setState({ snack: true });
        });
    }
  }

  fetchRequests() {
    this.setLoading(true);
    fetch("/api/requests", {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((body) => {
        console.log("Success:", body);
        this.setState({ requests: body });
        this.setState({ snackMessage: "Fetched requests!" });
        this.setLoading(false);
        this.setState({ snack: true });
      })
      .catch((exception) => {
        console.error("Error:", exception);
        this.setState({ snackMessage: exception });
        this.setLoading(false);
        this.setState({ snack: true });
      });
  }

  componentDidMount() {
    this.fetchRequests();
  }

  render() {
    return (
      <Container component="main" maxWidth="lg">
        <div className="paper">
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <div id="header">
                <Link to="/home">
                  <img
                    width="120"
                    height="80"
                    alt="IOU Logo"
                    src={process.env.PUBLIC_URL + "/iou-logo.png"}
                  />
                </Link>
                <Typography component="h1" variant="h4">
                  {"Home"}
                </Typography>
                <AvatarWithMenu
                  loggedIn={this.context.user.name !== "?"}
                  fullName={this.context.user.name}
                />
              </div>
            </Grid>
            <Grid item xs={8}>
              <Paper elevation={3} className="content">
                <Typography component="h3" variant="h4">
                  {"Requests"}
                </Typography>
                <Box id="filterContainer" display="inline">
                  <Box>
                    <TextField
                      id="filter-menu"
                      select
                      label="Filter by:"
                      variant="outlined"
                      value={this.state.filterKey}
                      onChange={(e) => {
                        this.setState({
                          filterKey: e.target.value as string,
                        });
                      }}
                    >
                      <MenuItem value={"Keyword"}>Keyword</MenuItem>
                      <MenuItem value={"Reward"}>Reward</MenuItem>
                    </TextField>
                  </Box>
                  <Box pl={4}>
                    <TextField
                      size="medium"
                      onChange={(e) =>
                        this.setState({ filterValue: e.target.value })
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search id="search-icon" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  <Box>
                    <Button
                      id="filter-button"
                      size="large"
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        this.fetchFilter();
                      }}
                    >
                      <label>Filter</label>
                    </Button>
                  </Box>
                </Box>
                <Box>
                  {JSON.stringify(this.state.requests)}
                  <CircularProgress
                    ref={this.loadingRef}
                    size={35}
                    color="inherit"
                    id="homeLoading"
                  />
                </Box>
                <Snackbar
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  message={this.state.snackMessage}
                  open={this.state.snack}
                  onClose={() => {
                    this.setState({ snack: false });
                  }}
                  autoHideDuration={5000}
                />
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Leaderboard renderMe={this.context.user.name !== "?"} />
            </Grid>
          </Grid>
        </div>
      </Container>
    );
  }
}

export default Home;
