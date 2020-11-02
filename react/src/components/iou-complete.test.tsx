import React from "react";
import { shallow, mount } from "enzyme";
import IouComplete from "./iou-complete";

// simple, static component
describe("<IouComplete />", () => {
  global.URL.createObjectURL = jest.fn();
  it("should render correctly", () => {
    const wrapper = shallow(
      <IouComplete
        id="1"
        is_completed={true}
        author="James"
        completed_by="Kevin"
        claimed_time="01/06/2020"
        created_time="01/01/2020"
        rewards={[
          {
            id: "1",
            giver: { username: "James", display_name: "James" },
            item: { id: "201", display_name: "Coffee" },
          },
        ]}
        details="Clean the fridge"
        iouType={0}
        refreshTable={() => {
          return "substitute test function";
        }}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should have a disabled complete button on a owing IOU on render", () => {
    const wrapper = mount(
      <IouComplete
        id="1"
        is_completed={false}
        author="James"
        completed_by=""
        claimed_time={null}
        created_time="01/01/2020"
        rewards={[
          {
            id: "1",
            giver: { username: "James", display_name: "James" },
            item: { id: "201", display_name: "Coffee" },
          },
        ]}
        details="Clean the fridge"
        iouType={1}
        refreshTable={() => {
          return "substitute test function";
        }}
      />
    );
    wrapper.find("div.cursorPointer").simulate("click");
    expect(wrapper.state("completeIOU")).toBe(true);
    expect(wrapper.find("button#createRequest").props().disabled).toBe(true);
  });

  it("should have an enabled complete button on a owed IOU on render", () => {
    const wrapper = mount(
      <IouComplete
        id="1"
        is_completed={false}
        author="James"
        completed_by=""
        claimed_time={null}
        created_time="01/01/2020"
        rewards={[
          {
            id: "1",
            giver: { username: "James", display_name: "James" },
            item: { id: "201", display_name: "Coffee" },
          },
        ]}
        details="Clean the fridge"
        iouType={0}
        refreshTable={() => {
          return "substitute test function";
        }}
      />
    );
    wrapper.find("div.cursorPointer").simulate("click");
    expect(wrapper.state("completeIOU")).toBe(true);
    expect(wrapper.find("button#createRequest").props().disabled).toBe(false);
  });

  it("should have a disabled complete button for requests on render", () => {
    const wrapper = mount(
      <IouComplete
        id="1"
        is_completed={false}
        author="James"
        completed_by=""
        claimed_time={null}
        created_time="01/01/2020"
        rewards={[
          {
            id: "1",
            giver: { username: "James", display_name: "James" },
            item: { id: "201", display_name: "Coffee" },
          },
        ]}
        details="Clean the fridge"
        iouType={2}
        refreshTable={() => {
          return "substitute test function";
        }}
      />
    );
    wrapper.find("div.cursorPointer").simulate("click");
    expect(wrapper.state("completeIOU")).toBe(true);
    expect(wrapper.find("button#createRequest").props().disabled).toBe(true);
  });

  it("should have an enabled complete button for requests on image upload", () => {
    const wrapper = mount(
      <IouComplete
        id="1"
        is_completed={false}
        author="James"
        completed_by=""
        claimed_time={null}
        created_time="01/01/2020"
        rewards={[
          {
            id: "1",
            giver: { username: "James", display_name: "James" },
            item: { id: "201", display_name: "Coffee" },
          },
        ]}
        details="Clean the fridge"
        iouType={2}
        refreshTable={() => {
          return "substitute test function";
        }}
      />
    );
    wrapper.find("div.cursorPointer").simulate("click");
    expect(wrapper.state("completeIOU")).toBe(true);
    global.URL.createObjectURL = jest.fn((param: any) => "tempUrlString");
    wrapper.setState({ submittedProof: "Temp File Mockup" });
    expect(wrapper.find("button#createRequest").props().disabled).toBe(false);
  });

  it("should have an enabled complete button for owing IOU on image upload", () => {
    const wrapper = mount(
      <IouComplete
        id="1"
        is_completed={false}
        author="James"
        completed_by=""
        claimed_time={null}
        created_time="01/01/2020"
        rewards={[
          {
            id: "1",
            giver: { username: "James", display_name: "James" },
            item: { id: "201", display_name: "Coffee" },
          },
        ]}
        details="Clean the fridge"
        iouType={1}
        refreshTable={() => {
          return "substitute test function";
        }}
      />
    );
    wrapper.find("div.cursorPointer").simulate("click");
    expect(wrapper.state("completeIOU")).toBe(true);
    global.URL.createObjectURL = jest.fn((param: any) => "tempUrlString");
    wrapper.setState({ submittedProof: "Temp File Mockup" });
    expect(wrapper.find("button#createRequest").props().disabled).toBe(false);
  });
});
