import React from "react";
import InfoIcon from "@material-ui/icons/Info";
import "../assets/css/iou-request.css";
import {
  Dialog,
  Grow,
  DialogTitle,
  Typography,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  DialogContentText,
} from "@material-ui/core";
import IouFavour from "./iou-single-favour";
import DeleteRequestReward from "../components/request-reward-delete";
import { UserContext } from "../components/user-context";

type Item = {
  id: string;
  display_name: string;
};

type RewardItem = {
  id: string; // UUID;
  giver: { username: string; display_name: string };
  item: { id: string; display_name: string };
};

type RequestObj = {
  id: string;
  author: { username: string; display_name: string };
  completed_by: { username: string; display_name: string };
  proof_of_completion: string;
  rewards: RewardItem[];
  details: string;
  created_time: string;
  completion_time: string;
  is_completed: boolean;
};

type RequestInfoProps = {
  request: RequestObj;
};

type RequestInfoState = {
  infoModal: boolean;
};

class RequestInfo extends React.Component<RequestInfoProps, RequestInfoState> {
  private tempRewardDisplayName: string;
  constructor(props: RequestInfoProps) {
    super(props);
    this.tempRewardDisplayName = "";
  }

  state: RequestInfoState = {
    infoModal: false,
  };

  static contextType = UserContext;

  renderPopUpRewards(reward: RewardItem) {
    return (
      <div id="test">
        <IouFavour
          key={reward.item.id}
          giverDisplayName={reward.giver.display_name}
          recieverDisplayName={
            this.props.request.is_completed
              ? this.props.request.completed_by.username
              : "?"
          }
          item={reward.item}
        />
        {reward.giver.username === this.context.user.name &&
        !this.props.request.is_completed ? (
          <DeleteRequestReward
            requestID={this.props.request.id}
            rewardID={reward.id}
          />
        ) : null}
      </div>
    );
  }

  render() {
    return (
      <div id="requestItem" onClick={() => this.setState({ infoModal: true })}>
        <InfoIcon
          color="primary"
          fontSize="large"
          className="cursorPointer"
          id="infoIcon"
        />
        <Dialog
          maxWidth="xs"
          fullWidth={true}
          open={this.state.infoModal}
          scroll="body"
          TransitionComponent={Grow}
          onClose={() => this.setState({ infoModal: false })}
          id="completeForm"
        >
          <DialogTitle disableTypography={true}>
            <Typography variant="h5" id="modalTitle">
              {"Request Details"}
            </Typography>
          </DialogTitle>
          <Divider />
          <DialogContent className="content" id="requestDetailsTable">
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
                      {this.props.request.author.display_name +
                        " #" +
                        this.props.request.author.username}
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
                      Completed:
                    </TableCell>
                    <TableCell align="center" id="infoTableContent">
                      {this.props.request.is_completed ? "Yes" : "No"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogContent id="requestInfoRewards">
            <DialogContentText variant="h6">{"Rewards"}</DialogContentText>
            {this.props.request.rewards.map((item) =>
              this.renderPopUpRewards(item)
            )}
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button
              size="large"
              color="primary"
              onClick={() => this.setState({ infoModal: false })}
            >
              Thank you
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default RequestInfo;
