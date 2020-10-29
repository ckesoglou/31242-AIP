import React from "react";
import { mount } from "enzyme";
import { createServer, Server, Response } from "miragejs";
import Leaderboard from "./leaderboard";
import { baseUrl } from "../api/endpoints";

// Integration tests are on home.test.tsx
describe("<Leaderboard />", () => {
  let server: Server<any>;
  const jsonHeader = {
    "Content-Type": "application/json",
  };

  beforeEach(() => {
    server = createServer({
      environment: "test",
      routes() {
        this.namespace = baseUrl;

        this.get(
          "/leaderboard",
          () => {
            let body = [
              {
                rank: 1,
                user: {
                  username: "kleung",
                  display_name: "Kevin Leung",
                },
                score: 42,
              },
              {
                rank: 2,
                user: {
                  username: "jsmith",
                  display_name: "John Smith",
                },
                score: 35,
              },
              {
                rank: 3,
                user: {
                  username: "benjohn",
                  display_name: "Ben Johnston",
                },
                score: 10,
              },
              {
                rank: 3,
                user: {
                  username: "benjohn",
                  display_name: "Ben Johnston",
                },
                score: 10,
              },
              {
                rank: 3,
                user: {
                  username: "benjohn",
                  display_name: "Ben Johnston",
                },
                score: 10,
              },
              {
                rank: 3,
                user: {
                  username: "benjohn",
                  display_name: "Ben Johnston",
                },
                score: 10,
              },
              {
                rank: 3,
                user: {
                  username: "benjohn",
                  display_name: "Ben Johnston",
                },
                score: 10,
              },
              {
                rank: 3,
                user: {
                  username: "benjohn",
                  display_name: "Ben Johnston",
                },
                score: 10,
              },
              {
                rank: 3,
                user: {
                  username: "benjohn",
                  display_name: "Ben Johnston",
                },
                score: 10,
              },
              {
                rank: 3,
                user: {
                  username: "benjohn",
                  display_name: "Ben Johnston",
                },
                score: 10,
              },
            ];

            return new Response(200, jsonHeader, body);
          },
          { timing: 2000 } // mock delay - helps visualise loading for user
        );
      },
    });
  });

  afterEach(() => {
    server.shutdown();
  });

  it("should render correctly", () => {
    const wrapper = mount(<Leaderboard />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render correctly", () => {
    const wrapper = mount(<Leaderboard />);
    expect(wrapper).toMatchSnapshot();
  });
});
