import React from "react";
import "../assets/css/iou-request.css";
import { imageEndpoint } from "../api/endpoints";
import ClearIcon from "@material-ui/icons/Clear";
import ImageIcon from "@material-ui/icons/Image";
import { Popover, Typography, Divider } from "@material-ui/core";

type IouProofProps = {
  imagePK: string;
};

type IouProofState = {
  resImage: string;
  anchorEl: HTMLElement | null;
};

class IouProof extends React.Component<IouProofProps, IouProofState> {
  state: IouProofState = {
    resImage: "",
    anchorEl: null,
  };

  fetchImage() {
    fetch(`${imageEndpoint + this.props.imagePK}`, {
      method: "GET",
    })
      .then((res) => {
        if (res.status === 200) {
          // Successful login 200
          res.json().then((body) => this.setState({ resImage: body }));
        } else {
          // Unsuccessful login (404)
          this.setState({ resImage: "" });
        }
      })
      .catch(console.log);
  }

  render() {
    return (
      <div id="requestItem">
        {this.props.imagePK ? (
          <div>
            <div
              className="cursorPointer"
              onClick={(event: React.MouseEvent<HTMLElement>) => {
                this.setState({ anchorEl: event.currentTarget });
              }}
            >
              <ImageIcon color="primary" id="proofIcon" />
            </div>
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
                {"Proof"}
                <Divider id="taskPopUpDivider" />
                <img
                  src={"data:image/jpeg;base64," + this.state.resImage}
                  id="proofImage"
                  alt="Proof of Completion"
                />
              </Typography>
            </Popover>
          </div>
        ) : (
          <ClearIcon id="noProofIcon" />
        )}
      </div>
    );
  }
}

export default IouProof;
