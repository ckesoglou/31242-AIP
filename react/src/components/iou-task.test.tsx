import React from "react";
import { shallow, mount } from "enzyme";
import IouTask from "./iou-task";

// simple, static component
describe("<IouTask />", () => {
  it("should render correctly", () => {
    const wrapper = shallow(<IouTask details="Finish my homework for me" />);

    expect(wrapper).toMatchSnapshot();
  });

  it("should shorten task detail when it is too long", () => {
    const wrapper = mount(
      <IouTask details="Clean the fridge asdf sadf asdf asdf sdaf dsaf sadf sadf SOmething extra that shouldn't be seen" />
    );

    let value = wrapper.find("#taskDetailShort").text();
    expect(value).toContain("...");
  });
});
