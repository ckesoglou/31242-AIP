import { ClickAwayListener } from "@material-ui/core";
import React from "react";
import "../assets/css/iou-request.css";

type RequestRewardProps = {
  itemId: string;
  display_name: string;
  setSelectedReward: (itemId: string) => void;
};

type RequestRewardState = {
  selected: boolean;
  open: boolean;
};

class RequestReward extends React.Component<
  RequestRewardProps,
  RequestRewardState
> {
  private rewardRef: React.RefObject<HTMLDivElement>;

  state: RequestRewardState = {
    selected: false,
    open: false,
  };
  constructor(props: RequestRewardProps) {
    super(props);

    this.rewardRef = React.createRef();
  }

  onClick(): void {
    this.props.setSelectedReward(this.props.itemId);
    this.rewardRef.current!.style.backgroundColor = "#86c232";
  }

  handleClick = () => {
    this.setState({ open: !this.state.open });
  };

  handleClickAway = () => {
    this.setState({ open: false });
    this.rewardRef.current!.style.backgroundColor = "";
  };

  render() {
    return (
      <ClickAwayListener onClickAway={this.handleClickAway}>
        <div
          className="popUpCircle"
          ref={this.rewardRef}
          onClick={() => {
            this.onClick();
          }}
        >
          {this.props.display_name}
        </div>
      </ClickAwayListener>
    );
  }
}

export default RequestReward;
