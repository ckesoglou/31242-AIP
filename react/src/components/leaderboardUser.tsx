import React, { useState } from "react";
import "../assets/css/leaderboardUser.css";
import { Avatar, Grid, Typography } from "@material-ui/core";
import { nameToUpperInitials } from "./avatarWithMenu";

type LeaderboardUserProps = {
  rank: number;
  username: string;
  score: number;
};

function LeaderboardUser(props: LeaderboardUserProps) {
  const [userMenu, setUserMenu] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <Grid container direction="row">
      <Grid id="leaderboardItem" item xs={3}>
        <Typography>{props.rank}</Typography>
      </Grid>
      <Grid id="leaderboardItem" item xs={3}>
        <Typography>{props.username}</Typography>
      </Grid>
      <Grid id="leaderboardItem" item xs={3}>
        <Typography>{props.score}</Typography>
      </Grid>
      <Grid id="leaderboardItem" item xs={3}>
        <Avatar
          style={{
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
          }}
          onClick={(event: React.MouseEvent<HTMLElement>) => {
            setUserMenu(true);
            setAnchorEl(event.currentTarget);
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
