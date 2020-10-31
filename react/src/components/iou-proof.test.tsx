import React from "react";
import { shallow } from "enzyme";
import IouProof from "./iou-proof";

// simple, static component
describe("<IouProof />", () => {
  it("should render correctly for proof of completion", () => {
    const wrapper = shallow(
      <IouProof imagePK={"Something"} proof_of_debt={false} />
    );
    expect(wrapper.find("#proofIcon")).toHaveLength(1);
    expect(wrapper.find("#taskDetailPopUp").text()).toEqual(
      "Proof of Completion"
    );
    expect(wrapper.find("#noProofIcon")).toHaveLength(0);
  });

  it("should render correctly for proof of debt", () => {
    const wrapper = shallow(
      <IouProof imagePK={"Something"} proof_of_debt={true} />
    );
    expect(wrapper.find("#proofIcon")).toHaveLength(1);
    expect(wrapper.find("#taskDetailPopUp").text()).toEqual("Proof of Debt");
    expect(wrapper.find("#noProofIcon")).toHaveLength(0);
  });

  it("should render a no image icon", () => {
    const wrapper = shallow(<IouProof imagePK={""} proof_of_debt={false} />);
    expect(wrapper.find("#proofIcon")).toHaveLength(0);
    expect(wrapper.find("#noProofIcon")).toHaveLength(1);
  });
});
