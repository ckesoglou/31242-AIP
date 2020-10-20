import React from "react";
import { mount } from "enzyme";
import Leaderboard from "./leaderboard";

// Integration tests are on home.test.tsx
describe("<Leaderboard />", () => {
  it("should render correctly", () => {
    const wrapper = mount(<Leaderboard />);

    expect(wrapper).toMatchSnapshot();
  });
});
