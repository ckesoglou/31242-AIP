import React from "react";
import IouComplete from "./iou-complete";
import IouProof from "./iou-proof";
import IouFavour from "./iou-single-favour";
import RequestInfo from "./request-info";
import { Grid } from "@material-ui/core";

type Item = {
  id: string;
  display_name: string;
};

type IouObj = {
  id: string;
  item: Item;
  giver: { username: string; display_name: string };
  receiver: { username: string; display_name: string };
  parent_request: string | null;
  proof_of_debt: string | null;
  proof_of_completion: string | null;
  created_time: string;
  claimed_time: string | null;
  is_claimed: boolean;
};

type IouProps = {
  iou: IouObj;
};

class IOU extends React.Component<IouProps> {
  render() {
    return (
      <div>
        <Grid container xs={12} spacing={1}>
          <Grid item xs={7} id="requestItemContainer">
            <IouFavour
              giverDisplayName={this.props.iou.giver.display_name}
              recieverDisplayName={this.props.iou.receiver.display_name ?? "?"}
              item={this.props.iou.item}
            />
          </Grid>
          <Grid item xs={1} id="requestItemContainer">
            <IouProof imagePK={this.props.iou.proof_of_completion} />
          </Grid>
          <Grid item xs={4} id="requestProofContainer">
            <IouComplete
              id={this.props.iou.id}
              is_completed={this.props.iou.is_claimed}
              completed_by={this.props.iou.receiver?.display_name ?? ""} // TODO: check who completed by
              claimed_time={this.props.iou.claimed_time}
              created_time={this.props.iou.created_time}
              author={this.props.iou.giver.display_name ?? ""}
              rewards={[this.props.iou.item]}
              details=""
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default IOU;
