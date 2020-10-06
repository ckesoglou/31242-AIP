import React from "react";
import { Link as RouterLink } from "react-router-dom";
import "../assets/css/home.css";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  Link,
  ListItemIcon,
  Menu,
  MenuItem,
  MenuProps,
  Paper,
  TextField,
  Typography,
  withStyles,
  ListItemText,
} from "@material-ui/core";
import { UserContext } from "../components/user-context";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import {
  Search,
  MeetingRoom,
  PeopleOutline,
  ThumbsUpDown,
} from "@material-ui/icons";

type HomeState = {
  initials: string;
  userMenu: boolean;
  anchorEl: HTMLElement | null;
};

// This may or may not be useful but keeping in case we need it
// interface IHomeProps extends RouteComponentProps {
//   location: {
//     key: string;
//     pathname: string;
//     search: string;
//     hash: string;
//     state: {
//       next: {
//         pathname: string;
//       };
//     };
//   };
// }

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

class Home extends React.Component {
  state: HomeState = {
    initials: "",
    userMenu: false,
    anchorEl: null,
  };

  static contextType: React.Context<{
    user: {};
    updateUser: (newUser: object) => void;
  }> = UserContext;

  // most readable solution from https://stackoverflow.com/questions/33076177/getting-name-initials-using-js
  nameToUpperInitials(fullName: string) {
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

  componentDidMount() {
    this.setState({
      initials: this.nameToUpperInitials(this.context.user.name),
    });
  }

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
                <Avatar
                  onClick={(event: React.MouseEvent<HTMLElement>) => {
                    this.setState({
                      userMenu: true,
                      anchorEl: event.currentTarget,
                    });
                  }}
                  id="avatar"
                >
                  {this.state.initials}
                </Avatar>
                <StyledMenu
                  id="customized-menu"
                  anchorEl={this.state.anchorEl}
                  keepMounted
                  open={this.state.userMenu}
                  onClose={() => {
                    this.setState({ userMenu: false, anchorEl: null });
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
                        <ExitToAppIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Log Out" />
                    </StyledMenuItem>
                  </Link>
                </StyledMenu>
              </div>
            </Grid>
            <Grid item xs={8}>
              <Paper elevation={3} className="content">
                <Typography component="h3" variant="h4">
                  {"Requests"}
                </Typography>
                <Box id="filterContainer" display="inline">
                  <Typography id="filter-text" component="h4" variant="h5">
                    {"Filter"}
                  </Typography>
                  <TextField
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    id="filter-button"
                    size="large"
                    variant="contained"
                    color="primary"
                  >
                    <label>Filter</label>
                  </Button>
                </Box>
                <Box>
                  <h2>
                    Well well well.. look who it is - {this.context.user.name}!
                  </h2>
                </Box>
              </Paper>
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
