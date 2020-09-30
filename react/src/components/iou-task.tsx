import React from "react";
import ReactDOM from 'react-dom';
import "../assets/css/iou-request.css";

type TaskProps = {
    taskDescription: string;
}

class IouTask extends React.Component<TaskProps> {
    constructor(props: TaskProps) {
        super(props);
    }

    render() {
        return(
            <div id="task">
                <p>{this.props.taskDescription}</p>
            </div>
        );
    }
}

export default IouTask;