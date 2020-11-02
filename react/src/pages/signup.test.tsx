import React from "react";
import { shallow, mount } from "enzyme";
import { MemoryRouter, Route } from "react-router-dom";
import SignUp from "./signup";

const testProps = {
  history: {} as any,
  location: {} as any,
  match: {} as any,
};

describe("SignUp", () => {
  it("should render correctly", () => {
    const component = shallow(
      <SignUp
        history={testProps.history}
        location={testProps.location}
        match={testProps.match}
      />
    );
    
    expect(component).toMatchSnapshot();
  });

  it("navigates to next page for successful sign up", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={["/signup"]}>
        <Route path="/signup" component={SignUp} />
        <Route path="/home">
          <h1>Hello</h1>
        </Route>
      </MemoryRouter>
    );
    let signUpComponent = wrapper.find("SignUp");

    signUpComponent.setState({
      username: "",
      display_name: "",
      password: "",
      error: "",
      successfulSignUp: true,
    });

    // @ts-ignore
    expect(wrapper.find("Router").prop("history").location.pathname).toEqual(
      "/home"
    );
  });

  it("button should not be clickable on load", () => {
    const spy = jest.spyOn(SignUp.prototype, "handleSignUp");
    const wrapper = mount(
      <MemoryRouter>
        <SignUp
          history={testProps.history}
          location={testProps.location}
          match={testProps.match}
        />
      </MemoryRouter>
    );
    let button = wrapper.find("button");

    button.simulate("click");

    expect(spy).toHaveBeenCalledTimes(0);
    expect(button.html().includes('disabled=""')).toBe(true);
  });

  it("should handle sign up if button is clicked and information is filled", () => {
    const spy = jest.spyOn(SignUp.prototype, "handleSignUp");
    const wrapper = mount(
      <MemoryRouter>
        <SignUp
          history={testProps.history}
          location={testProps.location}
          match={testProps.match}
        />
      </MemoryRouter>
    );
    wrapper
      .find("input#password")
      .simulate("change", { target: { value: "This is a valid password!" } });
    wrapper
      .find("input#username")
      .simulate("change", { target: { value: "This is a valid username!" } });
    wrapper.find("input#display_name").simulate("change", {
      target: { value: "This is a valid display name!" },
    });

    let button = wrapper.find("button");

    button.simulate("click");
  });
});
