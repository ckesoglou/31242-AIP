import React from "react";
import "../assets/css/iou-request.css";
import { KeyboardArrowRight as Connector } from "@material-ui/icons";
import { Avatar, Popover, Typography } from "@material-ui/core";

type Item = {
  id: string;
  display_name: string;
};

type IouFavourSingleProps = {
  giverDisplayName: string;
  recieverDisplayName: string;
  item: Item;
};

type IouFavourSingleState = {
  giverAnchorEl: HTMLElement | null;
  recieverAnchorEl: HTMLElement | null;
};

class IouFavourSingle extends React.Component<
  IouFavourSingleProps,
  IouFavourSingleState
> {
  private itemView: any;

  constructor(props: IouFavourSingleProps) {
    super(props);
    this.itemView = null;
  }

  state: IouFavourSingleState = {
    giverAnchorEl: null,
    recieverAnchorEl: null,
  };

  nameToUpperInitials(fullName: string): string {
    const namesArray = fullName.split(" ");
    let tempInitials = namesArray.map((word) => {
      return word.charAt(0).toUpperCase();
    });
    return tempInitials.join("");
  }

  render() {
    return (
      <div id="requestItem">
        <div id="favourAvatarContainer">
          <Avatar
            onClick={(event: React.MouseEvent<HTMLElement>) => {
              this.setState({
                giverAnchorEl: event.currentTarget,
              });
            }}
            id="favourAvatar"
          >
            {this.nameToUpperInitials(this.props.giverDisplayName)}
          </Avatar>
          <Popover
            id="popUpMargin"
            open={Boolean(this.state.giverAnchorEl)}
            anchorEl={this.state.giverAnchorEl}
            onClose={() => this.setState({ giverAnchorEl: null })}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Typography id="favourAvatarText">
              {this.props.giverDisplayName}
            </Typography>
          </Popover>
        </div>
        <Connector color="primary" id="favourArrow" />
        <div id="rewardContainer">
          <Avatar id="rewardAvatar">{this.props.item.display_name}</Avatar>
        </div>
        <Connector color="primary" id="favourArrow" />
        <div id="favourAvatarContainer">
          <Avatar
            onClick={(event: React.MouseEvent<HTMLElement>) => {
              this.setState({
                recieverAnchorEl: event.currentTarget,
              });
            }}
            id="favourAvatar"
          >
            {this.nameToUpperInitials(this.props.recieverDisplayName)}
          </Avatar>
          <Popover
            id="popUpMargin"
            open={Boolean(this.state.recieverAnchorEl)}
            anchorEl={this.state.recieverAnchorEl}
            onClose={() => this.setState({ recieverAnchorEl: null })}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Typography id="favourAvatarText">
              {this.props.recieverDisplayName === "?"
                ? "Favour not completed by anyone yet!"
                : this.props.recieverDisplayName}
            </Typography>
          </Popover>
        </div>
      </div>
    );
  }
}

export default IouFavourSingle;
