import React from 'react';
import IouComplete from "./iou-complete";
import IouProof from "./iou-proof";
import IouFavour from "./iou-single-favour"
import RequestInfo from "./request-info";
import {
    Grid,
  } from "@material-ui/core";

type Item = {
    id: string;
    display_name: string;
}

type RequestObj = {
    id: string;
    author: {username:string, display_name: string};
    completed_by: {username:string, display_name: string}
    proof_of_completion: string;
    rewards: Item[];
    details: string;
    created_time: string;
    comletion_time: string;
    is_completed: boolean;
}

type RequestProps = {
    request: RequestObj;
}

class IOU extends React.Component<RequestProps> {
    constructor(props: RequestProps) {
        super(props);
    }

    render() {
        return(
            <div>
                <Grid container xs={12} spacing={2}>
                    <Grid item xs={4} id="requestItemContainer">
                        <IouFavour giverDisplayName={this.props.request.author.display_name} recieverDisplayName={"?"} item={this.props.request.rewards[0]}/>
                    </Grid>
                    <Grid item xs={3} id="requestItemContainer">
                        <div id="task">
                            <p>{this.props.request.details}</p>
                        </div>
                    </Grid>
                    <Grid item xs={1} id="requestItemContainer">
                        <IouProof imagePK={this.props.request.proof_of_completion}/>
                    </Grid>
                    <Grid item xs={3} id="requestProofContainer">
                        <IouComplete request={this.props.request}/>
                    </Grid>
                    <Grid item xs={1} id="requestItemContainer">
                        <RequestInfo request={this.props.request}/>
                    </Grid>
                </Grid>    
            </div>
        );
    }
}

export default IOU;