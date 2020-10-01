import React from "react";
import ReactDOM from 'react-dom';

type IouProofProps = {
  imagePK: string;
}

class IouProof extends React.Component<IouProofProps> {

  constructor(props: IouProofProps) {
    super(props);
}

    render() {
        return (
            <img src="" id="something"/>
          );
    }
}

export default IouProof;