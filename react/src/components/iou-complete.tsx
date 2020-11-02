import React from "react";
import { Redirect } from "react-router-dom";
import {
  Checkbox,
  Dialog,
  Grow,
  DialogTitle,
  Typography,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Divider,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Popover,
} from "@material-ui/core";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import "../assets/css/iou-request.css";
import IouFavour from "./iou-single-favour";
import {
  requestEndpoint,
  iouOweEndpoint,
  iouOwedEndpoint,
} from "../api/endpoints";

type Item = {
  id: string;
  display_name: string;
};

type RewardItem = {
  id: string; // UUID;
  giver: { username: string; display_name: string };
  item: { id: string; display_name: string };
};

type IouCompleteProps = {
  id: string;
  is_completed: boolean;
  author: string;
  completed_by: string;
  claimed_time: string | null;
  created_time: string;
  rewards: RewardItem[];
  details: string;
  iouType: number;
  refreshTable: () => void;
};

type IouCompleteState = {
  completeIOU: boolean;
  submittedProof: any;
  snackMessage: string;
  completeSnack: boolean;
  AnchorEl: HTMLElement | null;
  unauthRep: boolean;
};

class IouComplete extends React.Component<IouCompleteProps, IouCompleteState> {
  private tempRewardDisplayName: string; // Not in state because it'll cause everything to go into a render loop
  constructor(props: IouCompleteProps) {
    super(props);
    this.tempRewardDisplayName = "";
  }

  state: IouCompleteState = {
    completeIOU: false,
    submittedProof: null,
    snackMessage: "",
    completeSnack: false,
    AnchorEl: null,
    unauthRep: false,
  };

  completeIouOwe() {
    const formData = new FormData();
    formData.append("proof", this.state.submittedProof);

    fetch(`${iouOweEndpoint}/${this.props.id}/complete`, {
      method: "PUT",
      body: formData,
    })
      .then((res) => {
        if (res.status === 200) {
          // Successful login 200
          this.setState({
            snackMessage: "IOU Proof Submitted & IOU Completed!",
          });
          this.setState({ completeSnack: true });
          this.props.refreshTable();
        } else if (res.status === 401) {
          this.setState({ unauthRep: true });
        } else {
          // Unsuccessful login (400)
          res.json().then((body) =>
            this.setState({
              snackMessage: body.errors,
              completeSnack: true,
            })
          );
        }
      })
      .catch((exception) => {
        console.log("Error:", exception);
      });
  }

