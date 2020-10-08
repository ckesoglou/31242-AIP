import React from "react";
import ReactDOM from 'react-dom';
import "../assets/css/iou-request.css";
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { imageEndpoint} from "../api/endpoints";
import {
  Avatar,
  Popover,
  Typography, 
} from "@material-ui/core";

type itemInterface = {
  id: string;
  display_name: string;
}

type IouFavourSingleProps = {
  giverDisplayName: string;
  recieverDisplayName: string;
  item: itemInterface;
}

type IouFavourSingleState = {
  giverAnchorEl: HTMLElement | null;
  recieverAnchorEl: HTMLElement | null;
}


class IouFavourSingle extends React.Component<IouFavourSingleProps, IouFavourSingleState> {
  private itemView: any;

  constructor(props: IouFavourSingleProps) {
    super(props);
    this.itemView = null;
  }

  state: IouFavourSingleState = {
    giverAnchorEl: null,
    recieverAnchorEl: null,
  }

  nameToUpperInitials(fullName: string): string {
    const namesArray = fullName.split(" ");
    let tempInitials = namesArray.map((word) => {return word.charAt(0).toUpperCase();})
    return tempInitials.join("");
  }

  render() {
      return (
          <div>
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
                  id="favourAvatarPopover"
                  open={Boolean(this.state.giverAnchorEl)}
                  anchorEl={this.state.giverAnchorEl}
                  onClose={() => this.setState({giverAnchorEl: null})}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                <Typography id="favourAvatarText">
                  {this.props.giverDisplayName}
                </Typography>
              </Popover>
            </div>
            <KeyboardArrowRightIcon
              color="primary"
              id="favourArrow"
            />
            <div id="rewardContainer">
              <Avatar id="rewardAvatar">
                  {this.props.item.display_name}
              </Avatar>
            </div>
            <KeyboardArrowRightIcon
              color="primary"
              id="favourArrow"
            />
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
                  id="favourAvatarPopover"
                  open={Boolean(this.state.recieverAnchorEl)}
                  anchorEl={this.state.recieverAnchorEl}
                  onClose={() => this.setState({recieverAnchorEl: null})}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                <Typography id="favourAvatarText">
                  {this.props.recieverDisplayName}
                </Typography>
              </Popover>
            </div>
          </div>
        );
  }
}

export default IouFavourSingle;