import React from "react";
import "../assets/css/iou-request.css";
import { Popover, Typography, Divider } from "@material-ui/core";

type IouTaskProps = {
  details: string;
};

type IouTaskState = {
  anchorEl: HTMLElement | null;
};

class IouTask extends React.Component<IouTaskProps, IouTaskState> {
  state: IouTaskState = {
    anchorEl: null,
  };

  render() {
    return (
      // 55 is the limit of characters before there's too many lines
      <div
        className={this.props.details.length > 55 ? "cursorPointer" : ""}
        id="task"
      >
        {this.props.details.length > 55 ? (
          <div
            id="taskDetailShort"
            onClick={(event: React.MouseEvent<HTMLElement>) => {
              this.setState({
                anchorEl: event.currentTarget,
              });
            }}
          >
            {/* For presentation, get rid of excessive characters and add ellipsis */}
            {this.props.details
              .substring(
                0,
                this.props.details.length - (this.props.details.length - 55) - 3
              )
              .concat("...")}
          </div>
        ) : (
          <Typography>{this.props.details}</Typography>
        )}
        <Popover
          id="popUpMargin"
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
          <Typography id="taskDetailPopUp">
            {"Task Description"}
            <Divider id="taskPopUpDivider" />
            {this.props.details}
          </Typography>
        </Popover>
      </div>
    );
  }
}

export default IouTask;
