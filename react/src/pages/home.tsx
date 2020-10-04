import React from "react";
import { RouteComponentProps, Link as RouterLink } from "react-router-dom";
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
} from "@material-ui/core";
import { UserContext } from "../components/user-context";
import SearchIcon from "@material-ui/icons/Search";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import SendIcon from "@material-ui/icons/Send";

type HomeState = {
  initials: string;
  userMenu: boolean;
  anchorEl: HTMLElement | null;
};

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

class Home extends React.Component<IHomeProps, HomeState> {
  constructor(props: IHomeProps) {
    super(props);
  }

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
  nameToInitials(fullName: string) {
    const namesArray = fullName.split(" ");
    if (namesArray.length === 1) return `${namesArray[0].charAt(0)}`;
    else
      return `${namesArray[0].charAt(0)}${namesArray[
        namesArray.length - 1
      ].charAt(0)}`;
  }

  componentDidMount() {
    this.setState({ initials: this.nameToInitials(this.context.user.name) });
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
                  onClick={() => {
                    this.setState({ userMenu: true });
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
                    this.setState({ userMenu: false });
                  }}
                >
                  <StyledMenuItem>
                    <ListItemIcon>
                      <SendIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Sent mail" />
                  </StyledMenuItem>
                  <StyledMenuItem>
                    <ListItemIcon>
                      <DraftsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Drafts" />
                  </StyledMenuItem>
                  <StyledMenuItem>
                    <ListItemIcon>
                      <InboxIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Inbox" />
                  </StyledMenuItem>
                </StyledMenu>
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
                <Box id="filterContainer" display="inline">
                  <Typography id="filter-text" component="h4" variant="h5">
                    {"Filter"}
                  </Typography>
                  <TextField
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
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
