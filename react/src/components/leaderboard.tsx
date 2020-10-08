import React from "react";
import "../assets/css/leaderboard.css";
import {
  leaderboardAllEndpoint,
  leaderboardMeEndpoint,
} from "../api/endpoints";
import {
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import { UserContext } from "../components/user-context";
import LeaderboardUser from "./leaderboardUser";

type LeaderboardUser = {
  rank: number;
  user: { username: string; display_name: string };
  score: number;
};

type LeaderboardState = {
  users: LeaderboardUser[];
  me:
    | {
        rank: number;
        score: number;
      }
    | undefined;
  error: string;
};

type LeaderboardProps = {};

class Leaderboard extends React.Component<LeaderboardProps, LeaderboardState> {
  private loadingRef: React.RefObject<HTMLInputElement>;
  private textRef: React.RefObject<HTMLInputElement>;

  constructor(props: LeaderboardProps) {
    super(props);

    this.loadingRef = React.createRef();
    this.textRef = React.createRef();
  }

  state: LeaderboardState = {
    users: [],
    error: "",
    me: undefined,
  };

  componentDidMount() {
    this.fetchAllLeaderboard();
    this.fetchMeLeaderboard();
  }

  static contextType: React.Context<{
    user: {};
    updateUser: (newUser: object) => void;
  }> = UserContext;

  setLoading(value: boolean): void {
    this.loadingRef.current!.style.display = value ? "block" : "none";
    this.textRef.current!.style.display = value ? "none" : "block";
  }

  fetchAllLeaderboard() {
    this.setLoading(true);
    fetch(`${leaderboardAllEndpoint}`, {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((body) => {
        console.log("Success:", body);
        this.setState({ users: body });
        this.setState({ error: "" });
        this.setLoading(false);
      })
      .catch((exception) => {
        console.error("Error:", exception);
        this.setState({ error: exception });
      });
  }

  fetchMeLeaderboard() {
    fetch(`${leaderboardMeEndpoint}`, {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((body) => {
        console.log("Success:", body);
        this.setState({ me: body });
        this.setState({ error: "" });
      })
      .catch((exception) => {
        console.error("Error:", exception);
        this.setState({ error: exception });
      });
  }

  render() {
    return (
      <Paper elevation={3} className="content">
        <Container id="leaderboardContainer" component="main" maxWidth="lg">
          <Typography id="leaderboardHeader" component="h3" variant="h4">
            {"Leaderboard"}
          </Typography>
          <Grid
            container
            direction="column"
            justify="space-between"
            spacing={1}
          >
            <Grid item xs={12}>
              <Grid container direction="row">
                <Grid id="leaderboardItem" item xs={3}>
                  <Typography variant="subtitle1">Rank</Typography>
                </Grid>
                <Grid id="leaderboardItem" item xs={3}>
                  <Typography variant="subtitle1">Username</Typography>
                </Grid>
                <Grid id="leaderboardItem" item xs={3}>
                  <Typography variant="subtitle1">Score</Typography>
                </Grid>
                <Grid id="leaderboardItem" item xs={3}>
                  <Typography variant="subtitle1">Avatar</Typography>
                </Grid>
              </Grid>
            </Grid>
            <CircularProgress
              ref={this.loadingRef}
              size={35}
              color="inherit"
              id="leaderboardLoading"
            />
            {this.state.users.map((user, i) => {
              return (
                <Grid item xs={12}>
                  <LeaderboardUser
                    key={i}
                    rank={user.rank}
                    username={user.user.username}
                    score={user.score}
                  />
                </Grid>
              );
            })}
          </Grid>
          <Pagination
            id="pagination"
            count={10}
            defaultPage={1}
            siblingCount={0}
            color="primary"
          />
          {/* <Pagination count={10} page={page} onChange={handleChange} /> */}
          <Divider variant="middle" />
          <div id="meScore" ref={this.textRef}>
            <Typography variant="h6">
              And you are rank {this.state.me?.rank} with a score of{" "}
              {this.state.me?.score}!
            </Typography>
            <img
              width="40"
              height="40"
              src={process.env.PUBLIC_URL + "/raising-hands.png"}
            />
            <img
              width="40"
              height="40"
              src={process.env.PUBLIC_URL + "/party-popper.png"}
            />
          </div>
        </Container>
      </Paper>
    );
  }
}

export default Leaderboard;
