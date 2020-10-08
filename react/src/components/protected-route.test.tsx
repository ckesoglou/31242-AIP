import React from "react";
import { mount } from "enzyme";
import { ProtectedRoute, Authentication } from "./protected-route";
import { MemoryRouter, Route } from "react-router-dom";
import Login from "../pages/login";

function protectedComponent() {
  return <h1>This component should be protected</h1>;
}

describe("<ProtectedRoute />", () => {
  it("renders the component when the user is authenticated", () => {
    Authentication.authenticate(() => {});
    expect(Authentication.isAuthenticated).toBe(true);
    const wrapper = mount(
      <MemoryRouter initialEntries={["/protectedRoute"]}>
        <ProtectedRoute path="/protectedRoute" component={protectedComponent} />
      </MemoryRouter>
    );

    expect(wrapper.find("ProtectedRoute").length).toEqual(1);
  });

  it("renders a redirect when the user is not authenticated", () => {
    Authentication.signout(() => {});
    expect(Authentication.isAuthenticated).toBe(false);
    const wrapper = mount(
      <MemoryRouter initialEntries={["/protectedRoute"]}>
        <ProtectedRoute path="/protectedRoute" component={protectedComponent} />
        <Route path="/login" component={Login} />
      </MemoryRouter>
    );

    expect(wrapper.find("protectedComponent").length).toEqual(0);
    // @ts-ignore
    expect(wrapper.find("Router").prop("history").location.pathname).toEqual(
      "/login"
    );
  });
});
