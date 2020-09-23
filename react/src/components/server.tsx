import { Server, Response, Model } from "miragejs";
import { baseUrl } from "../api/endpoints";

export function makeServer({ environment = "development" } = {}) {
  let server = new Server({
    environment,
    models: {
      // This may or may not be useful but keeping in case we need it
      user: Model,
      item: Model,
      request: Model,
      IOU: Model,
      image: Model,
    },

    seeds(server) {
      // This may or may not be useful but keeping in case we need it
      server.db.loadData({
        user: [
          { username: "Ben", display_name: "BenIsCool", password_hash: "asdf" },
          {
            username: "Johnston",
            display_name: "JohnstonIsCool",
            password_hash: "asdf",
          },
        ],
        item: [
          { id: "1", display_name: "Ice cream" },
          { id: "2", display_name: "Back massage" },
          { id: "3", display_name: "Free lunch" },
        ],
        request: [
          { id: "1", author: "Ben", completed_by: "Johnston" },
          { id: "2", author: "Johnston", completed_by: "Ben" },
          { id: "3", author: "Johnston", completed_by: "Ben" },
        ],
        IOU: [{ username: "Ben" }, { username: "Ben" }],
        image: [{}],
      });
    },

    routes() {
      this.namespace = baseUrl;
      const jsonHeader = {
        "Content-Type": "application/json",
      };

      this.post("/login/", (schema, request) => {
        //document.cookie = "token=benjaminJohnston";
        let body = request.requestBody;

        return new Response(200, jsonHeader, body);
      });

      this.post("/signup/", (schema, request) => {
        let body = request.requestBody;

        return new Response(201, jsonHeader, body);
      });

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
    },
  });

  return server;
}
