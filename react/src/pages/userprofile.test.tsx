import React from "react";
import { shallow, mount } from "enzyme";

import UserProfile from "./userprofile";
import { MemoryRouter, Route } from "react-router-dom";

const testProps = {
  history: {} as any,
  location: {} as any,
  match: {} as any,
};

describe("UserProfile", () => {
  it("should render correctly", () => {
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
    const spy = jest.spyOn(UserProfile.prototype, "handleSignUp");
    // this needs to be fixed
    const wrapper = mount(
      <UserProfile
        history={testProps.history}
        location={testProps.location}
        match={testProps.match}
      />
    );

    wrapper.find("button").simulate("click");

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("should refresh tab contents if button is clicked", () => {
    const spy = jest.spyOn(UserProfile.prototype, "fetchAllTabs");
    const wrapper = mount(
      <UserProfile
        history={testProps.history}
        location={testProps.location}
        match={testProps.match}
      />
    );

    wrapper.find("button").simulate("click");

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
