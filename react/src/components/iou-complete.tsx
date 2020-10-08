import React from "react";
import ReactDOM from 'react-dom';
import {
    Checkbox,
    Dialog,
    Grow,
    DialogTitle,
    Typography,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Snackbar
  } from "@material-ui/core";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import "../assets/css/iou-request.css";
import {
    Container,
} from "@material-ui/core";
import { imageEndpoint, requestsEndpoint } from "../api/endpoints";

type IouCompeteProps = {
    IOUCompleter: string;
    IOUtimestamp: string;
    taskCompleted: boolean;
    requestID: string;
}

type IouCompleteState = {
    completeIOU: boolean;
    submittedProof: any;
    snackMessage: string;
    completeSnack: boolean;
}

class IouComplete extends React.Component<IouCompeteProps, IouCompleteState> {
    constructor(props: IouCompeteProps) {
        super(props);
        this.openCompleteForm = this.openCompleteForm.bind(this);
        this.onFileChange= this.onFileChange.bind(this);
    }

    state: IouCompleteState = {
        completeIOU: false,
        submittedProof: null,
        snackMessage: "",
        completeSnack: false,
    }

    fillIOUDetails() {
        if (this.props.taskCompleted){
            return(
                <div id="IouTaskComplete">  
                    <p id="taskCompleter">({this.props.IOUCompleter})</p>
                    <p id="taskTimeStamp">{this.props.IOUtimestamp}</p>
                </div>
            );
        }
        return;
    }

    openCompleteForm() {
        if (!this.props.taskCompleted) {
            this.setState({ completeIOU: true})
        }
    }

    submitProof() {
        fetch(`${imageEndpoint}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // requestID: ???,
                // proof: this.state.submittedProof 
            }),
          })
            .then((res) => {
              return res.json();
            })
            .then((body) => {
              console.log("Success:", body);
              this.setState({ snackMessage: "IOU Completion proof submitted!" });
            })
            .catch((exception) => {
              console.error("Error:", exception);
              this.setState({ snackMessage: `${exception}` });
            });
    }

    fetchIOUdetails() {
        fetch(`${requestsEndpoint}` + this.props.requestID, {
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
            })
            .catch((exception) => {
              console.error("Error:", exception);
            });
    }

    fileContent() {
        if (this.state.submittedProof) { 
            return ( 
                <div id="completeProofFileInfo">
                    <DialogContentText variant="body2">
                        {"Image Preview: "}
                    </DialogContentText>
                    <img src={URL.createObjectURL(this.state.submittedProof)} alt={"Uploaded Image: " + this.state.submittedProof.name} id="completeProofImage"/> 
                </div>
                //Need to discuss how submitted images should be formatted (Size, Encode Format)
            ); 
          } else { 
            return (
                <DialogContentText variant="body2" id="completeProofFileInfo">
                    {"Upload an image (JPEG/PNG) before pressing the 'Submit' button"}
                </DialogContentText> 
            ); 
          } 
    }

    onFileChange = (event:any) => {
        this.setState({ submittedProof: event.target.files[0]})
    }

    renderFormIOUDetails() {
        return;
        //let IOUFetchResults = this.fetchIOUdetails();
        //TODOOOOO
    }

    render() {
        return(
            <div>
                <div onClick={this.openCompleteForm} id={(this.props.taskCompleted) ? "completeIouContainer" : "incompleteIouContainer"}>
                    <Checkbox
                        checked={this.props.taskCompleted}
                        color="primary"
                        disabled={true}
                        checkedIcon={<CheckCircleOutlineIcon
                            color="primary"
                            id="completeIconSize"
                        />}
                        icon={<RadioButtonUncheckedIcon
                            color="primary"
                            id="completeIconSize"
                        />}
                    />
                    {this.fillIOUDetails()}
                </div>
                <Dialog
                    maxWidth="xs"
                    fullWidth={true}
                    scroll="paper"
                    open={this.state.completeIOU}
                    TransitionComponent={Grow}
                    onClose={() => this.setState({ completeIOU: false, submittedProof: null })}
                    id="completeForm"
                >
                    <DialogTitle disableTypography={true}>
                        <Typography variant="h5">
                            {"IOU Proof Submission"}
                        </Typography>
                    </DialogTitle>
                    <DialogContent dividers className="content">
                        <DialogContentText variant="h6">
                            {"IOU Details"}
                        </DialogContentText>
                        {this.renderFormIOUDetails()}
                    </DialogContent>
                    <DialogContent dividers className="content">
                        <DialogContentText variant="h6">
                            {"Upload proof?"}
                        </DialogContentText>
                        <input type="file" onChange={this.onFileChange} accept="image/png, image/jpeg" id="inputProof"/>
                        {this.fileContent()} 
                    </DialogContent>
                    <DialogActions>
                        <Button
                        id="createRequest"
                        size="large"
                        color="primary"
                        onClick={() => {
                            this.submitProof();
                            this.setState({
                                completeIOU: false
                            });
                        }}
                        autoFocus
                        disabled={
                            !this.state.submittedProof
                        }
                        >
                        Submit
                        </Button>
                        <Button
                        size="large"
                        color="primary"
                        onClick={() => this.setState({ completeIOU: false, submittedProof: null })}
                        >
                        Nevermind
                        </Button>
                  </DialogActions>
                </Dialog>
                <Snackbar
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  message={this.state.snackMessage}
                  open={this.state.completeSnack}
                  onClose={() => {
                    this.setState({ completeSnack: false });
                  }}
                  autoHideDuration={5000}
                />
          </div>
        );
    }
}

export default IouComplete;