import React from "react";
import { shallow, mount } from "enzyme";
import { MemoryRouter, Route } from "react-router-dom";
import Login from "./login";
import { UserContext } from "../components/user-context";

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
      <UserContext.Provider
        value={{
          user: { name: "Kevin Leung" },
          updateUser: () => {},
        }}
      >
        <MemoryRouter initialEntries={["/login"]}>
          <Route path="/login" component={Login} />
          <Route path="/home">
            <h1>Hello</h1>
          </Route>
        </MemoryRouter>
      </UserContext.Provider>
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
      <UserContext.Provider
        value={{
          user: { name: "Kevin Leung" },
          updateUser: () => {},
        }}
      >
        <MemoryRouter>
          <Login
            history={testProps.history}
            location={testProps.location}
            match={testProps.match}
          />
        </MemoryRouter>
      </UserContext.Provider>
    );

    wrapper
      .find("input#password")
      .simulate("change", { target: { value: "This is a valid password!" } });
    wrapper
      .find("input#username")
      .simulate("change", { target: { value: "This is a valid username!" } });

    wrapper.find("button").simulate("click");

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
