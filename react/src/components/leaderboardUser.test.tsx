import React from "react";
import { shallow } from "enzyme";
import LeaderboardUser from "./leaderboardUser";

// Integration tests are on home.test.tsx
describe("<LeaderboardUser />", () => {
  it("should render correctly", () => {
    const wrapper = shallow(
      <LeaderboardUser rank={1} username={"Kevin"} score={69} />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
