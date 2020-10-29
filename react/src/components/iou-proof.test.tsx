import React from "react";
import { shallow } from "enzyme";
import IouProof from "./iou-proof";

// simple, static component
describe("<IouProof />", () => {
  it("should render correctly", () => {
    const wrapper = shallow(<IouProof imagePK={"Something"} />);
    expect(wrapper.find("#proofIcon")).toHaveLength(1);
    expect(wrapper.find("#noProofIcon")).toHaveLength(0);
  });

  it("should render a no image icon", () => {
    const wrapper = shallow(<IouProof imagePK={""} />);
    expect(wrapper.find("#proofIcon")).toHaveLength(0);
    expect(wrapper.find("#noProofIcon")).toHaveLength(1);
  });
});
