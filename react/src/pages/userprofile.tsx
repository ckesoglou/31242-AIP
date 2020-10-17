import React, { ChangeEvent } from "react";
import { RouteComponentProps, Link as RouterLink } from "react-router-dom";
import "../assets/css/userprofile.css";
import {
  userProfileEndpoint,
  requestsNewEndpoint,
  iouOweEndpoint,
  iouOwedEndpoint,
  itemEndpoint,
  usersEndpoint,
} from "../api/endpoints";
import {
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Box,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Grow,
  TextField,
  CircularProgress,
  Snackbar,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import RefreshIcon from "@material-ui/icons/Refresh";
import { AvatarWithMenu } from "../components/avatarWithMenu";
import { UserContext } from "../components/user-context";
import IOU from "../components/iou";
// import { optional } from "joi";

type ItemObj = {
  id: string;
  display_name: string;
};

type UserObj = {
  username: string;
  display_name: string;
};

type UserProfileState = {
  tabIndex: number;
  newRequestDialog: boolean;
  owed: string;
  owe: string;
  requests: string;
  newRequestFavour: string;
  newRequestReward: string;
  newRequestProof: any;
  requestSnack: boolean;
  snackMessage: string;
  potentialItems: ItemObj[];
  selectedUser: string;
  selectetableUsers: UserObj[];
  userDropOpen: boolean;
  userDropLoading: boolean;
};

interface IUserProfileProps extends RouteComponentProps {
  location: {
    key: string;
    pathname: string;
    search: string;
    hash: string;
    state: {
      next: {
        pathname: string;
      };
      tabIndex: number;
    };
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
  loadingRef: any;
  textRef: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, loadingRef, textRef, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={4}>
          <CircularProgress
            ref={props.loadingRef}
            size={35}
            color="inherit"
            id="loading"
          />
          <Typography ref={props.textRef}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

class UserProfile extends React.Component<IUserProfileProps, UserProfileState> {
  private textRef: React.RefObject<HTMLLabelElement>;
  private loadingRef: React.RefObject<HTMLInputElement>;

  constructor(props: IUserProfileProps) {
    super(props);

    this.textRef = React.createRef();
    this.loadingRef = React.createRef();
  }

  state: UserProfileState = {
    tabIndex: this.props.location.state.tabIndex ?? 0,
    newRequestDialog: false,
    owed: "",
    owe: "",
    requests: "",
    newRequestFavour: "",
    newRequestReward: "",
    newRequestProof: "",
    requestSnack: false,
    snackMessage: "",
    potentialItems: [],
    selectedUser: "",
    selectetableUsers: [],
    userDropOpen: false,
    userDropLoading: false,
  };

  static contextType: React.Context<{
    user: {};
    updateUser: (newUser: object) => void;
  }> = UserContext;

  setLoading(value: boolean): void {
    this.loadingRef.current!.style.display = value ? "block" : "none";
    this.textRef.current!.style.display = value ? "none" : "block";
  }

  componentDidMount() {
    this.fetchAllTabs();
    this.setState({
      userDropLoading:
        this.state.userDropOpen && this.state.selectetableUsers.length == 0,
    });
  }

  fetchItems(): void {
    fetch(`${itemEndpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((body) => {
        console.log("Success:", body);
      })
      .catch((exception) => {
        console.error("Error:", exception);
      });
  }

  fetchNewRequest(): void {
    fetch(`${requestsNewEndpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        favour: this.state.newRequestFavour,
        reward: this.state.newRequestReward,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((body) => {
        console.log("Success:", body);
        this.setState({ snackMessage: "New request created!" });
      })
      .catch((exception) => {
        console.error("Error:", exception);
        this.setState({ snackMessage: `${exception}` });
      });
    this.setState({ requestSnack: true });
  }

  fetchNewOwe(): void {
    fetch(`${iouOweEndpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: this.context.user.name,
        // item: ,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((body) => {
        console.log("Success:", body);
        this.setState({ snackMessage: "New IOU created!" });
        this.setState({ requestSnack: true });
      })
      .catch((exception) => {
        console.error("Error:", exception);
        this.setState({ snackMessage: exception });
        this.setState({ requestSnack: true });
      });
  }

  fetchNewOwed(): void {
    fetch(`${iouOwedEndpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: this.context.user.name,
        // item: ,
        // proof: ,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((body) => {
        console.log("Success:", body);
        this.setState({ snackMessage: "New IOU created!" });
        this.setState({ requestSnack: true });
      })
      .catch((exception) => {
        console.error("Error:", exception);
        this.setState({ snackMessage: exception });
        this.setState({ requestSnack: true });
      });
  }

  fetchAllTabs(): void {
    const headers = {
      "Content-Type": "application/json",
    };
    this.setLoading(true);
    Promise.all([
      fetch(`${userProfileEndpoint.concat(this.context.user.name)}/owe`, {
        method: "GET",
        headers: headers,
      }),
      fetch(`${userProfileEndpoint.concat(this.context.user.name)}/owed`, {
        method: "GET",
        headers: headers,
      }),
      fetch(`${userProfileEndpoint.concat(this.context.user.name)}/requests`, {
        method: "GET",
        headers: headers,
      }),
    ])
      .then(([owed, owe, requests]) => {
        Promise.all([owed.json(), owe.json(), requests.json()]).then(
          ([owedResult, oweResult, requestsResult]) => {
            this.setLoading(false);
            let owedRaw = JSON.stringify(owedResult);
            let oweRaw = JSON.stringify(oweResult);
            let requestsRaw = JSON.stringify(requestsResult);
            this.setState({
              owed: owedRaw,
              owe: oweRaw,
              requests: requestsRaw,
            });
            console.log("Success:", owedResult, oweResult, requestsResult);
          }
        );
      })
      .catch((exception) => {
        console.error("Error:", exception);
        this.setState({ snackMessage: `${exception}` });
        this.setState({ requestSnack: true });
      });
  }

  fetchSearchedUsers(searchUser: string) {
    this.setState({ userDropLoading: true });

    fetch(`${usersEndpoint.concat("?search=").concat(searchUser)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((body) => {
        console.log("Success:", body);
        this.setState({ selectetableUsers: body });
        this.setState({ userDropLoading: false });
      })
      .catch((exception) => {
        console.error("Error:", exception);
        this.setState({ snackMessage: `${exception}` });
        this.setState({ requestSnack: true });
        this.setState({ userDropLoading: false });
      });
  }

  handleTabsChange(event: ChangeEvent<{}> | undefined, index: number): void {
    this.setState({ tabIndex: index });
    // This method may be needed in the future
  }

  render() {
    return (
      <Container component="main" maxWidth="lg">
        <div className="paper">
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <div id="header">
                <RouterLink to="/home">
                  <img
                    width="120"
                    height="80"
                    alt="IOU Logo"
                    src={process.env.PUBLIC_URL + "/iou-logo.png"}
                  />
                </RouterLink>
                <Typography component="h1" variant="h4">
                  {"Profile"}
                </Typography>
                <AvatarWithMenu
                  loggedIn={this.context.user.name !== "?"}
                  fullName={this.context.user.name}
                />
              </div>
            </Grid>
            {/* <Grid item xs={4}>
              <Paper elevation={3}>
                <div className="section">
                  <h2> </h2>
                  <Typography component="h3" variant="h4">
                    {"Placeholder Image"}
                  </Typography>
                  <Typography>
                    {
                      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
                    }
                  </Typography>
                </div>
              </Paper>
            </Grid> */}
            <Grid item xs={12}>
              <Paper elevation={3} className="content">
                <Tabs
                  value={this.state.tabIndex}
                  onChange={(e, i) => this.handleTabsChange(e, i)}
                  variant="fullWidth"
                >
                  <Tab label="Owed" />
                  <Tab label="Owe" />
                  <Tab label="Requests" />
                  {/* The following two icons are throwing some console errors
                  because they inherit the MUI tab props - see 
                  stackoverflow.com/questions/58103542/material-ui-button-in-a-tab-list */}
                  <AddBoxOutlinedIcon
                    id="requestForm"
                    className={"tabButton"}
                    color="primary"
                    fontSize="large"
                    onClick={() => this.setState({ newRequestDialog: true })}
                  />
                  <RefreshIcon
                    id="refresh"
                    className={"tabButton"}
                    color="primary"
                    fontSize="large"
                    onClick={() => this.fetchAllTabs()}
                  />
                </Tabs>
                <Dialog
                  maxWidth="sm"
                  scroll="paper"
                  open={this.state.newRequestDialog}
                  TransitionComponent={Grow}
                  onClose={() => this.setState({ newRequestDialog: false })}
                >
                  <DialogTitle disableTypography={true} id="requestFormTitle">
                    <Typography component="h5" variant="h5">
                      {this.state.tabIndex == 2
                        ? "Creating a new request..."
                        : this.state.tabIndex == 1
                        ? "Creating a new owing IOU..."
                        : "Creating a new owed IOU..."}
                    </Typography>
                  </DialogTitle>
                  <DialogContent dividers className="content">
                    {this.state.tabIndex == 2 ? null : this.state.tabIndex ==
                      1 ? (
                      <Container>
                        <DialogContentText id="requestFormQuestion">
                          {"Who do you owe?"}
                        </DialogContentText>
                        <Autocomplete
                          id="testAutoComplete"
                          style={{ width: 300 }}
                          open={this.state.userDropOpen}
                          onOpen={() => {
                            this.setState({ userDropOpen: true });
                          }}
                          onClose={() => {
                            this.setState({ userDropOpen: false });
                          }}
                          loading={this.state.userDropLoading}
                          getOptionLabel={(option) => option.username}
                          getOptionSelected={(option, value) =>
                            option.username === value.username
                          }
                          onChange={(event, value) => {
                            this.setState({
                              selectedUser:
                                value?.username == null ? "" : value.username,
                            });
                          }}
                          onInputChange={(event, value) => {
                            this.fetchSearchedUsers(value);
                          }}
                          options={this.state.selectetableUsers}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Enter a username here!"
                              variant="outlined"
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <React.Fragment>
                                    {this.state.userDropLoading ? (
                                      <CircularProgress
                                        color="inherit"
                                        size={20}
                                      />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                  </React.Fragment>
                                ),
                              }}
                            />
                          )}
                        />
                      </Container>
                    ) : (
                      <DialogContentText id="requestFormQuestion">
                        {"Who owes you?"}
                      </DialogContentText>
                    )}

                    <DialogContentText id="requestFormQuestion">
                      {this.state.tabIndex == 2
                        ? "Lets start with what you'd like..."
                        : this.state.tabIndex == 1
                        ? "Lets start with what you owe..."
                        : "Lets start with you're owed..."}
                    </DialogContentText>
                    <TextField
                      autoFocus
                      id="favourText"
                      label="Favour"
                      type="text"
                      variant="outlined"
                      margin="normal"
                      required
                      onChange={(e) => {
                        this.setState({ newRequestFavour: e.target.value });
                      }}
                    />
                    <DialogContentText id="requestFormQuestion">
                      {"Next, what would you like to offer in return?"}
                    </DialogContentText>
                    <TextField
                      id="rewardText"
                      label="Reward"
                      type="text"
                      variant="outlined"
                      margin="normal"
                      required
                      onChange={(e) => {
                        this.setState({ newRequestReward: e.target.value });
                      }}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button
                      id="createRequest"
                      size="large"
                      color="primary"
                      onClick={() => {
                        this.fetchNewRequest();
                        this.setState({
                          newRequestDialog: false,
                        });
                      }}
                      autoFocus
                      disabled={
                        !this.state.newRequestFavour ||
                        !this.state.newRequestReward
                      }
                    >
                      Create
                    </Button>
                    <Button
                      size="large"
                      color="primary"
                      onClick={() => this.setState({ newRequestDialog: false })}
                    >
                      Nevermind
                    </Button>
                  </DialogActions>
                </Dialog>
                <Snackbar
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  message={this.state.snackMessage}
                  open={this.state.requestSnack}
                  onClose={() => {
                    this.setState({ requestSnack: false });
                  }}
                  autoHideDuration={5000}
                />
                <TabPanel
                  value={this.state.tabIndex}
                  loadingRef={this.loadingRef}
                  textRef={this.textRef}
                  index={0}
                >
                  {this.state.owed}
                  <IOU
                    request={{
                      id: "1",
                      author: { username: "James", display_name: "James" },
                      completed_by: {
                        username: "Kevin",
                        display_name: "Kevin",
                      },
                      proof_of_completion: "",
                      rewards: [
                        { id: "1", display_name: "Hug" },
                        { id: "2", display_name: "Coffee" },
                      ],
                      details: "Clean the fridge",
                      created_time: "02/02/2020",
                      comletion_time: "02/02/2020",
                      is_completed: true,
                    }}
                  />
                </TabPanel>
                <TabPanel
                  value={this.state.tabIndex}
                  loadingRef={this.loadingRef}
                  textRef={this.textRef}
                  index={1}
                >
                  {this.state.owe}
                </TabPanel>
                <TabPanel
                  value={this.state.tabIndex}
                  loadingRef={this.loadingRef}
                  textRef={this.textRef}
                  index={2}
                >
                  {this.state.requests}
                </TabPanel>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Container>
    );
  }
}

export default UserProfile;
