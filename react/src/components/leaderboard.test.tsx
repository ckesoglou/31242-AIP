import React from "react";
import { shallow } from "enzyme";
import Leaderboard from "./leaderboard";

// Integration tests are on home.test.tsx
describe("<Leaderboard />", () => {
  it("should render correctly", () => {
    const wrapper = shallow(<Leaderboard />);

    expect(wrapper).toMatchSnapshot();
  });
});
