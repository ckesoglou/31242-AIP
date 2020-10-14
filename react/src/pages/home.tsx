import React from "react";
import { RouteComponentProps } from "react-router-dom";
import "../assets/css/home.css";
import {
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { UserContext } from "../components/user-context";
import { AvatarWithMenu } from "../components/avatarWithMenu";
import Leaderboard from "../components/leaderboard";
import { Search } from "@material-ui/icons";
import Request from "../components/request";

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

class Home extends React.Component {
  private loadingRef: React.RefObject<HTMLInputElement>;

  constructor(props: RouteComponentProps) {
    super(props);

    this.loadingRef = React.createRef();
  }

  static contextType: React.Context<{
    user: {};
    updateUser: (newUser: object) => void;
  }> = UserContext;

  setLoading(value: boolean): void {
    this.loadingRef.current!.style.display = value ? "block" : "none";
  }

  render() {
    return (
      <Container component="main" maxWidth="lg">
        <div className="paper">
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <div id="header">
                <img
                  width="120"
                  height="80"
                  alt="IOU Logo"
                  src={process.env.PUBLIC_URL + "/iou-logo.png"}
                />
                <Typography component="h1" variant="h4">
                  {"Home"}
                </Typography>
                <AvatarWithMenu fullName={this.context.user.name} />
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
                <div>
                  {/* <h2>
                    Well well well.. look who it is - {this.context.user.name}!
                  </h2> */}
                  <Request request={{
                id: "1",
                author: {username:"James", display_name: "James"},
                completed_by: {username:"Kevin", display_name: "Kevin"},
                proof_of_completion: "",
                rewards: [{id:"1", display_name:"Hug"}, {id:"2", display_name:"Coffee"}],
                details: "Clean the fridge",
                created_time: "02/02/2020",
                comletion_time: "02/02/2020",
                is_completed: true,
              }}/><Request request={{
                id: "1",
                author: {username:"James", display_name: "James"},
                completed_by: {username:"Kevin", display_name: "James Lee"},
                proof_of_completion: "",
                rewards: [{id:"1", display_name:"Hug"}, {id:"2", display_name:"Coffee"}],
                details: "Clean the fridge asdf sadf asdf asdf sdaf dsaf sadf sadf SOmething extra that shouldn't be seen",
                created_time: "02/02/2020",
                comletion_time: "02/02/2020",
                is_completed: false,
              }}/><Request request={{
                id: "1",
                author: {username:"James", display_name: "James"},
                completed_by: {username:"Kevin", display_name: "James Long Lee"},
                proof_of_completion: "",
                rewards: [{id:"1", display_name:"Hug"}, {id:"2", display_name:"Coffee"}],
                details: "Clean the fridge",
                created_time: "02/02/2020",
                comletion_time: "02/02/2020",
                is_completed: true,
              }}/>
                  <CircularProgress
                    ref={this.loadingRef}
                    size={35}
                    color="inherit"
                    id="loading"
                  />
                </div>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Leaderboard />
            </Grid>
          </Grid>
        </div>
      </Container>
    );
  }
}

export default Home;
