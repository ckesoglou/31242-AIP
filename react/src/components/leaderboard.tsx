import React from "react";
import "../assets/css/leaderboard.css";
import {
  leaderboardAllEndpoint,
  leaderboardMeEndpoint,
} from "../api/endpoints";
import {
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import LeaderboardUser from "./leaderboardUser";
import { UserContext } from "./user-context";

type LeaderboardUser = {
  rank: number;
  user: { username: string; display_name: string };
  score: number;
};

type LeaderboardState = {
  users: LeaderboardUser[];
  me: {
    rank: number;
    score: number;
  };
  showMe: boolean;
  error: string;
  pageNumber: number;
};

type LeaderboardProps = {};

const numberOfItemsPerPage = 3;

class Leaderboard extends React.Component<LeaderboardProps, LeaderboardState> {
  private loadingRef: React.RefObject<HTMLInputElement>;

  constructor(props: LeaderboardProps) {
    super(props);

    this.loadingRef = React.createRef();
  }

  state: LeaderboardState = {
    users: [],
    error: "",
    me: { rank: -1, score: -1 },
    showMe: false,
    pageNumber: 1,
  };

  componentDidMount() {
    this.fetchAllLeaderboard();
    this.fetchMeLeaderboardIfNeeded();
  }

  static contextType = UserContext;

  fetchMeLeaderboardIfNeeded = () => {
    if (this.context.user.name !== "?") {
      this.fetchMeLeaderboard();
    }
  };

  setLoading(value: boolean): void {
    this.loadingRef.current!.style.display = value ? "block" : "none";
  }

  setCountOfLeaderboard(): number {
    if (this.state.users.length % numberOfItemsPerPage !== 0) {
      return Math.ceil(this.state.users.length / numberOfItemsPerPage);
    } else {
      return this.state.users.length / numberOfItemsPerPage;
    }
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
        this.setLoading(false);
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
        this.setState({ me: body }, () => {
          this.setState({ showMe: true });
        });
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
            {this.state.error}
            {/* kudos to
            https://stackoverflow.com/questions/61774099/how-to-add-pagination-to-a-long-list-using-react-materialui */}
            {this.state.users
              .slice(
                (this.state.pageNumber - 1) * numberOfItemsPerPage,
                this.state.pageNumber * numberOfItemsPerPage
              )
              .map((user, i) => {
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
            count={this.setCountOfLeaderboard()}
            page={this.state.pageNumber}
            onChange={(event: React.ChangeEvent<unknown>, value: number) => {
              this.setState({ pageNumber: value });
            }}
            defaultPage={1}
            siblingCount={0}
            color="primary"
          />
          <Divider variant="middle" />
          {this.state.showMe && (
            <div id="meScore">
              <Typography variant="h6">
                And you are rank {this.state.me?.rank} with a score of{" "}
                {this.state.me?.score}!
              </Typography>
              <img
                alt="Raising hands"
                width="40"
                height="40"
                src={process.env.PUBLIC_URL + "/raising-hands.png"}
              />
              <img
                alt="Party popper"
                width="40"
                height="40"
                src={process.env.PUBLIC_URL + "/party-popper.png"}
              />
            </div>
          )}
        </Container>
      </Paper>
    );
  }
}

export default Leaderboard;
