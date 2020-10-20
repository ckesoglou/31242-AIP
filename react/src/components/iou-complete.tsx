import React from "react";
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
import { imageEndpoint, requestsEndpoint } from "../api/endpoints";

type Item = {
  id: string;
  display_name: string;
};

type RequestObj = {
  id: string;
  author: { username: string; display_name: string };
  completed_by: { username: string; display_name: string };
  proof_of_completion: string;
  rewards: Item[];
  details: string;
  created_time: string;
  completion_time: string;
  is_completed: boolean;
};

type IouCompleteProps = {
  request: RequestObj;
};

type IouCompleteState = {
  completeIOU: boolean;
  submittedProof: any;
  snackMessage: string;
  completeSnack: boolean;
  AnchorEl: HTMLElement | null;
};

class IouComplete extends React.Component<IouCompleteProps, IouCompleteState> {
  private tempRewardDisplayName: string;

  constructor(props: IouCompleteProps) {
    super(props);

    this.tempRewardDisplayName = "";
    this.openCompleteForm = this.openCompleteForm.bind(this);
  }

  state: IouCompleteState = {
    completeIOU: false,
    submittedProof: null,
    snackMessage: "",
    completeSnack: false,
    AnchorEl: null,
  };

  openCompleteForm() {
    if (!this.props.request.is_completed) {
      this.setState({ completeIOU: true });
    }
  }

  submitProof() {
    fetch(`${imageEndpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // requestID: ???,
        // proof: this.state.submittedProof ???
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((body) => {
        console.log("Success:", body);
        this.setState({ snackMessage: "IOU Completion proof submitted!" });
        this.setState({ completeSnack: true });
      })
      .catch((exception) => {
        console.error("Error:", exception);
        this.setState({ snackMessage: exception });
        this.setState({ completeSnack: true });
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
        //Need to discuss how submitted images should be formatted (Size, Encode Format)
      );
    } else {
      return (
        <DialogContentText variant="body2" id="completeProofFileInfo">
          {"Upload an image (JPEG/PNG) before pressing the 'Submit' button"}
        </DialogContentText>
      );
    }
  }

  fetchRewardDetails(requestID: string, rewardID: string) {
    fetch(
      `${requestsEndpoint
        .concat(requestID)
        .concat("/reward/")
        .concat(rewardID)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((body) => {
        console.log("Success:", body);
        this.tempRewardDisplayName = body.giver.display_name;
      })
      .catch((exception) => {
        console.error("Error:", exception);
        this.tempRewardDisplayName = "Could not find user display name";
      });
  }

  renderPopUpRewards(item: Item) {
    //this.fetchRewardDetails(this.props.request.id, item.id);
    this.tempRewardDisplayName = "James Lee";
    return (
      <IouFavour
        key={item.id}
        giverDisplayName={this.tempRewardDisplayName}
        recieverDisplayName={"?"}
        item={item}
      />
    );
  }

  render() {
    return (
      <div id="completeRequestItem">
        <div
          onClick={() => {
            if (!this.props.request.is_completed) {
              this.setState({ completeIOU: true });
            }
          }}
          className={this.props.request.is_completed ? "" : "cursorPointer"}
        >
          <Checkbox
            checked={this.props.request.is_completed}
            color="primary"
            disabled={true}
            checkedIcon={
              <CheckCircleOutlineIcon color="primary" id="completeIconSize" />
            }
            icon={
              <RadioButtonUncheckedIcon color="primary" id="completeIconSize" />
            }
          />
          {this.props.request.is_completed && (
            <div id="IouTaskComplete">
              {this.props.request.completed_by.display_name.length > 9 ? (
                <Typography
                  id="taskCompleter"
                  className="cursorPointer"
                  onClick={(event: React.MouseEvent<HTMLElement>) =>
                    this.setState({ AnchorEl: event.currentTarget })
                  }
                >
                  {this.props.request.completed_by.display_name}
                </Typography>
              ) : (
                <Typography id="taskCompleter">
                  {this.props.request.completed_by.display_name}
                </Typography>
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
                  {this.props.request.completed_by.display_name}
                </Typography>
              </Popover>
              <Typography id="taskTimeStamp">
                {this.props.request.completion_time}
              </Typography>
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
                      Created by:
                    </TableCell>
                    <TableCell
                      align="center"
                      className="infoTableCell"
                      id="infoTableContent"
                    >
                      {this.props.request.author.display_name}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center" id="infoTableTitle">
                      Created on:
                    </TableCell>
                    <TableCell align="center" id="infoTableContent">
                      {this.props.request.created_time}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center" id="infoTableTitle">
                      Task:
                    </TableCell>
                    <TableCell align="center" id="infoTableContent">
                      {this.props.request.details}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogContent className="Content" id="completePopUpRewards">
            <DialogContentText variant="h6">{"Rewards"}</DialogContentText>
            {this.props.request.rewards.map((item) =>
              this.renderPopUpRewards(item)
            )}
          </DialogContent>
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
          <Divider />
          <DialogActions>
            <Button
              id="createRequest"
              size="large"
              color="primary"
              onClick={() => {
                this.submitProof();
                this.setState({
                  completeIOU: false,
                });
              }}
              autoFocus
              disabled={!this.state.submittedProof}
            >
              Submit
            </Button>
            <Button
              size="large"
              color="primary"
              onClick={() =>
                this.setState({ completeIOU: false, submittedProof: null })
              }
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
