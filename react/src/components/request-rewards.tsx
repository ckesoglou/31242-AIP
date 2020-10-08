import React from "react";
import ReactDOM from 'react-dom';
import "../assets/css/iou-request.css";
import {
    Avatar,
    Popover,
    Typography,
} from "@material-ui/core";
import { AvatarGroup } from '@material-ui/lab';

type itemInterface = {
    id: string;
    display_name: string;
  }

type requestRewardsProps = {
    items: itemInterface[];
  }

type requestRewardState = {
    anchorEl: HTMLElement | null;
}

class RequestRewards extends React.Component<requestRewardsProps, requestRewardState> {

    state: requestRewardState = {
        anchorEl: null,
    }

    renderItem(item: itemInterface) {
        return(
          <div className="circle multipleItemCircle">
            {item.display_name}
          </div> 
        );
      } 

    renderItems() {
         if (this.props.items.length > 1) {
          return(
            <div id="multipleItemsContainer" onClick={(event: React.MouseEvent<HTMLElement>) => {
                this.setState({
                  anchorEl: event.currentTarget,
                });
              }}>
              <div className="firstCircle">
                {this.props.items[0].display_name}
              </div>
              <div className="secondCircle">
                {this.props.items[1].display_name}
              </div>
              <div className="secondCircle thirdCircle">
                +
              </div>
            </div>
          );
        } else {
          return(
            <div id="multipleItemsContainer" onClick={(event: React.MouseEvent<HTMLElement>) => {
              this.setState({
                anchorEl: event.currentTarget,
              });
            }}>
                <div className="firstCircle">
                    {this.props.items[0].display_name}
                </div>
                <div className="secondCircle">
                    +
                </div>
            </div>
          );
        }
      }

    render() {
        return(
            <div>
                {this.renderItems()}
                <Popover
                  id="favourAvatarPopover"
                  open={Boolean(this.state.anchorEl)}
                  anchorEl={this.state.anchorEl}
                  onClose={() => this.setState({anchorEl: null})}
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
                        ???????
                    </Typography>
                </Popover>
            </div>
        );
    }
 }
 
 export default RequestRewards;
 
 
 
 
 // renderItems() {
  //   return(
  //     <div id="itemsContainer">
  //       <div id="itemsContainerArrow">
  //       </div>
  //       {this.props.items.map((item) => this.renderItem(item)) }
  //     </div>
  //   );
  // }

  // displayMultipleItems() {
  //   if (this.state.multipleItemView){
  //     this.setState({ multipleItemView: false });
  //     this.itemView = null;
  //   } else {
  //     this.setState({ multipleItemView: true })
  //     this.itemView = this.renderItems();
  //   }
  // }
