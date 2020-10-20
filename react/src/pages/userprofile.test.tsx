import React from "react";
import { shallow, mount } from "enzyme";
import UserProfile from "./userprofile";
import { UserContext } from "../components/user-context";
import { MemoryRouter } from "react-router-dom";

const testProps = {
  history: {} as any,
  location: {
    state: {
      tabIndex: undefined,
    },
  } as any,
  match: {} as any,
};

describe("UserProfile", () => {
  it("should render correctly", () => {
    const component = shallow(
      <UserContext.Provider
        value={{
          user: { name: "Kevin" },
          updateUser: (newUser: Object) => {},
        }}
      >
        <UserProfile
          history={testProps.history}
          location={testProps.location}
          match={testProps.match}
        />
      </UserContext.Provider>
    );

    expect(component).toMatchSnapshot();
  });

  // it("should handle new request if button is clicked", () => {
  //   const spy = jest.spyOn(UserProfile.prototype, "fetchNewRequest");
  //   const wrapper = mount(          TODO
  //     <UserContext.Provider
  //       value={{
  //         user: { name: "Kevin Leung" },
  //         updateUser: () => {},
  //       }}
  //     >
  //       <MemoryRouter>
  //         <UserProfile
  //           history={testProps.history}
  //           location={testProps.location}
  //           match={testProps.match}
  //         />
  //       </MemoryRouter>
  //     </UserContext.Provider>
  //   );
  //   wrapper.find("button#requestTab").simulate("click");
  //   wrapper.find("svg#requestForm").simulate("click");
  //   wrapper
  //     .find("input#favourText")
  //     .simulate("change", { target: { value: "Ben!" } });
  //   wrapper
  //     .find("input#rewardAutoCompleteField")
  //     .simulate("change", { target: { value: "coffee" } });
  //   wrapper
  //     .find("li#rewardAutoCompleteField-option-0")
  //     .simulate("change", { target: { ["aria-selected"]: "true" } });
  //   wrapper.find("button#createRequest").simulate("click");
  //   expect(spy).toHaveBeenCalledTimes(1);
  // });

  // it("should have loading circle on tab contents if button is clicked", () => {
  //   const spyTabs = jest.spyOn(UserProfile.prototype, "fetchAllTabs");
  //   const spyCircle = jest.spyOn(UserProfile.prototype, "setLoading");
  //   const wrapper = mount(
  //     <UserContext.Provider
  //       value={{
  //         user: { name: "Kevin Leung" },
  //         updateUser: () => {},
  //       }}
  //     >
  //       <MemoryRouter>
  //         <UserProfile
  //           history={testProps.history}
  //           location={testProps.location}
  //           match={testProps.match}
  //         />
  //       </MemoryRouter>
  //     </UserContext.Provider>
  //   );

  //   wrapper.find("svg#refresh").simulate("click");

  //   expect(spyTabs).toHaveBeenCalledTimes(2);
  //   expect(spyCircle).toHaveBeenCalledTimes(2);
  // });
});
