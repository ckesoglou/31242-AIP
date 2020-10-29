import React from "react";
import { shallow } from "enzyme";
import LeaderboardUser from "./leaderboardUser";

// simple, static component
describe("<LeaderboardUser />", () => {
  it("should render correctly", () => {
    const wrapper = shallow(
      <LeaderboardUser rank={1} username={"Kevin"} score={69} />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
