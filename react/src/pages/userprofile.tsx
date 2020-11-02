import React, { ChangeEvent } from "react";
import {
  RouteComponentProps,
  Link as RouterLink,
  Redirect,
} from "react-router-dom";
import "../assets/css/userprofile.css";
import {
  requestsEndpoint,
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
  Divider,
} from "@material-ui/core";
import { Autocomplete, Pagination } from "@material-ui/lab";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import RefreshIcon from "@material-ui/icons/Refresh";
import { AvatarWithMenu } from "../components/avatarWithMenu";
import { UserContext } from "../components/user-context";
import IOU from "../components/iou";
import IouRequest from "../components/request";

type ItemObj = {
  id: string;
  display_name: string;
};

type UserObj = {
  username: string;
  display_name: string;
};

type RewardItem = {
  id: string; // UUID;
  giver: { username: string; display_name: string };
  item: { id: string; display_name: string };
};

type IouObj = {
  id: string;
  item: ItemObj;
  giver: { username: string; display_name: string };
  receiver: { username: string; display_name: string };
  parent_request: string | null;
  proof_of_debt: string | null;
  proof_of_completion: string | null;
  created_time: string;
  claimed_time: string | null;
  is_claimed: boolean;
};

type RequestObj = {
  id: string;
  author: { username: string; display_name: string };
  completed_by: { username: string; display_name: string };
  proof_of_completion: string;
  rewards: RewardItem[];
  details: string;
  created_time: string;
  completion_time: string;
  is_completed: boolean;
};

