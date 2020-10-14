import React from "react";
import "../assets/css/iou-request.css";
import { imageEndpoint} from "../api/endpoints";
import ClearIcon from '@material-ui/icons/Clear';
import ImageIcon from '@material-ui/icons/Image';
import {
  Popover,
  Typography,
  Divider
} from "@material-ui/core";

type IouProofProps = {
  imagePK: string;
}

type IouProofState = {
  resImage: string;
  AnchorEl: HTMLElement | null;
}

class IouProof extends React.Component<IouProofProps, IouProofState> {
    state: IouProofState = {
      resImage: "iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABGdBTUEAAK/INwWK6QAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAUXSURBVGhD3Zk/iBRXHMffmCJrp0UOTkJgDSTZMlcImiKgsVHBsNeEbBHwjljcFkIEE9KkyR8hgRR7heJZCBfSuCQQ0wQNqY6kuCsnEXTBwgNTaOdaBPM+b++399vZNzM7b2ZX9AfDnjPvz+/z+/7ee78Zo6fWTEV2+fa/QSN9/MYrQf10pz2lR1ADVOFQqD+VgoQ4URX8MwcJgff1qRQkdI1UARPlLXbtXF4ahILkjZsEXVuMhreWrg/2qujSPw+epg2U5pivfSiEeJQ1pn4GRKvTHIKst7sGGAdShbTTHkNgequRmW/ugjAvMJWukWnCoLgPQuZ8bkCygkSqPTcgx3+bG0upUif72TfnzPfvvzvNLAoaO1gRYGYFlKcG5MEgErZZweTJVBqECV76bC5vnuDnk6hRiSKbnX6wk1V2LKyIPUBNHMfOh0bjbffbWqlPRZVJ1SilCBDrKxtVBnVkLNbeydWGWTgWu8vEW6lz7T3QDStR2IIf36yPDXzt1T9LgbHWvosbI2rLgLEF+aQRO/UHDQbZAARZElxr/fXBa6bz7fyI4yEgeqPghG61a95gAKLX495jPdcOCKxSkPXVnjl6dNePW7dGffrv68GkmADoSlaeJWF8EAIgfYJBGECrsh33TH1pfSya/YfXh/eoUofOqlI82UlAAGBj0WncPr9tDv14b2yeUiASWYlqbf+iNy00jGvAwt3JcV8H8l7siq3Yh+ti56YPphQI6UEqyfvBxCAe77XzybRhc8GSyqxt9cuvkaQa/NsHMqaGgtjuds2XazWjHfJKunPTt1uy6EvtWqiB5AzkIpWRKlnOkWbJHcjXPguC9oVPdj0JDvChUhzxOoyjNudd6vgONRsAAsFawFl9yXh5EKVBGGBxsZUZ8NbqYQeLLaScETxD3bsd44C4+FugeM6uiBE0SSc9cbAiG72aeXy/abfHLTdxWgnR7f5goigyzeaHmcA8nG/UhzsUZ5AoxfgH2wMYgdWQ9A3ataiDNm8OSglt7ZO/ms+X+qOvpGoNeNeSJ91wGBC3I1o4OWiBcUFTtmwzlsUerIgvvJ0bJ8bfq1kDVjkuNoSH5x+5K8twHtOVQbJK4LlA8HcwiHNmJ5oogfGrT2+5J05rgM13bOWcUdHqUkcORBTFeZ8FgZz76Q/T24jN5rJ9qbLOHK73HQRFJJMCw8U5gUrObDv6yJUpiX0oqqS102rQJmiN0JE668yj/Wbhir9a9TngwJUV6cu6EThKlOQhuufi32fyguN9TuG2XNtXqK92vAgEk2iFfJVAdPDnU8NvvxfeulrIMRrLV5RZvrtPfI4UVYk3N7ZI5JeDq3BESnYYUSQ5FgoBlaWU1FzSFyAx2XnyFq7O/0l4tCLiXyaID4x70tkdjBV8DioCIhDJrCm0/dJZD0BKVWG+wy5rXF/qFwLRg6OGezP0lO86vaRPFWuHbdduTl7GYJCR0YBRQHzSodLVQC7q0i7RngI0zwgE226aBYMcqe0uaj04AE++ed1dABFFLq+zfOSzmwMOkvu08xkQFIxpatCn0GKXSV7+9I6rfilBZEfCIRwHQBttb6zE7quh+8CW+HpCafP7F+8Nu9w9/Yu3ws2CoHOQIjjLZ0zSBQW4vvro1BgEE9AWCMypQqEol73nSxcpEvlNKxKTygUpkpfPac+JNuW8U9L+zyyvv75I004sTwlpN1MQJg1xcpLAzRxkEqdC2gStkZCJpt3nhQH5H9ulgVHYe0gsAAAAAElFTkSuQmCC",
      AnchorEl: null,
    }

    fetchImage(){
      fetch(`${imageEndpoint + this.props.imagePK}`, {
        method: "GET",
      })
        .then((res) => {
          return res.json();
        })
        .then((body) => {
          this.setState({
            resImage: body
          });
        });
    }

    renderImage(){
      if (this.props.imagePK){
        //this.fetchImage();
        return (
          <div>
            <div onClick={(event: React.MouseEvent<HTMLElement>) => {this.setState({AnchorEl: event.currentTarget})}}>
            <ImageIcon color="primary"/>
            </div>
            <Popover
                  id="popUpMargin"
                  open={Boolean(this.state.AnchorEl)}
                  anchorEl={this.state.AnchorEl}
                  onClose={() => this.setState({AnchorEl: null})}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                <Typography id="taskDetailPopUp">
                  {"Proof"}
                  <Divider id="taskPopUpDivider"/>
                  <img src={'data:image/jpeg;base64,' + this.state.resImage} id="proofImage" alt="Proof of Completion"/>
                </Typography>
              </Popover>
          </div>
        );
      } else {
        return(
          <ClearIcon id="noProofIcon"/>
        );
      }
    }

    render() {
        return (
            <div id="requestItem">
              {this.renderImage()}
            </div>
          );
    }
}

export default IouProof;