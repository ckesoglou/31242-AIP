import React from "react";
import "../assets/css/leaderboardUser.css";
import { Avatar, Grid, Typography } from "@material-ui/core";
import { nameToUpperInitials } from "./avatarWithMenu";

type LeaderboardUserProps = {
  rank: number;
  username: string;
  score: number;
};

function LeaderboardUser(props: LeaderboardUserProps) {
  return (
    <Grid container direction="row">
      <Grid id="leaderboardItem" item xs={2}>
        <Typography>{props.rank}</Typography>
      </Grid>
      <Grid id="leaderboardItem" item xs={5}>
        <Typography>{props.username}</Typography>
      </Grid>
      <Grid id="leaderboardItem" item xs={2}>
        <Typography>{props.score}</Typography>
      </Grid>
      <Grid id="leaderboardItem" item xs={3}>
        <Avatar
          style={{
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
          }}
          id="leaderboardUserAvatar"
        >
          {nameToUpperInitials(props.username)}
        </Avatar>
      </Grid>
    </Grid>
  );
}

export default LeaderboardUser;
