import React from "react";
import { shallow, mount } from "enzyme";
import { MemoryRouter, Route } from "react-router-dom";
import Login from "./login";

const testProps = {
  history: {} as any,
  location: {} as any,
  match: {} as any,
};

describe("<Login />", () => {
  it("should render correctly", () => {
    const wrapper = shallow(
      <Login
        history={testProps.history}
        location={testProps.location}
        match={testProps.match}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it("navigates to next page for successful login", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={["/login"]}>
        <Route path="/login" component={Login} />
        <Route path="/home">
          <h1>Hello</h1>
        </Route>
      </MemoryRouter>
    );

    let loginComponent = wrapper.find("Login");
    loginComponent.setState({
      username: "",
      password: "",
      error: "",
      successfulLogin: true,
    });

    // @ts-ignore
    expect(wrapper.find("Router").prop("history").location.pathname).toEqual(
      "/home"
    );
  });

  it("should handle login if button is clicked", () => {
    const spy = jest.spyOn(Login.prototype, "handleLogin");
    const wrapper = mount(
      <Login
        history={testProps.history}
        location={testProps.location}
        match={testProps.match}
      />
    );

    wrapper.find("button").simulate("click");

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
