import { Server, Response } from "miragejs";
import { baseUrl } from "../api/endpoints";

export function makeServer({ environment = "development" } = {}) {
  let server = new Server({
    environment,
    routes() {
      this.namespace = baseUrl;

      this.post("/login", (schema, request) => {
        document.cookie = "token=benjaminJohnston";
        let body = request.requestBody;

        return new Response(200, undefined, body);
      });

      this.post("/signup", (schema, request) => {
        let body = request.requestBody;

        return new Response(201, undefined, body);
      });

      // this.get("/user/:id", (schema, request) => {
      //   let id = request.params.id;

      //   return
      // })
    },
  });

  return server;
}
