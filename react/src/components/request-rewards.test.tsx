import React from "react";
import { shallow, mount } from "enzyme";
import RequestRewards from "./request-rewards";

describe("<RequestRewards />", () => {
  it("should render correctly", () => {
    const wrapper = shallow(
      <RequestRewards
        requestID="1"
        items={[
          {
            id: "1",
            giver: { username: "James", display_name: "James Lee" },
            item: { id: "202", display_name: "Hug" },
          },
          {
            id: "2",
            giver: { username: "James", display_name: "James Lee" },
            item: { id: "201", display_name: "Coffee" },
          },
        ]}
        rewards={[
          { id: "1", display_name: "Hug" },
          { id: "2", display_name: "Coffee" },
          { id: "3", display_name: "Food" },
        ]}
        is_completed={false}
        refreshTable={() => {
          return "substitute test function";
        }}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should not have a clickable pop-up if the request is complete", () => {
    const wrapper = shallow(
      <RequestRewards
        requestID="1"
        items={[
          {
            id: "1",
            giver: { username: "James", display_name: "James Lee" },
            item: { id: "202", display_name: "Hug" },
          },
          {
            id: "2",
            giver: { username: "James", display_name: "James Lee" },
            item: { id: "201", display_name: "Coffee" },
          },
        ]}
        rewards={[
          { id: "1", display_name: "Hug" },
          { id: "2", display_name: "Coffee" },
          { id: "3", display_name: "Food" },
        ]}
        is_completed={true}
        refreshTable={() => {
          return "substitute test function";
        }}
      />
    );
    expect(wrapper.find("#requestRewardPopover")).toHaveLength(0);
  });

  it("should have a clickable pop-up if the request is not complete", () => {
    const wrapper = shallow(
      <RequestRewards
        requestID="1"
        items={[
          {
            id: "1",
            giver: { username: "James", display_name: "James Lee" },
            item: { id: "202", display_name: "Hug" },
          },
          {
            id: "2",
            giver: { username: "James", display_name: "James Lee" },
            item: { id: "201", display_name: "Coffee" },
          },
        ]}
        rewards={[
          { id: "1", display_name: "Hug" },
          { id: "2", display_name: "Coffee" },
          { id: "3", display_name: "Food" },
        ]}
        is_completed={false}
        refreshTable={() => {
          return "substitute test function";
        }}
      />
    );
    expect(wrapper.find("#requestRewardPopover")).toHaveLength(1);
  });

  it("should call the add reward API endpoint if a reward is selected and the add button is clicked", () => {
    const spy = jest.spyOn(RequestRewards.prototype, "postReward");
    const wrapper = mount(
      <RequestRewards
        requestID="1"
        items={[
          {
            id: "1",
            giver: { username: "James", display_name: "James Lee" },
            item: { id: "202", display_name: "Hug" },
          },
          {
            id: "2",
            giver: { username: "James", display_name: "James Lee" },
            item: { id: "201", display_name: "Coffee" },
          },
        ]}
        rewards={[
          { id: "1", display_name: "Hug" },
          { id: "2", display_name: "Coffee" },
          { id: "3", display_name: "Food" },
        ]}
        is_completed={false}
        refreshTable={() => {
          return "substitute test function";
        }}
      />
    );

    wrapper.find("#multipleItemsContainer").simulate("click");
    wrapper.setState({ selectedReward: "1" });
    wrapper.find("#addRewardButton").at(0).simulate("click");
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("should have the add button disabled if no item is selected", () => {
    const spy = jest.spyOn(RequestRewards.prototype, "postReward");
    const wrapper = mount(
      <RequestRewards
        requestID="1"
        items={[
          {
            id: "1",
            giver: { username: "James", display_name: "James Lee" },
            item: { id: "202", display_name: "Hug" },
          },
          {
            id: "2",
            giver: { username: "James", display_name: "James Lee" },
            item: { id: "201", display_name: "Coffee" },
          },
        ]}
        rewards={[
          { id: "1", display_name: "Hug" },
          { id: "2", display_name: "Coffee" },
          { id: "3", display_name: "Food" },
        ]}
        is_completed={false}
        refreshTable={() => {
          return "substitute test function";
        }}
      />
    );

    wrapper.find("#multipleItemsContainer").simulate("click");
    expect(wrapper.find("button#addRewardButton").props().disabled).toBe(true);
  });

  it("should have one reward circle if there is only one available reward", () => {
    const spy = jest.spyOn(RequestRewards.prototype, "postReward");
    const wrapper = mount(
      <RequestRewards
        requestID="1"
        items={[
          {
            id: "1",
            giver: { username: "James", display_name: "James Lee" },
            item: { id: "202", display_name: "Hug" },
          },
        ]}
        rewards={[
          { id: "1", display_name: "Hug" },
          { id: "2", display_name: "Coffee" },
          { id: "3", display_name: "Food" },
        ]}
        is_completed={false}
        refreshTable={() => {
          return "substitute test function";
        }}
      />
    );

    expect(wrapper.find(".secondCircle")).toHaveLength(1);
  });

  it("should have two reward circles if there are multiple available reward", () => {
    const spy = jest.spyOn(RequestRewards.prototype, "postReward");
    const wrapper = mount(
      <RequestRewards
        requestID="1"
        items={[
          {
            id: "1",
            giver: { username: "James", display_name: "James Lee" },
            item: { id: "202", display_name: "Hug" },
          },
          {
            id: "2",
            giver: { username: "James", display_name: "James Lee" },
            item: { id: "201", display_name: "Coffee" },
          },
        ]}
        rewards={[
          { id: "1", display_name: "Hug" },
          { id: "2", display_name: "Coffee" },
          { id: "3", display_name: "Food" },
        ]}
        is_completed={false}
        refreshTable={() => {
          return "substitute test function";
        }}
      />
    );

    expect(wrapper.find(".secondCircle")).toHaveLength(2);
  });
});
