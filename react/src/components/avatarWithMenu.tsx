import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Avatar,
  Link,
  ListItemIcon,
  Menu,
  MenuItem,
  MenuProps,
  withStyles,
  ListItemText,
} from "@material-ui/core";
import {
  MeetingRoom,
  PeopleOutline,
  ThumbsUpDown,
  ExitToApp,
} from "@material-ui/icons";

// kudos to https://material-ui.com/components/menus/
const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

// kudos to https://material-ui.com/components/menus/
const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

type AvatarWithMenuProps = {
  fullName: string;
};

// most readable solution from https://stackoverflow.com/questions/33076177/getting-name-initials-using-js
function nameToUpperInitials(fullName: string) {
  const namesArray = fullName.split(" ");
  if (namesArray.length === 1)
    return `${namesArray[0].charAt(0).toUpperCase()}`;
  else
    return `${namesArray[0].charAt(0).toUpperCase()}${namesArray[
      namesArray.length - 1
    ]
      .charAt(0)
      .toUpperCase()}`;
}

function AvatarWithMenu(props: AvatarWithMenuProps) {
  const [userMenu, setUserMenu] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <div>
      <Avatar
        onClick={(event: React.MouseEvent<HTMLElement>) => {
          setUserMenu(true);
          setAnchorEl(event.currentTarget);
        }}
        id="avatar"
      >
        {nameToUpperInitials(props.fullName)}
      </Avatar>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={userMenu}
        onClose={() => {
          setUserMenu(false);
          setAnchorEl(null);
        }}
      >
        <Link
          color="inherit"
          component={RouterLink}
          to="/"
          style={{ textDecoration: "none" }}
        >
          <StyledMenuItem>
            <ListItemIcon>
              <MeetingRoom fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Click here to go back!" />
          </StyledMenuItem>
        </Link>
        <Link
          id="favoursLink"
          color="inherit"
          component={RouterLink}
          to={{ pathname: "/user", state: { tabIndex: 1 } }}
          style={{ textDecoration: "none" }}
        >
          <StyledMenuItem>
            <ListItemIcon>
              <ThumbsUpDown fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="My Favours" />
          </StyledMenuItem>
        </Link>
        <Link
          id="requestLink"
          color="inherit"
          component={RouterLink}
          to={{ pathname: "/user", state: { tabIndex: 2 } }}
          style={{ textDecoration: "none" }}
        >
          <StyledMenuItem>
            <ListItemIcon>
              <PeopleOutline fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="My Requests" />
          </StyledMenuItem>
        </Link>
        <MenuItem />
        <Link
          id="logOutLink"
          color="inherit"
          component={RouterLink}
          to="/login"
          style={{ textDecoration: "none" }}
        >
          <StyledMenuItem>
            <ListItemIcon>
              <ExitToApp fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Log Out" />
          </StyledMenuItem>
        </Link>
      </StyledMenu>
    </div>
  );
}

export { AvatarWithMenu, nameToUpperInitials };
