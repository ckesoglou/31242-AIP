import React from "react";
import { shallow } from "enzyme";
import Iou from "./iou";

describe("<Iou />", () => {
  it("should render correctly", () => {
    const wrapper = shallow(
      <Iou
        iou={{
          id: "1",
          item: { id: "201", display_name: "Coffee" },
          giver: { username: "James", display_name: "James Lee" },
          receiver: { username: "Kevin", display_name: "Kevin Lueng" },
          parent_request: null,
          proof_of_debt: "Some ID",
          proof_of_completion: "Some ID",
          created_time: "02/02/2020",
          claimed_time: "02/02/2020",
          is_claimed: true,
        }}
        iouType={0}
        refreshTable={() => {
          return "substitute test function";
        }}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
