import React from "react";
import "../assets/css/iou-request.css";
import DeleteIcon from "@material-ui/icons/Delete";
import { requestEndpoint } from "../api/endpoints";
import { Redirect } from "react-router-dom";
import { Snackbar } from "@material-ui/core";

type DeleteRewardProps = {
  requestID: string;
  rewardID: string;
  refreshTable: () => void;
  closeModal: () => void;
};

type deleteRewardState = {
  unauthRep: boolean;
  snackMessage: string;
  snack: boolean;
};

class DeleteRequestReward extends React.Component<
  DeleteRewardProps,
  deleteRewardState
> {
  state: deleteRewardState = {
    unauthRep: false,
    snackMessage: "",
    snack: false,
  };

  deleteReward(requestID: string, rewardID: string) {
    fetch(`${requestEndpoint}/${requestID}/reward/${rewardID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          // Successful login 200
          this.setState({
            snackMessage: "Reward succesfully deleted from request! :O",
            snack: true,
          });
          this.props.closeModal();
          this.props.refreshTable();
        } else if (res.status === 401) {
          this.setState({ unauthRep: true });
        } else {
          // Unsuccessful login (400 or something else)
          res.json().then((body) =>
            this.setState({
              snackMessage: body.errors,
              snack: true,
            })
          );
        }
      })
      .catch((exception) => {
        console.error("Error:", exception);
      });
  }

  render() {
    // If unauthorised response (e.g. expired token), redirect to login
    if (this.state.unauthRep) {
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
      <div
        onClick={() =>
          this.deleteReward(this.props.requestID, this.props.rewardID)
        }
        id="requestItem"
      >
        <DeleteIcon id="deleteIcon" />
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
    );
  }
}
export default DeleteRequestReward;
