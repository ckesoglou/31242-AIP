import React from "react";
import { shallow } from "enzyme";
import IouFavour from "./iou-single-favour";

describe("<IouFavour />", () => {
  it("should render correctly", () => {
    const wrapper = shallow(
      <IouFavour
        giverDisplayName="James Long Lee"
        recieverDisplayName="Kevin Pog Lueng"
        item={{ id: "1", display_name: "Coffee" }}
      />
    );
    expect(wrapper.find("#favourAvatar").at(0).text()).toEqual("JL");
    expect(wrapper.find("#favourAvatar").at(1).text()).toEqual("KL");
    expect(wrapper.find("#favourAvatarText").at(0).text()).toEqual(
      "James Long Lee"
    );
    expect(wrapper.find("#favourAvatarText").at(1).text()).toEqual(
      "Kevin Pog Lueng"
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should render correctly with no reciever", () => {
    const wrapper = shallow(
      <IouFavour
        giverDisplayName="James Long Lee"
        recieverDisplayName=""
        item={{ id: "1", display_name: "Coffee" }}
      />
    );
    expect(wrapper.find("#favourAvatar").at(0).text()).toEqual("JL");
    expect(wrapper.find("#favourAvatar").at(1).text()).toEqual("");
    expect(wrapper.find("#favourAvatarText").at(0).text()).toEqual(
      "James Long Lee"
    );
    expect(wrapper.find("#favourAvatarText").at(1).text()).toEqual(
      "No Reciever"
    );
  });
});
