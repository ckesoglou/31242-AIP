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
} from "@material-ui/core";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import { UserContext } from "../components/user-context";

type UserProfileState = {
  tabIndex: number;
  newRequestDialog: boolean;
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
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

class UserProfile extends React.Component<IUserProfileProps, UserProfileState> {
  state: UserProfileState = {
    tabIndex: 0,
    newRequestDialog: false,
  };

  static contextType: React.Context<{
    user: {};
    updateUser: (newUser: object) => void;
  }> = UserContext;

  handleTabsChange = (event: ChangeEvent<{}>, index: number) => {
    this.setState({ tabIndex: index });

    switch (index) {
      case 0:
        // Owed API call
        fetch(`${userProfileEndpoint}`);

      case 1:
      // Owe API call
      case 2:
      // Requests API call
    }
  };

  render() {
    let context = this.context;
    let userDetails = context.user;

    if (userDetails) {
      return (
        <div>
          <p>Well well well...</p>
          <p>Welcome {userDetails.name} to the table!</p>
        </div>
      );
    }

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
              <Link href="/">Click here to go back!</Link>
            </Grid>
            <Grid item xs={4}>
              <div className="section">
                <Paper>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum
                  passages, and more recently with desktop publishing software
                  like Aldus PageMaker including versions of Lorem Ipsum.
                </Paper>
                <br></br>
                <Paper>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum
                  passages, and more recently with desktop publishing software
                  like Aldus PageMaker including versions of Lorem Ipsum.
                </Paper>
              </div>
            </Grid>
            <Grid item xs={8}>
              <div className="section">
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
                      id="addRequestButton"
                      color="primary"
                      fontSize="large"
                      onClick={() => this.setState({ newRequestDialog: true })}
                    />
                    <Dialog
                      maxWidth="sm"
                      scroll="paper"
                      open={this.state.newRequestDialog}
                      TransitionComponent={Grow}
                      onClose={() => this.setState({ newRequestDialog: false })}
                    >
                      <DialogTitle
                        disableTypography={true}
                        id="requestFormTitle"
                      >
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
                  <TabPanel value={this.state.tabIndex} index={0}>
                    Item One <br></br>Lorem Ipsum is simply dummy text of the
                    printing and typesetting industry. Lorem Ipsum has been the
                    industry's standard dummy text ever since the 1500s, when an
                    unknown printer took a galley of type and scrambled it to
                    make a type specimen book. It has survived not only five
                    centuries, but also the leap into electronic typesetting,
                    remaining essentially unchanged. It was popularised in the
                    1960s with the release of Letraset sheets containing Lorem
                    Ipsum passages, and more recently with desktop publishing
                    software like Aldus PageMaker including versions of Lorem
                    Ipsum.<br></br>
                    <br></br>Lorem Ipsum is simply dummy text of the printing
                    and typesetting industry. Lorem Ipsum has been the
                    industry's standard dummy text ever since the 1500s, when an
                    unknown printer took a galley of type and scrambled it to
                    make a type specimen book. It has survived not only five
                    centuries, but also the leap into electronic typesetting,
                    remaining essentially unchanged. It was popularised in the
                    1960s with the release of Letraset sheets containing Lorem
                    Ipsum passages, and more recently with desktop publishing
                    software like Aldus PageMaker including versions of Lorem
                    Ipsum.
                  </TabPanel>
                  <TabPanel value={this.state.tabIndex} index={1}>
                    Item Two <br></br>Lorem Ipsum is simply dummy text of the
                    printing and typesetting industry. Lorem Ipsum has been the
                    industry's standard dummy text ever since the 1500s, when an
                    unknown printer took a galley of type and scrambled it to
                    make a type specimen book. It has survived not only five
                    centuries, but also the leap into electronic typesetting,
                    remaining essentially unchanged. It was popularised in the
                    1960s with the release of Letraset sheets containing Lorem
                    Ipsum passages, and more recently with desktop publishing
                    software like Aldus PageMaker including versions of Lorem
                    Ipsum.<br></br>
                    <br></br>Lorem Ipsum is simply dummy text of the printing
                    and typesetting industry. Lorem Ipsum has been the
                    industry's standard dummy text ever since the 1500s, when an
                    unknown printer took a galley of type and scrambled it to
                    make a type specimen book. It has survived not only five
                    centuries, but also the leap into electronic typesetting,
                    remaining essentially unchanged. It was popularised in the
                    1960s with the release of Letraset sheets containing Lorem
                    Ipsum passages, and more recently with desktop publishing
                    software like Aldus PageMaker including versions of Lorem
                    Ipsum.
                  </TabPanel>
                  <TabPanel value={this.state.tabIndex} index={2}>
                    Item Three <br></br>Lorem Ipsum is simply dummy text of the
                    printing and typesetting industry. Lorem Ipsum has been the
                    industry's standard dummy text ever since the 1500s, when an
                    unknown printer took a galley of type and scrambled it to
                    make a type specimen book. It has survived not only five
                    centuries, but also the leap into electronic typesetting,
                    remaining essentially unchanged. It was popularised in the
                    1960s with the release of Letraset sheets containing Lorem
                    Ipsum passages, and more recently with desktop publishing
                    software like Aldus PageMaker including versions of Lorem
                    Ipsum.<br></br>
                    <br></br>Lorem Ipsum is simply dummy text of the printing
                    and typesetting industry. Lorem Ipsum has been the
                    industry's standard dummy text ever since the 1500s, when an
                    unknown printer took a galley of type and scrambled it to
                    make a type specimen book. It has survived not only five
                    centuries, but also the leap into electronic typesetting,
                    remaining essentially unchanged. It was popularised in the
                    1960s with the release of Letraset sheets containing Lorem
                    Ipsum passages, and more recently with desktop publishing
                    software like Aldus PageMaker including versions of Lorem
                    Ipsum.
                  </TabPanel>
                </Paper>
              </div>
            </Grid>
          </Grid>
        </div>
      </Container>
    );
  }
}

export default UserProfile;
