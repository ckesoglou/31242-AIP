import { Server, Response } from "miragejs";
import { baseUrl } from "../api/endpoints";

export function makeServer({ environment = "development" } = {}) {
  let server: any = new Server({
    environment,
    routes() {
      this.namespace = baseUrl;
      const jsonHeader = {
        "Content-Type": "application/json",
      };

      // Below is mock API for login/signup
      this.post("/login/", (schema, request) => {
        let body = request.requestBody;

        return new Response(200, jsonHeader, body);
      });

      this.post("/signup/", (schema, request) => {
        let body = request.requestBody;

        return new Response(201, jsonHeader, body);
      });

      // Below is mock API for user profile
      this.get(
        "/user/:id",
        () => {
          let body = {
            username: "jsmith",
            display_name: "John Smith",
          };

          return new Response(200, jsonHeader, body);
        },
        { timing: 2000 } // mock delay - helps visualise loading for user
      );

      this.get(
        "/iou/owed/",
        () => {
          let body = [
            {
              id: "510ab12d-1689-4b2c-8a8d-275376f11077",
              item: {
                id: "a16ed6ef-c666-46d7-93b5-e4612cce923e",
                display_name: "Coffee",
              },
              giver: {
                username: "jsmith",
                display_name: "John Smith",
              },
              parent_request: "510ab12d-1689-4b2c-8a8d-275376f11078",
              proof_of_debt: "510ab12d-1689-4b2c-8a8d-275376f11079",
              proof_of_completion: "510ab12d-1689-4b2c-8a8d-275376f11076",
              created_time: "2020-03-09T22:18:26.625Z",
              claimed_time: "2020-03-09T22:18:26.625Z",
              is_claimed: false,
            },
          ];

          return new Response(200, jsonHeader, body);
        },
        { timing: 2000 } // mock delay - helps visualise loading for user
      );

      this.get(
        "/iou/owe/",
        () => {
          let body = [
            {
              id: "510ab12d-1689-4b2c-8a8d-275376f11077",
              item: {
                id: "a16ed6ef-c666-46d7-93b5-e4612cce923e",
                display_name: "Coffee",
              },
              receiver: {
                username: "jsmith",
                display_name: "John Smith",
              },
              parent_request: "510ab12d-1689-4b2c-8a8d-275376f11078",
              proof_of_debt: "510ab12d-1689-4b2c-8a8d-275376f11079",
              proof_of_completion: "510ab12d-1689-4b2c-8a8d-275376f11076",
              created_time: "2020-03-09T22:18:26.625Z",
              claimed_time: "2020-03-09T22:18:26.625Z",
              is_claimed: false,
            },
          ];

          return new Response(200, jsonHeader, body);
        },
        { timing: 2000 } // mock delay - helps visualise loading for user
      );

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

      this.get(
        "/leaderboard/me",
        () => {
          let body = {
            rank: 1,
            score: 35,
          };

          return new Response(200, jsonHeader, body);
        },
        { timing: 2000 } // mock delay - helps visualise loading for user
      );

      this.get(
        "/items",
        () => {
          let body = [
            {
              id: 1,
              display_name: "Coffee",
            },
            {
              id: 2,
              display_name: "Chris' lunch",
            },
            {
              id: 3,
              display_name: "James' lunch",
            },
            {
              id: 4,
              display_name: "Kevin's lunch",
            },
          ];

          return new Response(200, jsonHeader, body);
        },
        { timing: 2000 } // mock delay - helps visualise loading for user
      );

      this.get(
        "/requests",
        (schema, request) => {
          if (request.queryParams.search) {
            var body;
            body = [
              {
                id: "string",
                author: {
                  username: "jsmith",
                  display_name: "John Smith",
                },
                completed_by: {
                  username: "jsmith",
                  display_name: "John Smith",
                },
                proof_of_completion: "3533c832-2efa-4b37-be38-2f1c278704b8",
                rewards: [
                  {
                    id: "a16ed6ef-c666-46d7-93b5-e4612cce923e",
                    display_name: "Coffee",
                  },
                ],
                details: "Clean the fridge",
                created_time: "2020-03-09T22:18:26.625Z",
                completion_time: "2020-03-09T22:18:26.625Z",
                is_completed: false,
              },
            ];
          } else {
            body = [
              {
                id: "string",
                author: {
                  username: "jsmith",
                  display_name: "John Smith",
                },
                completed_by: {
                  username: "jsmith",
                  display_name: "John Smith",
                },
                proof_of_completion: "3533c832-2efa-4b37-be38-2f1c278704b8",
                rewards: [
                  {
                    id: "a16ed6ef-c666-46d7-93b5-e4612cce923e",
                    display_name: "Coffee",
                  },
                ],
                details: "Clean the fridge",
                created_time: "2020-03-09T22:18:26.625Z",
                completion_time: "2020-03-09T22:18:26.625Z",
                is_completed: false,
              },
              {
                id: "string",
                author: {
                  username: "jsmith",
                  display_name: "John Smith",
                },
                completed_by: {
                  username: "jsmith",
                  display_name: "John Smith",
                },
                proof_of_completion: "3533c832-2efa-4b37-be38-2f1c278704b8",
                rewards: [
                  {
                    id: "a16ed6ef-c666-46d7-93b5-e4612cce923e",
                    display_name: "Coffee",
                  },
                ],
                details: "Clean the fridge",
                created_time: "2020-03-09T22:18:26.625Z",
                completion_time: "2020-03-09T22:18:26.625Z",
                is_completed: false,
              },
              {
                id: "string",
                author: {
                  username: "jsmith",
                  display_name: "John Smith",
                },
                completed_by: {
                  username: "jsmith",
                  display_name: "John Smith",
                },
                proof_of_completion: "3533c832-2efa-4b37-be38-2f1c278704b8",
                rewards: [
                  {
                    id: "a16ed6ef-c666-46d7-93b5-e4612cce923e",
                    display_name: "Coffee",
                  },
                ],
                details: "Clean the fridge",
                created_time: "2020-03-09T22:18:26.625Z",
                completion_time: "2020-03-09T22:18:26.625Z",
                is_completed: false,
              },
            ];
          }

          return new Response(200, jsonHeader, body);
        },
        { timing: 2000 } // mock delay - helps visualise loading for user
      );

      this.get(
        "/users",
        () => {
          let body = [
            {
              username: "JamesL",
              display_name: "James Lee",
            },
            {
              username: "KevinL",
              display_name: "Kevin Leung",
            },
          ];
          return new Response(200, jsonHeader, body);
        },
        { timing: 3000 }
      );
    },
  });
  return server;
}
