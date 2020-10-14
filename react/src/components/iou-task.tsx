import React from "react";
import "../assets/css/iou-request.css";
import {
    Popover,
    Typography,
    Divider
  } from "@material-ui/core";

type IouTaskProps = {
    details: string;
}

type IouTaskState = {
    AnchorEl: HTMLElement | null;
  }

class IouTask extends React.Component<IouTaskProps, IouTaskState> {
    constructor(props: IouTaskProps) {
        super(props);
    }

    state:IouTaskState = {
        AnchorEl: null,
    }

    checkDetailLength() {
        if (this.props.details.length > 55) {
            return(
                <Typography onClick={(event: React.MouseEvent<HTMLElement>) => {
                    this.setState({
                        AnchorEl: event.currentTarget,
                    }); 
                  }}>
                    {this.props.details.substring(0, this.props.details.length - (this.props.details.length - 55)- 3).concat("...")}
                </Typography>
            );
        }
        return(
            <Typography>
                {this.props.details}
            </Typography>
            );
    }

    render() {
        return(
            <div id={this.props.details.length > 55 ? "clickableTask" : "task"}>
                {this.checkDetailLength()}
                <Popover
                  id="popUpMargin"
                  open={Boolean(this.state.AnchorEl)}
                  anchorEl={this.state.AnchorEl}
                  onClose={() => this.setState({AnchorEl: null})}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >

                <Typography id="taskDetailPopUp">
                  {"Task Description"}
                  <Divider id="taskPopUpDivider"/>
                  {this.props.details}
                </Typography>
              </Popover>
            </div>
        );
    }
}

export default IouTask; 