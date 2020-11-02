import React from "react";
import { shallow, mount } from "enzyme";
import RequestInfo from "./request-info";
import { UserContext } from "../components/user-context";

describe("<RequestInfo />", () => {
  it("should render correctly", () => {
    const wrapper = shallow(
      <UserContext.Provider
        value={{
          user: { name: "Kevin Leung" },
          updateUser: () => {},
        }}
      >
        <RequestInfo
          request={{
            id: "1",
            author: { username: "James", display_name: "James Lee" },
            completed_by: { username: "Kevin", display_name: "Kevin Leung" },
            proof_of_completion: "Some ID",
            rewards: [
              {
                id: "1",
                giver: { username: "James", display_name: "James Lee" },
                item: { id: "202", display_name: "Hug" },
              },
              {
                id: "2",
                giver: { username: "Sean", display_name: "Sean Tran" },
                item: { id: "201", display_name: "Coffee" },
              },
            ],
            details: "Clean the fridge",
            created_time: "02/02/2020",
            completion_time: "02/02/2020",
            is_completed: true,
          }}
          refreshTable={() => {
            return "substitute test function";
          }}
        />
      </UserContext.Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should render the modal if the icon is clicked", () => {
    const wrapper = mount(
      <UserContext.Provider
        value={{
          user: { name: "James" },
          updateUser: () => {},
        }}
      >
        <RequestInfo
          request={{
            id: "1",
            author: { username: "James", display_name: "James Lee" },
            completed_by: { username: "Kevin", display_name: "Kevin Leung" },
            proof_of_completion: "Some ID",
            rewards: [
              {
                id: "1",
                giver: { username: "James", display_name: "James Lee" },
                item: { id: "202", display_name: "Hug" },
              },
              {
                id: "2",
                giver: { username: "Sean", display_name: "Sean Tran" },
                item: { id: "201", display_name: "Coffee" },
              },
            ],
            details: "Clean the fridge",
            created_time: "02/02/2020",
            completion_time: "02/02/2020",
            is_completed: true,
          }}
          refreshTable={() => {
            return "substitute test function";
          }}
        />
      </UserContext.Provider>
    );
    wrapper.find("svg#infoIcon").simulate("click");
    expect(wrapper.state("infoModal")).toBe(true);
  });
});
