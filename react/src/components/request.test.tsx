import React from "react";
import { shallow } from "enzyme";
import Request from "./request";

describe("<Request />", () => {
  it("should render correctly", () => {
    const wrapper = shallow(
      <Request
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
          created_time: "01/01/2020",
          completion_time: "02/02/2020",
          is_completed: true,
        }}
        potentialRewards={[
          { id: "201", display_name: "Coffee" },
          { id: "202", display_name: "Hug" },
        ]}
        iouType={2}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
