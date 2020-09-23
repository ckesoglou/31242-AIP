import React, { ChangeEvent } from "react";
import { RouteComponentProps } from "react-router-dom";
import "../assets/css/userprofile.css";
import { userProfileEndpoint } from "../api/endpoints";
import { Authentication } from "../components/protected-route";
import {
  Container,
  Typography,
  Paper,
  Link,
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
} from "@material-ui/core";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import RefreshIcon from "@material-ui/icons/Refresh";
import { UserContext } from "../components/user-context";

type UserProfileState = {
  tabIndex: number;
  newRequestDialog: boolean;
  owed: string;
  owe: string;
  requests: string;
  error: string;
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
    tabIndex: 0,
    newRequestDialog: false,
    owed: "",
    owe: "",
    requests: "",
    error: "",
  };

  static contextType: React.Context<{
    user: {};
    updateUser: (newUser: object) => void;
  }> = UserContext;

  setLoading(value: boolean): void {
    if (value) {
      this.textRef.current!.style.display = "none";
      this.loadingRef.current!.style.display = "block";
    } else {
      this.textRef.current!.style.display = "block";
      this.loadingRef.current!.style.display = "none";
    }
  }

  componentDidMount() {
    this.fetchAll();
  }

  fetchAll(): void {
    const headers = {
      "Content-Type": "application/json",
    };
    this.setLoading(true);
    Promise.all([
      fetch(`${userProfileEndpoint.concat(this.context.user.name)}`, {
        method: "GET",
        headers: headers,
      }),
      fetch(`${userProfileEndpoint.concat(this.context.user.name)}`, {
        method: "GET",
        headers: headers,
      }),
      fetch(`${userProfileEndpoint.concat(this.context.user.name)}`, {
        method: "GET",
        headers: headers,
      }),
    ])
      .then(([owed, owe, requests]) => {
        Promise.all([owed.json(), owe.json(), requests.json()]).then(
          ([owedResult, oweResult, requestsResult]) => {
            this.setLoading(false);
            console.log("Success:", owedResult);
            console.log("Success:", oweResult);
            console.log("Success:", requestsResult);
            let owedRaw = JSON.stringify(owedResult);
            let oweRaw = JSON.stringify(oweResult);
            let requestsRaw = JSON.stringify(requestsResult);
            this.setState({
              owed: owedRaw,
              owe: oweRaw,
              requests: requestsRaw,
            });
          }
        );
      })
      .catch((exception) => {
        console.error("Error:", exception);
        this.setState({ error: exception });
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
              {/* <Paper className="paper">Profile</Paper> */}
              <div id="header">
                <Typography component="h2" variant="h4">
                  {"Placeholder IOU"}
                </Typography>
                <Typography component="h1" variant="h4">
                  {"Profile"}
                </Typography>
                <Typography component="h3" variant="h4">
                  {"Placeholder Image"}
                </Typography>
              </div>
              <p>Well well well.. look who it is - {this.context.user.name}!</p>
              <p>{this.state.error}</p>
              <Link href="/">Click here to go back!</Link>
            </Grid>
            <Grid item xs={4}>
              <Paper>
                <div className="section">
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
            </Grid>
            <Grid item xs={8}>
              {/* <div className="section"> */}
              <Paper className="content">
                <Tabs
                  value={this.state.tabIndex}
                  onChange={(e, i) => this.handleTabsChange(e, i)}
                  variant="fullWidth"
                >
                  <Tab label="Owed" />
                  <Tab label="Owe" />
                  <Tab label="Requests" />
                  <AddBoxOutlinedIcon
                    className={"tabButton"}
                    color="primary"
                    fontSize="large"
                    onClick={() => this.setState({ newRequestDialog: true })}
                  />
                  <RefreshIcon
                    className={"tabButton"}
                    color="primary"
                    fontSize="large"
                    onClick={() => this.fetchAll()}
                  />
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
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button
                        size="large"
                        color="primary"
                        onClick={() =>
                          this.setState({ newRequestDialog: false })
                        }
                        autoFocus
                      >
                        Create
                      </Button>
                      <Button
                        size="large"
                        color="primary"
                        onClick={() =>
                          this.setState({ newRequestDialog: false })
                        }
                      >
                        Nevermind
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Tabs>
                <TabPanel
                  value={this.state.tabIndex}
                  loadingRef={this.loadingRef}
                  textRef={this.textRef}
                  index={0}
                >
                  {this.state.owed}
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
              {/* </div> */}
            </Grid>
          </Grid>
        </div>
      </Container>
    );
  }
}

export default UserProfile;
