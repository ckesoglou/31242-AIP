import React from "react";
import "../assets/css/iou-request.css";
import { Popover, Typography, Divider } from "@material-ui/core";

type IouTaskProps = {
  details: string;
};

type IouTaskState = {
  AnchorEl: HTMLElement | null;
};

class IouTask extends React.Component<IouTaskProps, IouTaskState> {
  state: IouTaskState = {
    AnchorEl: null,
  };

  checkDetailLength() {
    if (this.props.details.length > 55) {
      return (
        <div
          id="taskDetailShort"
          onClick={(event: React.MouseEvent<HTMLElement>) => {
            this.setState({
              AnchorEl: event.currentTarget,
            });
          }}
        >
          {this.props.details
            .substring(
              0,
              this.props.details.length - (this.props.details.length - 55) - 3
            )
            .concat("...")}
        </div>
      );
    }
    return <Typography>{this.props.details}</Typography>;
  }

  render() {
    return (
      <div
        className={this.props.details.length > 55 ? "cursorPointer" : ""}
        id="task"
      >
        {this.checkDetailLength()}
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
