import React from 'react';
import InfoIcon from '@material-ui/icons/Info';
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
    DialogContentText
  } from "@material-ui/core";
import IouFavour from "./iou-single-favour";
import { requestsEndpoint } from "../api/endpoints";

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
  
type RequestInfoProps = {
    request: RequestObj;
}

type RequestInfoState = {
    infoModal: boolean;
}

class RequestInfo extends React.Component<RequestInfoProps, RequestInfoState> {
    private tempRewardDisplayName: string;
    constructor(props: RequestInfoProps){
        super(props);
        this.tempRewardDisplayName = "";
    }

    state: RequestInfoState = {
        infoModal: false,
    }


    fetchRewardDetails(requestID: string, rewardID: string) {
        fetch(`${requestsEndpoint.concat(requestID).concat('/reward/').concat(rewardID)}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
        })
        .then((res) => {
            return res.json();
        })
        .then((body) => {
            console.log("Success:", body);
            this.tempRewardDisplayName = body.giver.display_name;
        })
        .catch((exception) => {
            console.error("Error:", exception);
            this.tempRewardDisplayName = "Could not find user display name";
        });
    }

    renderPopUpRewards(item: Item) {
        //this.fetchRewardDetails(this.props.request.id, item.id);
        this.tempRewardDisplayName = "James Lee"
        return(
            <IouFavour key={item.id} giverDisplayName={this.tempRewardDisplayName} recieverDisplayName={this.props.request.is_completed ? this.props.request.completed_by.username : "?"} item={item}/>
        );
    }

    render() {
        return(
            <div id="requestItem">
               <InfoIcon
                    color="primary"
                    fontSize="large"
                    id="infoIcon"
                    onClick={() => this.setState({infoModal: true})}
               />
               <Dialog
                    maxWidth="xs"
                    fullWidth={true}
                    open={this.state.infoModal}
                    TransitionComponent={Grow}
                    onClose={() => this.setState({ infoModal: false})}
                    id="completeForm"
                >
                    <DialogTitle disableTypography={true}>
                        <Typography variant="h5">
                            {"Request Details"}
                        </Typography>
                    </DialogTitle>
                    <Divider/>
                    <DialogContent className="content" id="requestDetailsTable">
                        <TableContainer id="infoTable">
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="center" className="infoTableCell" id="infoTableTitle">Created by:</TableCell>
                                        <TableCell align="center" className="infoTableCell" id="infoTableContent">{this.props.request.author.display_name}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="center" id="infoTableTitle">Task:</TableCell>
                                        <TableCell align="center" id="infoTableContent">{this.props.request.details}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="center" id="infoTableTitle">Created on:</TableCell>
                                        <TableCell align="center" id="infoTableContent">{this.props.request.created_time}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="center" id="infoTableTitle">Completed:</TableCell>
                                        <TableCell align="center" id="infoTableContent">{this.props.request.is_completed ? "Yes" : "No"}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        </DialogContent>
                        <DialogContent id="requestInfoRewards">
                        <DialogContentText variant="h6">
                            {"Rewards"}
                        </DialogContentText>
                        {this.props.request.rewards.map((item) => this.renderPopUpRewards(item))}
                        </DialogContent>
                    <Divider/>
                    <DialogActions>            
                        <Button
                        size="large"
                        color="primary"
                        onClick={() => this.setState({infoModal: false})}
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