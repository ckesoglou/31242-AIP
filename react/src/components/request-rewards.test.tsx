import React from "react";
import { shallow } from "enzyme";
import RequestRewards from "./request-rewards";

describe("<RequestRewards />", () => {
  it("should render correctly", () => {
    const wrapper = shallow(
      <RequestRewards requestID="1" items={[{id:"1", display_name:"Hug"}, {id:"2", display_name:"Coffee"}]} rewards={[{id:"1", display_name:"Hug"}, {id:"2", display_name:"Coffee"}, {id:"3", display_name:"Food"}]}/>
    );

    expect(wrapper).toMatchSnapshot();
  });
});
