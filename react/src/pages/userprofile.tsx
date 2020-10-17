import React, { ChangeEvent } from "react";
import { RouteComponentProps, Link as RouterLink } from "react-router-dom";
import "../assets/css/userprofile.css";
import {
  requestsNewEndpoint,
  iouEndpoint,
  requestsEndpoint,
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
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import RefreshIcon from "@material-ui/icons/Refresh";
import { AvatarWithMenu } from "../components/avatarWithMenu";
import { UserContext } from "../components/user-context";
import IOU from "../components/iou";

// type IouType = {
//   id: string;
//   item: {
//     id: string;
//     display_name: string;
//   };
//   giver: {
//     username: string;
//     display_name: string;
//   };
//   parent_request: string;
//   proof_of_debt: string;
//   proof_of_completion: string;
//   created_time: string;
//   claimed_time: string;
//   is_claimed: boolean;
// };

type UserProfileState = {
  tabIndex: number;
  newRequestDialog: boolean;
  // owed: IouType[];
  // owe: IouType[];
  requests: Request[];
  newRequestFavour: string;
  newRequestReward: string;
  snack: boolean;
  snackMessage: any;
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
    // owed: [],
    // owe: [],
    requests: [],
    newRequestFavour: "",
    newRequestReward: "",
    snack: false,
    snackMessage: "",
  };

  static contextType = UserContext;

  setLoading(value: boolean): void {
    this.loadingRef.current!.style.display = value ? "block" : "none";
    this.textRef.current!.style.display = value ? "none" : "block";
  }

  componentDidMount() {
    this.fetchAllTabs();
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
        this.setState({ snack: true });
      })
      .catch((exception) => {
        console.error("Error:", exception);
        this.setState({ snackMessage: exception });
        this.setState({ snack: true });
      });
  }

  fetchAllTabs(): void {
    const headers = {
      "Content-Type": "application/json",
    };
    this.setLoading(true);
    Promise.all([
      fetch(`${iouEndpoint}/owed`, {
        method: "GET",
        headers: headers,
      }),
      fetch(`${iouEndpoint}/owe`, {
        method: "GET",
        headers: headers,
      }),
      fetch(`${requestsEndpoint}`, {
        method: "GET",
        headers: headers,
      }),
    ])
      .then(([owed, owe, requests]) => {
        Promise.all([owed.json(), owe.json(), requests.json()]).then(
          ([owedResult, oweResult, requestsResult]) => {
            this.setLoading(false);
            this.setState({
              // owed: owedResult,
              // owe: oweResult,
              requests: requestsResult,
            });
            console.log("Success:", owedResult, oweResult, requestsResult);
          }
        );
      })
      .catch((exception) => {
        console.error("Error:", exception);
        this.setLoading(false);
        // this.setState({ snackMessage: exception, snack: true });
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
                      {"Creating a new request..."}
                    </Typography>
                  </DialogTitle>
                  <DialogContent dividers className="content">
                    <DialogContentText id="requestFormQuestion">
                      {"Lets start with what you'd like..."}
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
                  open={this.state.snack}
                  onClose={() => {
                    this.setState({ snack: false });
                  }}
                  autoHideDuration={5000}
                />
                <TabPanel
                  value={this.state.tabIndex}
                  loadingRef={this.loadingRef}
                  textRef={this.textRef}
                  index={0}
                >
                  {/* {this.state.owed.map((owed, i) => {
                    return <IOU request={owed} key={i} />;
                  })} */}
                </TabPanel>
                <TabPanel
                  value={this.state.tabIndex}
                  loadingRef={this.loadingRef}
                  textRef={this.textRef}
                  index={1}
                >
                  {/* {this.state.owe.map((owe, i) => {
                    return <IOU request={owe} key={i} />;
                  })} */}
                </TabPanel>
                <TabPanel
                  value={this.state.tabIndex}
                  loadingRef={this.loadingRef}
                  textRef={this.textRef}
                  index={2}
                >
                  {/* {this.state.requests.map((request, i) => {
                    return <IOU request={request} key={i} />;
                  })} */}
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
