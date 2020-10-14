import React from "react";
import { shallow } from "enzyme";
import IouTask from "./iou-task";

// simple, static component
describe("<IouTask />", () => {
  it("should render correctly", () => {
    const wrapper = shallow(
      <IouTask details="Finish my homework for me"/>
    );

    expect(wrapper).toMatchSnapshot();
  });
});
