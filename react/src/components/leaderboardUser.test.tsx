import React from "react";
import { shallow } from "enzyme";
import LeaderboardUser from "./leaderboardUser";

// Integration tests are on home.test.tsx
describe("<leaderboardUser />", () => {
  it("should render correctly", () => {
    const wrapper = shallow(<LeaderboardUser />);

    expect(wrapper).toMatchSnapshot();
  });
});