type UserProfileState = {
  tabIndex: number;
  newRequestDialog: boolean;
  owed: IouObj[];
  owe: IouObj[];
  requests: RequestObj[];
  newRequestFavour: string;
  newRequestReward: string;
  newRequestProof: any;
  snack: boolean;
  snackMessage: string;
  potentialItems: ItemObj[];
  selectedUser: string;
  selectetableUsers: UserObj[];
  userDropOpen: boolean;
  userDropLoading: boolean;
  rewardDropOpen: boolean;
  owedPages: number;
  owePages: number;
  requestPages: number;
  unauthRep: boolean;
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

// kudos to https://material-ui.com/components/tabs/ - this has been modified for our purposes
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

const numberOfItemsPerPage = 5;

class UserProfile extends React.Component<IUserProfileProps, UserProfileState> {
  private textRef: React.RefObject<HTMLLabelElement>;
  private loadingRef: React.RefObject<HTMLInputElement>;

  constructor(props: IUserProfileProps) {
    super(props);

    this.textRef = React.createRef();
    this.loadingRef = React.createRef();
  }

  state: UserProfileState = {
    tabIndex: this.props.location.state?.tabIndex ?? 0,
    newRequestDialog: false,
    owed: [],
    owe: [],
    requests: [],
    newRequestFavour: "",
    newRequestReward: "",
    newRequestProof: "",
    snack: false,
    snackMessage: "",
    potentialItems: [],
    selectedUser: "",
    selectetableUsers: [],
    userDropOpen: false,
    userDropLoading: false,
    rewardDropOpen: false,
    owedPages: 1,
    owePages: 1,
    requestPages: 1,
    unauthRep: false,
  };

  static contextType = UserContext;

  // Toggle loading circle for when async fetching
  setLoading(value: boolean): void {
    this.loadingRef.current!.style.display = value ? "block" : "none";
    this.textRef.current!.style.display = value ? "none" : "block";
  }

  // On load, check if user is logged in
  componentDidMount() {
    if (this.context.user.name !== "?") {
      this.fetchAllTabs();
      this.setState({
        userDropLoading:
          this.state.userDropOpen && this.state.selectetableUsers.length === 0,
      });
      this.fetchUsers();
      this.fetchItems();
    }
  }

  // Calculate the number of pages required to hold the owed on userprofile with numberOfItemsPerPage per page
  setCountOfOwed(): number {
    if (this.state.owed.length % numberOfItemsPerPage !== 0) {
      return Math.ceil(this.state.owed.length / numberOfItemsPerPage);
    } else {
      return this.state.owed.length / numberOfItemsPerPage;
    }
  }

  // Calculate the number of pages required to hold the owe on userprofile with numberOfItemsPerPage per page
  setCountOfOwe(): number {
    if (this.state.owe.length % numberOfItemsPerPage !== 0) {
      return Math.ceil(this.state.owe.length / numberOfItemsPerPage);
    } else {
      return this.state.owe.length / numberOfItemsPerPage;
    }
  }

  // Calculate the number of pages required to hold the requests on userprofile with numberOfItemsPerPage per page
  setCountOfRequest(): number {
    if (this.state.requests.length % numberOfItemsPerPage !== 0) {
      return Math.ceil(this.state.requests.length / numberOfItemsPerPage);
    } else {
      return this.state.requests.length / numberOfItemsPerPage;
    }
  }

  fetchItems(): void {
    fetch(`${itemEndpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          // Successful login 200
          res.json().then((body) => this.setState({ potentialItems: body }));
        }
      })
      .catch((exception) => {
        console.error("Error:", exception);
        this.setState({ snackMessage: `${exception}` });
        this.setState({ snack: true });
      });
  }

  // Send new request to be created
  fetchNewRequest(): void {
    fetch(`${requestsEndpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        details: this.state.newRequestFavour,
        item: this.state.newRequestReward,
      }),
    })
      .then((res) => {
        if (res.status === 201) {
          // Successful login 201
          this.setState({
            snackMessage: "New request created!",
            snack: true,
            newRequestDialog: false,
          });
          this.fetchAllTabs();
        } else if (res.status === 401) {
          this.setState({ unauthRep: true });
        } else {
          // Unsuccessful login (400 or 401)
          res.json().then((body) =>
            this.setState({
              snackMessage: body.errors,
              snack: true,
              newRequestDialog: false,
            })
          );
        }
      })
      .catch((exception) => {
        console.log("Error:", exception);
      });
  }

  // Send new owe to be created
  fetchNewOwe(): void {
    fetch(`${iouOweEndpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: this.state.selectedUser,
        item: this.state.newRequestReward,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          // Successful login 200
          res.json().then((body) => {
            this.setState({
              snackMessage:
                "New IOU created! " +
                (body.usersInParty && body.usersInParty.length > 2
                  ? body.usersInParty.join(", ") +
                    " have a circular IOU party. We suggest you guys treat each other! ;)"
                  : ""),
              snack: true,
              newRequestDialog: false,
            });
            this.fetchAllTabs();
          });
        } else if (res.status === 401) {
          this.setState({ unauthRep: true });
        } else {
          // Unsuccessful login (400 or 401)
          res.json().then((body) =>
            this.setState({
              snackMessage: body.errors,
              snack: true,
              newRequestDialog: false,
            })
          );
        }
      })
      .catch((exception) => {
        console.log("Error:", exception);
      });
  }

  // Send new owed to be created
  fetchNewOwed(): void {
    const formData = new FormData();
    formData.append("username", this.state.selectedUser);
    formData.append("item", this.state.newRequestReward);
    formData.append("proof", this.state.newRequestProof);

    fetch(`${iouOwedEndpoint}`, {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (res.status === 200) {
          // Successful login 201
          res.json().then((body) =>
            this.setState({
              snackMessage:
                "New IOU created! " +
                (body.usersInParty && body.usersInParty.length > 2
                  ? body.usersInParty.join(", ") +
                    " have a circular IOU party. We suggest you guys treat each other! :)"
                  : ""),
              snack: true,
              newRequestDialog: false,
            })
          );
          this.fetchAllTabs();
        } else if (res.status === 401) {
          this.setState({ unauthRep: true });
        } else {
          // Unsuccessful login (400 or 401)
          res.json().then((body) =>
            this.setState({
              snackMessage: body.errors,
              snack: true,
              newRequestDialog: false,
              newRequestProof: "",
            })
          );
        }
      })
      .catch((exception) => {
        console.log("Error:", exception);
      });
  }

  // Fetch all information for tabs needed
  // Made into an arrow function to pass down to child componenents for auto-refreshing functionality
  fetchAllTabs = () => {
    const headers = {
      "Content-Type": "application/json",
    };
    this.setLoading(true);
    let url = new URL(requestsEndpoint, document.baseURI);
    // Add a query param to request endpoint for only logged in user's requests
    let params: any = { author: this.context.user.name };
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );
    Promise.all([
      fetch(`${iouOwedEndpoint}`, {
        method: "GET",
        headers: headers,
      }),
      fetch(`${iouOweEndpoint}`, {
        method: "GET",
        headers: headers,
      }),
      fetch(url.href, {
        method: "GET",
        headers: headers,
      }),
    ])
      .then(([owed, owe, request]) => {
        Promise.all([owed.json(), owe.json(), request.json()]).then(
          ([owedResult, oweResult, requestResult]) => {
            this.setLoading(false);
            this.setState({
              owed: owedResult,
              owe: oweResult,
              requests: requestResult,
            });
            // Caches API response to local storage for offline viewing
            window.localStorage.setItem(
              "lastOwedResult",
              JSON.stringify(owedResult)
            );
            window.localStorage.setItem(
              "lastOweResult",
              JSON.stringify(oweResult)
            );
            window.localStorage.setItem(
              "lastRequestResult",
              JSON.stringify(requestResult)
            );
            console.log("Success:", owedResult, oweResult, requestResult);
          }
        );
      })
      .catch(() => {
        console.error("Error");
        this.setLoading(false);
        const owedResult = JSON.parse(
          window.localStorage.getItem("lastOwedResult") ?? "[]"
        );
        const oweResult = JSON.parse(
          window.localStorage.getItem("lastOweResult") ?? "[]"
        );
        const requestResult = JSON.parse(
          window.localStorage.getItem("lastRequestResult") ?? "[]"
        );
        this.setState({
          owed: owedResult,
          owe: oweResult,
          requests: requestResult,
        });
      });
  };

  fetchUsers() {
    this.setState({ userDropLoading: true });
    fetch(`${usersEndpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          // Successful login 201
          res.json().then((body) => {
            let index;
            body.forEach((user: UserObj) => {
              if (user.username === this.context.user.name) {
                index = body.indexOf(user);
                body.splice(index, index + 1);
              }
            });
            this.setState({ selectetableUsers: body, userDropLoading: false });
          });
        } else {
          // Unsuccessful login (400)
          res.json().then((body) =>
            this.setState({
              snackMessage: body.errors,
              snack: true,
              userDropLoading: false,
            })
          );
        }
      })
      .catch((exception) => {
        console.log("Error:", exception);
      });
  }

  fetchSearchedUsers(searchUser: string) {
    this.setState({ userDropLoading: true });
    let url = new URL(usersEndpoint, document.baseURI);
    if (searchUser !== "") {
      url.searchParams.append("search", searchUser);
    }
    fetch(url.href, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          // Successful login 201
          res.json().then((body) => {
            console.log(body);
            let index;
            body.forEach((user: UserObj) => {
              if (user.username === this.context.user.name) {
                index = body.indexOf(user);
                body.splice(index, index + 1);
              }
            });
            this.setState({ selectetableUsers: body, userDropLoading: false });
          });
        } else {
          // Unsuccessful login (400)
          res.json().then((body) =>
            this.setState({
              snackMessage: body.errors,
              snack: true,
              userDropLoading: false,
            })
          );
        }
      })
      .catch((exception) => {
        console.log("Error:", exception);
      });
  }

  fileContent() {
    if (this.state.newRequestProof) {
      console.log(this.state.newRequestProof);
      return (
        <div id="completeProofFileInfo">
          <DialogContentText variant="body2">
            {"Image Preview: "}
          </DialogContentText>
          <img
            src={URL.createObjectURL(this.state.newRequestProof)}
            alt={this.state.newRequestProof.name}
            id="completeProofImage"
          />
        </div>
        // TODO: Need to discuss how submitted images should be formatted (Size, Encode Format)
      );
    } else {
      return (
        <DialogContentText variant="body2" id="completeProofFileInfo">
          {"Upload an image (JPEG/PNG) before pressing the 'Create' button"}
        </DialogContentText>
      );
    }
  }

  checkCreateButton(): boolean {
    if (this.state.tabIndex === 2) {
      return !this.state.newRequestFavour || !this.state.newRequestReward;
    } else if (this.state.tabIndex === 1) {
      return !this.state.selectedUser || !this.state.newRequestReward;
    } else {
      return (
        !this.state.selectedUser ||
        !this.state.newRequestReward ||
        !this.state.newRequestProof
      );
    }
  }

  render() {
    if (this.state.unauthRep || this.context.user.name === "?") {
      return (
        <Redirect
          to={{
            pathname: "/login",
            state: {
              // This is just a pop up message on login page to signify session expired
              unauthenticated:
                "Your session has expired! Please sign in again :)",
            },
          }}
        />
      );
    }

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
                <AvatarWithMenu />
              </div>
            </Grid>
            <Grid item xs={12}>
              <Paper elevation={3} className="content">
                <Tabs
                  value={this.state.tabIndex}
                  onChange={(e, i) => this.setState({ tabIndex: i })}
                  variant="fullWidth"
                >
                  <Tab label="Owed" />
                  <Tab label="Owe" />
                  <Tab label="My Requests" id="requestTab" />
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
                      {this.state.tabIndex === 2
                        ? "Creating a new request..."
                        : this.state.tabIndex === 1
                        ? "Creating a new owing IOU..."
                        : "Creating a new owed IOU..."}
                    </Typography>
                  </DialogTitle>
                  <DialogContent dividers className="content">
                    {this.state.tabIndex === 2 ? null : this.state.tabIndex ===
                      1 ? (
                      <Container>
                        <DialogContentText id="requestFormQuestion">
                          {"Who do you owe?"}
                        </DialogContentText>
                        <Container id="autoCompleteField">
                          <Autocomplete
                            open={this.state.userDropOpen}
                            onOpen={() => {
                              this.setState({ userDropOpen: true });
                            }}
                            onClose={() => {
                              this.setState({
                                userDropOpen: false,
                                userDropLoading: false,
                              });
                            }}
                            loading={this.state.userDropLoading}
                            getOptionLabel={(option) =>
                              option.display_name
                                .concat("   #")
                                .concat(option.username)
                            }
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
                      </Container>
                    ) : (
                      <Container>
                        <DialogContentText id="requestFormQuestion">
                          {"Who owes you?"}
                        </DialogContentText>
                        <Container id="autoCompleteField">
                          <Autocomplete
                            open={this.state.userDropOpen}
                            onOpen={() => {
                              this.setState({ userDropOpen: true });
                            }}
                            onClose={() => {
                              this.setState({
                                userDropOpen: false,
                                userDropLoading: false,
                              });
                            }}
                            loading={this.state.userDropLoading}
                            getOptionLabel={(option) =>
                              option.display_name
                                .concat("   #")
                                .concat(option.username)
                            }
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
                      </Container>
                    )}
                    {this.state.tabIndex === 2 && (
                      <Container>
                        <DialogContentText id="requestFormQuestion">
                          {"Lets start with what you'd like..."}
                        </DialogContentText>
                        <TextField
                          autoFocus
                          id="favourText"
                          label="Details"
                          type="text"
                          variant="outlined"
                          margin="normal"
                          required
                          onChange={(e) => {
                            this.setState({ newRequestFavour: e.target.value });
                          }}
                        />
                      </Container>
                    )}
                    <DialogContentText id="requestFormQuestion">
                      {this.state.tabIndex === 2
                        ? "Next, what would you like to offer in return?"
                        : this.state.tabIndex === 1
                        ? "Next, what do you owe?"
                        : "Next, what do they owe you?"}
                    </DialogContentText>
                    <Container id="autoCompleteField">
                      <Autocomplete
                        id="rewardAutoCompleteField"
                        open={this.state.rewardDropOpen}
                        onOpen={() => {
                          this.setState({ rewardDropOpen: true });
                        }}
                        onClose={() => {
                          this.setState({ rewardDropOpen: false });
                        }}
                        getOptionLabel={(option) => option.display_name}
                        getOptionSelected={(option, value) =>
                          option.id === value.id
                        }
                        onChange={(event, value) => {
                          this.setState({
                            newRequestReward: value?.id == null ? "" : value.id,
                          });
                        }}
                        options={this.state.potentialItems}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Find a reward here!"
                            variant="outlined"
                          />
                        )}
                      />
                    </Container>
                    {this.state.tabIndex === 0 && (
                      <Container>
                        <DialogContentText>{"Upload proof?"}</DialogContentText>
                        <input
                          type="file"
                          onChange={(e) => {
                            if (e.target.files) {
                              this.setState({
                                newRequestProof: e.target.files[0],
                              });
                            }
                          }}
                          accept="image/*"
                          id="inputProof"
                        />
                        <label htmlFor="inputProof">
                          <Button
                            variant="contained"
                            color="primary"
                            component="span"
                          >
                            {this.state.newRequestProof ? "CHANGE" : "UPLOAD"}
                          </Button>
                        </label>
                        {this.fileContent()}
                      </Container>
                    )}
                  </DialogContent>
                  <DialogActions>
                    <Button
                      size="large"
                      color="primary"
                      onClick={() => this.setState({ newRequestDialog: false })}
                    >
                      Nevermind
                    </Button>
                    <Button
                      id="createRequest"
                      size="large"
                      color="primary"
                      onClick={() => {
                        if (this.state.tabIndex === 2) {
                          this.fetchNewRequest();
                        } else if (this.state.tabIndex === 1) {
                          this.fetchNewOwe();
                        } else {
                          this.fetchNewOwed();
                        }
                        this.setState({
                          newRequestDialog: false,
                        });
                      }}
                      autoFocus
                      disabled={this.checkCreateButton()}
                    >
                      Create
                    </Button>
                  </DialogActions>
                </Dialog>
                <TabPanel
                  value={this.state.tabIndex}
                  loadingRef={this.loadingRef}
                  textRef={this.textRef}
                  index={0}
                >
                  <Grid item xs={12}>
                    <Grid container direction="row">
                      <Grid id="headerItem" item xs={6}>
                        <Typography variant="h6">Favour</Typography>
                      </Grid>
                      <Grid id="headerItem" item xs={3}>
                        <Typography variant="h6">Proof</Typography>
                      </Grid>
                      <Grid id="headerItem" item xs={3}>
                        <Typography variant="h6">Completed</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  {this.state.owed
                    .slice(
                      (this.state.owedPages - 1) * numberOfItemsPerPage,
                      this.state.owedPages * numberOfItemsPerPage
                    )
                    .map((owed, i) => {
                      return (
                        <IOU
                          iou={owed}
                          key={i}
                          iouType={0}
                          refreshTable={this.fetchAllTabs}
                        />
                      );
                    })}
                  <Box pt={3}>
                    <Divider variant="middle" />
                    <Pagination
                      id="userPagination"
                      count={this.setCountOfOwed()}
                      page={this.state.owedPages}
                      onChange={(
                        event: React.ChangeEvent<unknown>,
                        value: number
                      ) => {
                        this.setState({ owedPages: value });
                      }}
                      defaultPage={1}
                      siblingCount={2}
                      color="primary"
                    />
                  </Box>
                </TabPanel>
                <TabPanel
                  value={this.state.tabIndex}
                  loadingRef={this.loadingRef}
                  textRef={this.textRef}
                  index={1}
                >
                  <Grid item xs={12}>
                    <Grid container direction="row">
                      <Grid id="headerItem" item xs={6}>
                        <Typography variant="h6">Favour</Typography>
                      </Grid>
                      <Grid id="headerItem" item xs={3}>
                        <Typography variant="h6">Proof</Typography>
                      </Grid>
                      <Grid id="headerItem" item xs={3}>
                        <Typography variant="h6">Completed</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  {this.state.owe
                    .slice(
                      (this.state.owePages - 1) * numberOfItemsPerPage,
                      this.state.owePages * numberOfItemsPerPage
                    )
                    .map((owe, i) => {
                      return (
                        <IOU
                          iou={owe}
                          key={i}
                          iouType={1}
                          refreshTable={this.fetchAllTabs}
                        />
                      );
                    })}
                  <Box pt={3}>
                    <Divider variant="middle" />
                    <Pagination
                      id="userPagination"
                      count={this.setCountOfOwe()}
                      page={this.state.owePages}
                      onChange={(
                        event: React.ChangeEvent<unknown>,
                        value: number
                      ) => {
                        this.setState({ owePages: value });
                      }}
                      defaultPage={1}
                      siblingCount={2}
                      color="primary"
                    />
                  </Box>
                </TabPanel>
                <TabPanel
                  value={this.state.tabIndex}
                  loadingRef={this.loadingRef}
                  textRef={this.textRef}
                  index={2}
                >
                  <Grid item xs={12}>
                    <Grid container direction="row">
                      <Grid id="headerItem" item xs={4}>
                        <Typography variant="h6">Favour</Typography>
                      </Grid>
                      <Grid id="headerItem" item xs={2}>
                        <Typography variant="h6">Task</Typography>
                      </Grid>
                      <Grid id="headerItem" item xs={2}>
                        <Typography variant="h6">Proof</Typography>
                      </Grid>
                      <Grid id="headerItem" item xs={3}>
                        <Typography variant="h6">Completed</Typography>
                      </Grid>
                      <Grid id="headerItem" item xs={1}>
                        <Typography variant="h6">Info</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  {this.state.requests
                    .slice(
                      (this.state.requestPages - 1) * numberOfItemsPerPage,
                      this.state.requestPages * numberOfItemsPerPage
                    )
                    .map((request, i) => {
                      return (
                        <IouRequest
                          request={request}
                          potentialRewards={this.state.potentialItems}
                          iouType={2}
                          key={i}
                          refreshTable={this.fetchAllTabs}
                        />
                      );
                    })}
                  <Divider variant="middle" />
                  <Pagination
                    id="userPagination"
                    count={this.setCountOfOwe()}
                    page={this.state.owePages}
                    onChange={(
                      event: React.ChangeEvent<unknown>,
                      value: number
                    ) => {
                      this.setState({ owePages: value });
                    }}
                    defaultPage={1}
                    siblingCount={2}
                    color="primary"
                  />
                </TabPanel>
              </Paper>
            </Grid>
          </Grid>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            message={this.state.snackMessage}
            open={this.state.snack}
            onClose={() => {
              this.setState({ snack: false });
            }}
            autoHideDuration={5000}
          />
        </div>
      </Container>
    );
  }
}

export default UserProfile;