  completeIouOwed() {
    fetch(`${iouOwedEndpoint}/${this.props.id}/complete`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          // Successful login 200
          this.setState({ snackMessage: "IOU Completed!" });
          this.setState({ completeSnack: true });
          this.props.refreshTable();
        } else if (res.status === 401) {
          this.setState({ unauthRep: true });
        } else {
          // Unsuccessful login (400)
          res.json().then((body) =>
            this.setState({
              snackMessage: body.errors,
              completeSnack: true,
            })
          );
        }
      })
      .catch((exception) => {
        console.log("Error:", exception);
      });
  }

  completeRequest() {
    const formData = new FormData();
    formData.append("proof", this.state.submittedProof);

    fetch(`${requestEndpoint}/${this.props.id}/complete`, {
      method: "PUT",
      body: formData,
    })
      .then((res) => {
        if (res.status === 200) {
          // Successful login 200
          this.setState({ snackMessage: "Request Completed!" });
          this.setState({ completeSnack: true });
          this.props.refreshTable();
        } else if (res.status === 401) {
          this.setState({ unauthRep: true });
        } else {
          // Unsuccessful login (400)
          res.json().then((body) =>
            this.setState({
              snackMessage: body.errors,
              completeSnack: true,
            })
          );
        }
      })
      .catch((exception) => {
        console.log("Error:", exception);
      });
  }

  fileContent() {
    if (this.state.submittedProof) {
      return (
        <div id="completeProofFileInfo">
          <DialogContentText variant="body2">
            {"Image Preview: "}
          </DialogContentText>
          <img
            src={URL.createObjectURL(this.state.submittedProof)}
            alt={this.state.submittedProof.name}
            id="completeProofImage"
          />
        </div>
      );
    } else {
      return (
        <DialogContentText variant="body2" id="completeProofFileInfo">
          {"Upload an image (JPEG/PNG) before pressing the 'Submit' button"}
        </DialogContentText>
      );
    }
  }

  renderPopUpRewards(reward: RewardItem) {
    return (
      <IouFavour
        key={reward.item.id}
        giverDisplayName={reward.giver.display_name}
        recieverDisplayName={"?"}
        item={reward.item}
      />
    );
  }

  checkSubmitButton(): boolean {
    if (this.props.iouType !== 0) {
      return !this.state.submittedProof;
    }
    return false;
  }

  render() {
    if (this.state.unauthRep) {
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
      <div id="completeRequestItem">
        <div
          onClick={() => {
            if (!this.props.is_completed) {
              this.setState({ completeIOU: true });
            }
          }}
          className={this.props.is_completed ? "" : "cursorPointer"}
        >
          <Checkbox
            checked={this.props.is_completed}
            color="primary"
            disabled={true}
            checkedIcon={
              <CheckCircleOutlineIcon color="primary" id="completeIconSize" />
            }
            icon={
              <RadioButtonUncheckedIcon color="primary" id="completeIconSize" />
            }
          />
          {this.props.is_completed && (
            <div id="IouTaskComplete">
              {this.props.completed_by.length >= 7 ? (
                <Typography
                  id="taskCompleter"
                  className="cursorPointer"
                  onClick={(event: React.MouseEvent<HTMLElement>) =>
                    this.setState({ AnchorEl: event.currentTarget })
                  }
                >
                  {this.props.completed_by}
                </Typography>
              ) : (
                <div>
                  <Typography id="taskCompleter">
                    {this.props.completed_by}
                  </Typography>
                  <Typography id="taskTimeStamp">
                    {this.props.claimed_time}
                  </Typography>
                </div>
              )}
              <Popover
                id="popUpMargin"
                open={Boolean(this.state.AnchorEl)}
                anchorEl={this.state.AnchorEl}
                onClose={() => this.setState({ AnchorEl: null })}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <Typography id="taskDetailPopUp">
                  {"Full Display Name"}
                  <Divider id="taskPopUpDivider" />
                  {this.props.completed_by}
                </Typography>
              </Popover>
            </div>
          )}
        </div>
        <Dialog
          maxWidth="xs"
          fullWidth={true}
          scroll="body"
          open={this.state.completeIOU}
          TransitionComponent={Grow}
          onClose={() =>
            this.setState({ completeIOU: false, submittedProof: null })
          }
          id="completeForm"
        >
          <DialogTitle disableTypography={true}>
            <Typography variant="h5" id="modalTitle">
              {"IOU Proof Submission"}
            </Typography>
          </DialogTitle>
          <Divider />
          <DialogContent className="content" id="completeDetailsTable">
            <DialogContentText variant="h6">{"IOU Details"}</DialogContentText>
            <TableContainer id="infoTable">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell
                      align="center"
                      className="infoTableCell"
                      id="infoTableTitle"
                    >
                      {this.props.iouType === 2 ? "Request" : "IOU"} created by:
                    </TableCell>
                    <TableCell
                      align="center"
                      className="infoTableCell"
                      id="infoTableContent"
                    >
                      {this.props.author}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center" id="infoTableTitle">
                      {this.props.iouType === 2 ? "Request" : "IOU"} Created on:
                    </TableCell>
                    <TableCell align="center" id="infoTableContent">
                      {this.props.created_time}
                    </TableCell>
                  </TableRow>
                  {this.props.details !== "" && (
                    <TableRow>
                      <TableCell align="center" id="infoTableTitle">
                        {this.props.iouType === 2
                          ? "Task:"
                          : this.props.iouType === 1
                          ? "Will be completed by:"
                          : "Will be completed by:"}
                      </TableCell>
                      <TableCell align="center" id="infoTableContent">
                        {this.props.iouType === 2
                          ? this.props.details
                          : this.props.iouType === 1
                          ? "Me :)"
                          : this.props.completed_by}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          {this.props.iouType === 2 && (
            <DialogContent className="Content" id="completePopUpRewards">
              <DialogContentText variant="h6">{"Rewards"}</DialogContentText>
              {this.props.rewards.map((reward) =>
                this.renderPopUpRewards(reward)
              )}
            </DialogContent>
          )}
          {this.props.iouType !== 0 && (
            <DialogContent className="content">
              <DialogContentText variant="h6">
                {"Upload proof?"}
              </DialogContentText>
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files) {
                    this.setState({ submittedProof: e.target.files[0] });
                  }
                }}
                accept="image/*"
                id="inputProof"
              />
              <label htmlFor="inputProof">
                <Button variant="contained" color="primary" component="span">
                  {this.state.submittedProof ? "CHANGE" : "UPLOAD"}
                </Button>
              </label>
              {this.fileContent()}
            </DialogContent>
          )}
          <Divider />
          <DialogActions>
            <Button
              size="large"
              color="primary"
              onClick={() =>
                this.setState({ completeIOU: false, submittedProof: null })
              }
            >
              Nevermind
            </Button>
            <Button
              id="createRequest"
              size="large"
              color="primary"
              onClick={() => {
                if (this.props.iouType === 0) {
                  this.completeIouOwed();
                } else if (this.props.iouType === 1) {
                  this.completeIouOwe();
                } else {
                  this.completeRequest();
                }
                this.setState({
                  completeIOU: false,
                });
              }}
              autoFocus
              disabled={this.checkSubmitButton()}
            >
              {"Submit & Complete"}
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          message={this.state.snackMessage}
          open={this.state.completeSnack}
          onClose={() => {
            this.setState({ completeSnack: false });
          }}
          autoHideDuration={5000}
        />
      </div>
    );
  }
}

export default IouComplete;
