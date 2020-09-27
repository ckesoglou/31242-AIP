import React from "react";
import { shallow, mount } from "enzyme";
import UserProfile from "./userprofile";

const testProps = {
  history: {} as any,
  location: {} as any,
  match: {} as any,
};

describe("UserProfile", () => {
  it("should render correctly", () => {
    // need to provide context
    const component = shallow(
      <UserProfile
        history={testProps.history}
        location={testProps.location}
        match={testProps.match}
      />
    );

    expect(component).toMatchSnapshot();
  });

  it("should handle new request if button is clicked", () => {
    const spy = jest.spyOn(UserProfile.prototype, "fetchNewRequest");
    const wrapper = mount(
      <UserProfile
        history={testProps.history}
        location={testProps.location}
        match={testProps.match}
      />
    );

    wrapper
      .find("input#favourText")
      .simulate("change", { target: { value: "Ben!" } });
    wrapper
      .find("input#rewardText")
      .simulate("change", { target: { value: "Johnston!" } });
    wrapper.find("button#createRequest").simulate("click");

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("should have loading circle on tab contents if button is clicked", () => {
    const spy = jest.spyOn(UserProfile.prototype, "fetchAllTabs");
    const wrapper = mount(
      <UserProfile
        history={testProps.history}
        location={testProps.location}
        match={testProps.match}
      />
    );

    wrapper.find("button#createRequest").simulate("click");
    let loadingCircle = wrapper.find("loading").length;

    expect(spy).toHaveBeenCalledTimes(1);
    expect(loadingCircle).toBe(1);
  });
});
