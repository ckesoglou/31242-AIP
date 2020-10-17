import React from "react";
import "../assets/css/iou-request.css";
import { requestsEndpoint } from "../api/endpoints";
import RequestReward from "./request-reward";
import { Popover, Button, Typography, Divider } from "@material-ui/core";

type Item = {
  id: string;
  display_name: string;
};

type RequestRewardsProps = {
  requestID: string;
  items: Item[];
  rewards: Item[];
};

type RequestRewardState = {
  anchorEl: HTMLElement | null;
  selectedReward: string;
};

class RequestRewards extends React.Component<
  RequestRewardsProps,
  RequestRewardState
> {
  state: RequestRewardState = {
    anchorEl: null,
    selectedReward: "",
  };

  fetchPotentialRewards() {
    //TODO: Waiting for rewards endpoint to be created. Will just pass rewards through props right now.
  }

  postReward() {
    fetch(`${requestsEndpoint.concat(this.props.requestID)}/rewards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        item: this.state.selectedReward,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((body) => {
        console.log("Success:", body);
      })
      .catch((exception) => {
        console.error("Error:", exception);
      });
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
          <div className="firstCircle">{this.props.items[0].display_name}</div>
          <div className="secondCircle">{this.props.items[1].display_name}</div>
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
          <div className="firstCircle">{this.props.items[0].display_name}</div>
          <div className="secondCircle">+</div>
        </div>
      );
    }
  }

  render() {
    return (
      <div id="requestItem">
        {this.renderItems()}
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
              >
                Add Reward?
              </Button>
            </div>
          </div>
        </Popover>
      </div>
    );
  }
}

export default RequestRewards;
