import React from "react";
import ReactDOM from 'react-dom';
import "../assets/css/iou-request.css";

type IouTaskProps = {
    taskDescription: string;
}

class IouTask extends React.Component<IouTaskProps> {
    constructor(props: IouTaskProps) {
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