import React from "react";
import { shallow } from "enzyme";
import RequestInfo from "./request-info";

describe("<RequestInfo />", () => {
  it("should render correctly", () => {
    const wrapper = shallow(
      <RequestInfo
        request={{
          id: "1",
          author: { username: "James", display_name: "James" },
          completed_by: { username: "Kevin", display_name: "Kevin" },
          proof_of_completion: "Some ID",
          rewards: [
            { id: "1", display_name: "Hug" },
            { id: "2", display_name: "Coffee" },
          ],
          details: "Clean the fridge",
          created_time: "02/02/2020",
          comletion_time: "02/02/2020",
          is_completed: true,
        }}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
