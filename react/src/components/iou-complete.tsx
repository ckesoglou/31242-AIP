import React from "react";
import ReactDOM from 'react-dom';
import {
    Checkbox,
  } from "@material-ui/core";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import "../assets/css/iou-request.css";
import {
    Container,
} from "@material-ui/core";

type IouCompeteProps = {
    IOUCompleter: string;
    IOUtimestamp: string;
    taskCompleted: boolean;
}

class IouComplete extends React.Component<IouCompeteProps> {
    constructor(props: IouCompeteProps) {
        super(props);
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

    render() {
        return(
            // <Container>
                <div>
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
            // </Container>
        );
    }
}

export default IouComplete;