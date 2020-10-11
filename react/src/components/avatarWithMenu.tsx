import React from "react";
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
  PeopleOutline,
  ThumbsUpDown,
  ExitToApp,
  AssignmentInd,
  PersonAdd,
} from "@material-ui/icons";
import { UserContext } from "./user-context";

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
  loggedIn: boolean;
};

type AvatarWithMenuState = {
  userMenu: boolean;
  anchorEl: HTMLElement | null;
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

class AvatarWithMenu extends React.Component<
  AvatarWithMenuProps,
  AvatarWithMenuState
> {
  state: AvatarWithMenuState = {
    userMenu: false,
    anchorEl: null,
  };

  static contextType: React.Context<{
    user: {};
    updateUser: (newUser: object) => void;
  }> = UserContext;

  render() {
    return (
      <div>
        <Avatar
          onClick={(event: React.MouseEvent<HTMLElement>) => {
            this.setState({
              userMenu: true,
              anchorEl: event.currentTarget,
            });
          }}
          id="avatar"
        >
          {nameToUpperInitials(this.props.fullName)}
        </Avatar>
        {this.props.loggedIn && (
          <StyledMenu
            id="customized-menu"
            anchorEl={this.state.anchorEl}
            keepMounted
            open={this.state.userMenu}
            onClose={() => {
              this.setState({
                userMenu: false,
                anchorEl: null,
              });
            }}
          >
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
              to="/home"
              onClick={() => {
                this.context.updateUser({ name: "?" });
              }}
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
        )}
        {!this.props.loggedIn && (
          <StyledMenu
            id="customized-menu"
            anchorEl={this.state.anchorEl}
            keepMounted
            open={this.state.userMenu}
            onClose={() => {
              this.setState({
                userMenu: false,
                anchorEl: null,
              });
            }}
          >
            <Link
              id="favoursLink"
              color="inherit"
              component={RouterLink}
              to={{ pathname: "/login", state: { tabIndex: 1 } }}
              style={{ textDecoration: "none" }}
            >
              <StyledMenuItem>
                <ListItemIcon>
                  <AssignmentInd fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </StyledMenuItem>
            </Link>
            <Link
              id="requestLink"
              color="inherit"
              component={RouterLink}
              to={{ pathname: "/signup", state: { tabIndex: 2 } }}
              style={{ textDecoration: "none" }}
            >
              <StyledMenuItem>
                <ListItemIcon>
                  <PersonAdd fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Sign Up" />
              </StyledMenuItem>
            </Link>
            <MenuItem />
          </StyledMenu>
        )}
      </div>
    );
  }
}

export { AvatarWithMenu, nameToUpperInitials };
