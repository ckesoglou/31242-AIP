import React from "react";
import { shallow } from "enzyme";
import { AvatarWithMenu } from "./avatarWithMenu";
import { UserContext } from "./user-context";

// Integration tests are on home.test.tsx
describe("<AvatarWithMenu />", () => {
  it("should render correctly", () => {
    const wrapper = shallow(
      <UserContext.Provider
        value={{
          user: { name: "Kevin Leung" },
          updateUser: () => {},
        }}
      >
        <AvatarWithMenu />
      </UserContext.Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
