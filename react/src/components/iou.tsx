import React from 'react';
import IouComplete from "./iou-complete";
import IouProof from "./iou-proof";
import IouFavour from "./iou-single-favour"
import RequestInfo from "./request-info";

type Item = {
    id: string;
    display_name: string;
}

//???????????????????
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

            </div>
        );
    }
}

export default IOU;