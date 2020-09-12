import React from "react";
import { RouteComponentProps } from "react-router-dom";
import "../assets/css/userprofile.css";
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
} from "@material-ui/core";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";

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

  handleOpen(): void {}

  render() {
    return (
      <Container component="main" maxWidth="lg">
        <div className="paper">
          <Grid container spacing={8}>
            <Grid item xs={12}>
              {/* <Paper className="paper">Profile</Paper> */}
              <div id="header">
                <Typography component="h1" variant="h4">
                  Profile
                </Typography>
                <Link href="/">Click here to go back!</Link>
              </div>
            </Grid>
            <Grid item xs={4}>
              <Paper className="paper">Bob</Paper>
            </Grid>
            <Grid item xs={8}>
              <Tabs
                value={this.state.tabIndex}
                onChange={(e, i) => this.setState({ tabIndex: i })}
                variant="fullWidth"
              >
                <Tab label="Owed" />
                <Tab label="Owe" />
                <Tab label="Requests" />
                <AddBoxOutlinedIcon
                  color="primary"
                  fontSize="large"
                  onClick={() => this.setState({ newRequestDialog: true })}
                />
                <Dialog
                  maxWidth="md"
                  scroll="paper"
                  open={this.state.newRequestDialog}
                  TransitionComponent={Grow}
                  onClose={() => this.setState({ newRequestDialog: false })}
                >
                  <DialogTitle id="alert-dialog-title">
                    {"Create a new request?"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Let Google help apps determine location. This means
                      sending anonymous location data to Google, even when no
                      apps are running.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => this.setState({ newRequestDialog: false })}
                      color="primary"
                    >
                      Disagree
                    </Button>
                    <Button
                      onClick={() => this.setState({ newRequestDialog: false })}
                      color="primary"
                      autoFocus
                    >
                      Agree
                    </Button>
                  </DialogActions>
                </Dialog>
              </Tabs>
              <TabPanel value={this.state.tabIndex} index={0}>
                Item One
              </TabPanel>
              <TabPanel value={this.state.tabIndex} index={1}>
                Item Two
              </TabPanel>
              <TabPanel value={this.state.tabIndex} index={2}>
                Item Three
              </TabPanel>
              <Paper className="paper">Jackson</Paper>
            </Grid>
          </Grid>
        </div>
      </Container>
    );
  }
}

export default UserProfile;
