import React from 'react';
import IouComplete from "./iou-complete";
import IouProof from "./iou-proof";
import RequestRewards from "./request-rewards"
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

class Request extends React.Component<RequestProps> {

    render() {
        return(
            <div>
                <Grid container xs={8}>
                    <Grid item xs={2} id="requestItemContainer">
                        <RequestRewards requestID={this.props.request.id} items={this.props.request.rewards} rewards={[{id:"1", display_name:"Hug"}, {id:"2", display_name:"Coffee"}, {id:"3", display_name:"Food"}]}/>
                    </Grid>
                    <Grid item xs={2} id="requestItemContainer">
                        <div id="task">
                            <p>{this.props.request.details}</p>
                        </div>
                    </Grid>
                    <Grid item xs={1} id="requestItemContainer">
                        <IouProof imagePK={this.props.request.proof_of_completion}/>
                    </Grid>
                    <Grid item xs={'auto'} id="requestProofContainer">
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

export default Request;