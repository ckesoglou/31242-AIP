import React from "react";
import { shallow, mount } from "enzyme";
import { Server, Response } from "miragejs";
import { baseUrl } from "../api/endpoints";

import Login from "./login";

let server: Server;

// I'm thinking that we don't
// need the server to start/stop on each test

beforeEach(() => {
  server = new Server({
    routes() {
      //   this.namespace = `${baseUrl}`;
      this.namespace = "api";

      this.post("/login", () => {
        let headers = {}; // insert new cookie here
        return new Response(200, headers);
      });
    },
  });
});

afterEach(() => {
  server.shutdown();
});

describe("<Login />", () => {
  it("should render correctly", () => {
    const wrapper = shallow(<Login />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should get a valid cookie on successful login", () => {
    const wrapper = mount(<Login />);
    let button = wrapper.find("button");
    expect(button).toHaveLength(1);
    button.simulate("click");

    // check ui changed
  });
});
