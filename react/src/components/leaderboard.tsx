import React from "react";
import {
  leaderboardAllEndpoint,
  leaderboardMeEndpoint,
} from "../api/endpoints";
import { Container } from "@material-ui/core";
import { UserContext } from "../components/user-context";

type LeaderboardUser = {
  rank: number;
  user: { username: string; display_name: string };
  score: number;
};

type LeaderboardState = {
  users: LeaderboardUser[];
  me: LeaderboardUser | undefined;
  error: string;
};

class Leaderboard extends React.Component {
  state: LeaderboardState = {
    users: [],
    error: "",
    me: undefined,
  };

  componentDidMount() {
    this.fetchAllLeaderboard();
  }

  static contextType: React.Context<{
    user: {};
    updateUser: (newUser: object) => void;
  }> = UserContext;

  fetchAllLeaderboard() {
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
        this.setState({ users: body });
        this.setState({ error: "" });
      })
      .catch((exception) => {
        console.error("Error:", exception);
        this.setState({ error: exception });
      });
  }

  render() {
    return (
      <Container component="main" maxWidth="xs">
        <div className="paper">
          {this.state.users.map((user, i) => {
            return (
              <p key={i}>
                Display: {user.user.display_name} User: {user.user.username}
                Rank: {user.rank}
              </p>
            );
          })}
        </div>
      </Container>
    );
  }
}

export default Leaderboard;
