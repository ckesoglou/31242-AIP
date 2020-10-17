import React from "react";
import { shallow } from "enzyme";
import { AvatarWithMenu } from "./avatarWithMenu";

// Integration tests are on home.test.tsx
describe("<AvatarWithMenu />", () => {
  it("should render correctly", () => {
    const wrapper = shallow(
      <AvatarWithMenu loggedIn={true} fullName={"Ben Johnston"} />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
