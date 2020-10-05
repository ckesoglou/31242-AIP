import React from "react";
import ReactDOM from 'react-dom';
import "../assets/css/iou-request.css";
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { imageEndpoint} from "../api/endpoints";

type itemInterface = {
  id: string;
  display_name: string;
}

type IouFavourSingleProps = {
  giverUsername: string;
  recieverUsername: string;
  items: itemInterface[];
}

type IouFavourSingleState = {
  multipleItemView: boolean;
}


class IouFavourSingle extends React.Component<IouFavourSingleProps, IouFavourSingleState> {
  private itemView: any;

  constructor(props: IouFavourSingleProps) {
    super(props);
    this.itemView = null;
    this.displayMultipleItems = this.displayMultipleItems.bind(this);
  }

  state: IouFavourSingleState = {
    multipleItemView: false
  }


  // fetchImage(){              //For when user and reward images are supported
  //   fetch(`${imageEndpoint + this.props.imagePK}`, {
  //     method: "GET",
  //     headers: {
  //       'Accept':'image/*'
  //     },  
  //   })
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((body) => {
  //       this.setState({
  //         resImage: body
  //       });
  //     });
  // }

  // convertbase64Image(): string{
  //   return 'data:image/jpeg;base64,' + this.state.resImage;
  // }

  renderItem(item: itemInterface) {
    return(
      <div className="circle multipleItemCircle">
        {item.display_name}
      </div> 
    );
  } 

  renderItems() {
    return(
      <div id="itemsContainer">
        <div id="itemsContainerArrow">
        </div>
        {this.props.items.map((item) => this.renderItem(item)) }
      </div>
    );
  }

  displayMultipleItems() {
    if (this.state.multipleItemView){
      this.setState({ multipleItemView: false });
      this.itemView = null;
    } else {
      this.setState({ multipleItemView: true })
      this.itemView = this.renderItems();
    }
  }

  renderSingleItem() {
    if (this.props.items.length <= 0) {
      return(
        <div id="itemsContainer">
          No reward
        </div>
      );
    } else if (this.props.items.length > 1) {
      return(
        <div id="multipleItemsContainer" onClick={this.displayMultipleItems}>
          <div className="circle" id="firstCircle">
          </div>
          <div className="circle" id="secondCircle">
            {this.props.items[0].display_name}
          </div>
          <div id="multpileItemView">
            {(this.state.multipleItemView) ? this.itemView : ''}
          </div> 
        </div>
      );
    } else {
      return(
        this.renderItem(this.props.items[0])
      );
    }
  }

  render() {
      return (
          <div>
            {/* <div id="favourImageContainer">
              <img src={this.convertbase64Image()} id="favourUserImage"/>
            </div> */}
            <div className="circle">
              {this.props.giverUsername}
            </div> 
            <KeyboardArrowRightIcon
              color="primary"
              id="favourArrow"
            />
            {/* <div id="rewardImageContainer">
              <img src={this.convertbase64Image()} id="favourRewardImage"/>
            </div> */}
            {this.renderSingleItem()}
            <KeyboardArrowRightIcon
              color="primary"
              id="favourArrow"
            />
            {/* <div id="favourImageContainer">
              <img src={this.convertbase64Image()} id="favourUserImage"/>
            </div> */}
            <div className="circle">
              {this.props.recieverUsername}
            </div> 
          </div>
        );
  }
}

export default IouFavourSingle;