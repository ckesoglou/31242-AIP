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
// import { optional } from "joi";

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

  setLoading(value: boolean): void {
    this.loadingRef.current!.style.display = value ? "block" : "none";
    this.textRef.current!.style.display = value ? "none" : "block";
  }

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

  setCountOfOwed(): number {
    if (this.state.owed.length % numberOfItemsPerPage !== 0) {
      return Math.ceil(this.state.owed.length / numberOfItemsPerPage);
    } else {
      return this.state.owed.length / numberOfItemsPerPage;
    }
  }

  setCountOfOwe(): number {
    if (this.state.owe.length % numberOfItemsPerPage !== 0) {
      return Math.ceil(this.state.owe.length / numberOfItemsPerPage);
    } else {
      return this.state.owe.length / numberOfItemsPerPage;
    }
  }

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
                "New IOU created!" +
                (body.usersInParty.length > 2
                  ? " You and " +
                    body.usersInParty.splice(0, 1).join(", ") +
                    " have a circular IOU party. We suggest you guys treat each other! ;)"
                  : ""),
              snack: true,
              newRequestDialog: false,
            });
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
                "New IOU created!" +
                (body.hasOwnProperty("usersInParty")
                  ? " You and " +
                    body.usersInParty.splice(0, 1).join(", ") +
                    " have a circular IOU party. We suggest you guys treat each other! :)"
                  : ""),
              snack: true,
              newRequestDialog: false,
            })
          );
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

  fetchAllTabs(): void {
    //NEEDS TO BE INTEGRATED??
    const headers = {
      "Content-Type": "application/json",
    };
    this.setLoading(true);
    Promise.all([
      fetch(`${iouOwedEndpoint}`, {
        method: "GET",
        headers: headers,
      }),
      fetch(`${iouOweEndpoint}`, {
        method: "GET",
        headers: headers,
      }),
      fetch(`${requestsEndpoint}?author=${this.context.user.name}`, {
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
            console.log("Success:", owedResult, oweResult, requestResult);
          }
        );
      })
      .catch(([owedException, oweException, requestException]) => {
        console.error("Error:", owedException, oweException, requestException);
        this.setLoading(false);
        this.setState({ unauthRep: true });
      });
  }

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

  handleTabsChange(event: ChangeEvent<{}> | undefined, index: number): void {
    this.setState({ tabIndex: index });
    // This method may be needed in the future
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
        //Need to discuss how submitted images should be formatted (Size, Encode Format)
      );
    } else {
      return (
        <DialogContentText variant="body2" id="completeProofFileInfo">
          {"Upload an image (JPEG/PNG) before pressing the 'Create' button"}
        </DialogContentText>
      );
    }
  }

  checkCreatButton(): boolean {
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
                      disabled={this.checkCreatButton()}
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
                      return <IOU iou={owed} key={i} iouType={0} />;
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
                      return <IOU iou={owe} key={i} iouType={1} />;
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
                  {() => {
                    if (this.state.requests) {
                      this.state.requests.map((request, i) => {
                        return (
                          <IouRequest
                            request={request}
                            potentialRewards={this.state.potentialItems}
                            iouType={2}
                            key={i}
                          />
                        );
                      });
                    }
                  }}
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
