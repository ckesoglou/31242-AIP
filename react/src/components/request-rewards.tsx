import React from "react";
import "../assets/css/iou-request.css";
import { requestEndpoint } from "../api/endpoints";
import RequestReward from "./request-reward";
import { Redirect } from "react-router-dom";
import {
  Popover,
  Button,
  Typography,
  Divider,
  Snackbar,
} from "@material-ui/core";

type Item = {
  id: string;
  display_name: string;
};

type RequestRewardsProps = {
  requestID: string;
  items: RewardItem[];
  rewards: Item[];
  is_completed: boolean;
};

type RewardItem = {
  id: string; // UUID;
  giver: { username: string; display_name: string };
  item: { id: string; display_name: string };
};

type RequestRewardState = {
  anchorEl: HTMLElement | null;
  selectedReward: string;
  potentialItems: Item[];
  snackMessage: string;
  unauthRep: boolean;
};

class RequestRewards extends React.Component<
  RequestRewardsProps,
  RequestRewardState
> {
  state: RequestRewardState = {
    anchorEl: null,
    selectedReward: "",
    potentialItems: [],
    snackMessage: "",
    unauthRep: false,
  };

  postReward() {
    fetch(`${requestEndpoint.concat("/" + this.props.requestID)}/rewards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        item: this.state.selectedReward,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          // Successful login 200
          this.setState({
            snackMessage: "Reward successfully added to the request!",
          });
        } else if (res.status === 401) {
          this.setState({ unauthRep: true });
        } else {
          // Unsuccessful login (400 or 422)
          res
            .json()
            .then((body) => this.setState({ snackMessage: body.errors }));
        }
      })
      .catch(console.log);
  }

  renderRewardElement(item: Item) {
    return (
      <RequestReward
        key={item.id}
        itemId={item.id}
        display_name={item.display_name}
        setSelectedReward={(itemId: string) =>
          this.setState({ selectedReward: itemId })
        }
      />
    );
  }

  renderItem(item: Item) {
    return <div className="circle multipleItemCircle">{item.display_name}</div>;
  }

  renderItems() {
    if (this.props.items.length > 1) {
      return (
        <div
          id="multipleItemsContainer"
          onClick={(event: React.MouseEvent<HTMLElement>) => {
            this.setState({
              anchorEl: event.currentTarget,
            });
          }}
        >
          <div className="firstCircle">
            {this.props.items[0].item.display_name}
          </div>
          <div className="secondCircle">
            {this.props.items[1].item.display_name}
          </div>
          <div className="secondCircle thirdCircle">+</div>
        </div>
      );
    } else {
      return (
        <div
          id="multipleItemsContainer"
          onClick={(event: React.MouseEvent<HTMLElement>) => {
            this.setState({
              anchorEl: event.currentTarget,
            });
          }}
        >
          {this.props.items.length === 1 && (
            <div className="firstCircle">
              {this.props.items[0].item.display_name}
            </div>
          )}
          <div className="secondCircle">+</div>
        </div>
      );
    }
  }

  render() {
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
      <div id="requestItem">
        {this.renderItems()}
        {!this.props.is_completed && (
          <Popover
            id="requestRewardPopover"
            open={Boolean(this.state.anchorEl)}
            anchorEl={this.state.anchorEl}
            onClose={() => this.setState({ anchorEl: null })}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <div id="requestRewardPopUp">
              <div id="requestPopUpContent">
                <Typography id="requestPopUpText">
                  Choose a reward to add
                </Typography>
                <Divider />
                <div id="requestAddContainer">
                  {this.props.rewards.map((item) =>
                    this.renderRewardElement(item)
                  )}
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  id="addRewardButton"
                  onClick={() => this.postReward()}
                  disabled={this.state.selectedReward == ""}
                >
                  Add Reward?
                </Button>
              </div>
            </div>
          </Popover>
        )}
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          message={this.state.snackMessage}
          open={this.state.snackMessage !== ""}
          onClose={() => {
            this.setState({ snackMessage: "" });
          }}
          autoHideDuration={5000}
        />
      </div>
    );
  }
}

export default RequestRewards;
