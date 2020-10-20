import React from "react";
import IouComplete from "./iou-complete";
import IouProof from "./iou-proof";
import RequestRewards from "./request-rewards";
import RequestInfo from "./request-info";
import IouTask from "./iou-task";
import { Grid } from "@material-ui/core";

type Item = {
  id: string;
  display_name: string;
};

type RequestObj = {
  id: string;
  author: { username: string; display_name: string };
  completed_by: { username: string; display_name: string };
  proof_of_completion: string;
  rewards: Item[];
  details: string;
  created_time: string;
  completion_time: string;
  is_completed: boolean;
};

type RequestProps = {
  request: RequestObj;
};

class Request extends React.Component<RequestProps> {
  render() {
    return (
      <div>
        <Grid container xs={12} spacing={4}>
          <Grid item xs={4} id="requestItemContainer">
            <RequestRewards
              requestID={this.props.request.id}
              items={this.props.request.rewards}
              rewards={[
                { id: "1", display_name: "Hug" },
                { id: "2", display_name: "Coffee" },
                { id: "3", display_name: "Food" },
              ]}
            />
          </Grid>
          <Grid item xs={3} id="requestItemContainer">
            <IouTask details={this.props.request.details} />
          </Grid>
          <Grid item xs={1} id="requestItemContainer">
            <IouProof imagePK={this.props.request.proof_of_completion} />
          </Grid>
          <Grid item xs={3} id="requestProofContainer">
            <IouComplete
              id={this.props.request.id}
              is_completed={this.props.request.is_completed}
              completed_by={this.props.request.completed_by?.display_name ?? ""} // TODO: check who completed by
              claimed_time={this.props.request.completion_time}
              created_time={this.props.request.created_time}
              author={this.props.request.author.display_name ?? ""}
              rewards={this.props.request.rewards}
              details={this.props.request.details}
            />
          </Grid>
          <Grid item xs={1} id="requestItemContainer">
            <RequestInfo request={this.props.request} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Request;
