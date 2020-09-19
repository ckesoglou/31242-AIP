import { Server, Response, Model } from "miragejs";
import { baseUrl } from "../api/endpoints";

export function makeServer({ environment = "development" } = {}) {
  let server = new Server({
    environment,
    models: {
      user: Model,
      item: Model,
      request: Model,
      IOU: Model,
      image: Model,
    },

    seeds(server) {
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

      this.post("/login/", (schema, request) => {
        document.cookie = "token=benjaminJohnston";
        let body = request.requestBody;

        return new Response(200, undefined, body);
      });

      this.post("/signup/", (schema, request) => {
        let body = request.requestBody;

        return new Response(201, undefined, body);
      });

      this.get("/user/:id", (schema, request) => {
        return { id: "1", title: "Interstellar" };
      });
    },
  });

  return server;
}
