import React from "react";
import { shallow, mount } from "enzyme";
import { MemoryRouter, Route } from "react-router-dom";
import Home from "./home";
import UserProfile from "./userprofile";
import { UserContext } from "../components/user-context";
import { AvatarWithMenu } from "../components/avatarWithMenu";

// const testProps = {
//   history: {} as any,
//   location: {} as any,
//   match: {} as any,
// };

describe("<Home />", () => {
  it("should render correctly", () => {
    const wrapper = shallow(
      <UserContext.Provider
        value={{
          user: { name: "Kevin Leung" },
          updateUser: () => {},
        }}
      >
        <Home />
      </UserContext.Provider>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it("navigates to user page from user menu", () => {
    const wrapper = mount(
      <UserContext.Provider
        value={{
          user: { name: "Kevin Leung" },
          updateUser: () => {},
        }}
      >
        <MemoryRouter initialEntries={["/home"]}>
          <Route path="/home" component={Home} />
          <Route path="/user" component={UserProfile} />
        </MemoryRouter>
      </UserContext.Provider>
    );
    let homeComponent = wrapper.find("Home");
    homeComponent.find("div#avatar").simulate("click");
    // kudos to https://github.com/enzymejs/enzyme/issues/516
    homeComponent.find("a#favoursLink").simulate("click", { button: 0 });

    // @ts-ignore
    expect(wrapper.find("Router").prop("history").location.pathname).toEqual(
      "/user"
    );
    // @ts-ignore
    expect(wrapper.find("UserProfile").prop("location").state.tabIndex).toEqual(
      1
    );
  });

  it("should have initials of logged in user for avatar", () => {
    const wrapper = mount(
      <UserContext.Provider
        value={{
          user: { name: "Kevin Leung" },
          updateUser: () => {},
        }}
      >
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </UserContext.Provider>
    );

    let avatar = wrapper.find(Home).find("div#avatar");

    expect(avatar.text()).toBe("KL");
  });
});
