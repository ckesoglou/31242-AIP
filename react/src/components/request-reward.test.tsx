import React from "react";
import { shallow } from "enzyme";
import RequestReward from "./request-reward";

describe("<Request />", () => {
  it("should render correctly", () => {
    const wrapper = shallow(
      <RequestReward
        itemId="201"
        display_name="Coffee"
        setSelectedReward={() => console.log("Passed")}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
