import React from "react";
import IouComplete from "./iou-complete";
import IouProof from "./iou-proof";
import IouFavour from "./iou-single-favour";
import { Grid } from "@material-ui/core";
import { UserContext } from "../components/user-context";

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
  iouType: number;
};

// Mainly a container component
class IOU extends React.Component<IouProps> {
  static contextType = UserContext;

  getCompletor(): string {
    if (this.props.iou.proof_of_completion !== null) {
      return this.props.iou.giver.username;
    } else {
      return this.props.iou.receiver?.username ?? "";
    }
  }

  getAuthor(): string {
    if (
      this.props.iou.proof_of_debt !== null &&
      this.props.iou.parent_request === null
    ) {
      return this.props.iou.receiver?.username ?? "";
    } else {
      return this.props.iou.giver.username;
    }
  }

  render() {
    return (
      <Grid container xs={12} spacing={1}>
        <Grid item xs={7} id="requestItemContainer">
          <IouFavour
            giverDisplayName={this.props.iou.giver.username}
            recieverDisplayName={this.props.iou.receiver?.username ?? "?"}
            item={this.props.iou.item}
          />
        </Grid>
        <Grid item xs={2} id="requestItemContainer">
          <IouProof
            imagePK={this.props.iou.proof_of_debt}
            proof_of_debt={true}
          />
          <IouProof
            imagePK={this.props.iou.proof_of_completion}
            proof_of_debt={false}
          />
        </Grid>
        <Grid item xs={3} id="requestProofContainer">
          <IouComplete
            id={this.props.iou.id}
            is_completed={this.props.iou.is_claimed}
            completed_by={this.getCompletor()}
            claimed_time={this.props.iou.claimed_time}
            created_time={this.props.iou.created_time}
            author={this.getAuthor()}
            rewards={[
              {
                id: "",
                giver: {
                  username: this.props.iou.giver.username,
                  display_name: this.props.iou.giver.username,
                },
                item: {
                  id: this.props.iou.item.id,
                  display_name: this.props.iou.item.display_name,
                },
              },
            ]}
            details=""
            iouType={this.props.iouType}
          />
        </Grid>
      </Grid>
    );
  }
}

export default IOU;
