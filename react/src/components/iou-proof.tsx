import React from "react";
import "../assets/css/iou-request.css";
import { imageEndpoint } from "../api/endpoints";
import ClearIcon from "@material-ui/icons/Clear";
import ImageIcon from "@material-ui/icons/Image";
import { Popover, Typography, Divider } from "@material-ui/core";

type IouProofProps = {
  imagePK: string | null;
  proof_of_debt: boolean;
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
                {this.props.proof_of_debt
                  ? "Proof of Debt"
                  : "Proof of Completion"}
                <Divider id="taskPopUpDivider" />
                <img
                  src={`${imageEndpoint}/${this.props.imagePK}`}
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
