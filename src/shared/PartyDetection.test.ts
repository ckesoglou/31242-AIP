import app from "../Server";
import { TESTUSERARRAY, getAuthenticatedUserCookie } from "./test.config";
import request from "supertest";
import sequelize from "@daos/DBInstance";
import { deleteAllTokens } from "@daos/Tokens";
import { deleteAllUsers } from "@daos/Users";

beforeEach(async () => {
  await sequelize.drop();
  await sequelize.sync();

  // Create test user in database
  for (let TESTUSER of TESTUSERARRAY) {
    const res = await request(app)
      .post("/api/signup")
      .send({
        username: `${TESTUSER.username}`,
        displayName: `${TESTUSER.displayName}`,
        password: `${TESTUSER.password}`,
      });
    expect(res.status).toEqual(201);
  }
});

afterEach(async () => {
  await deleteAllTokens();
  await deleteAllUsers();
  await sequelize.drop();
  await sequelize.sync();
});

describe("Party detection", () => {
  it("should only detect parties at the end", async () => {
    for (var [index, current] of TESTUSERARRAY.entries()) {
      var j = index + 1;
      if (j < TESTUSERARRAY.length) {
        const loginRes = await request(app)
          .post("/api/login")
          .send({
            username: `${current.username}`,
            password: `${current.password}`,
          });

        expect(loginRes.status).toEqual(200);

        const cookie = await getAuthenticatedUserCookie();

        const iouRes = await request(app)
          .post("/api/iou/owe")
          .set("Cookie", cookie)
          .send({
            username: `${TESTUSERARRAY[j].username}`,
            item: "510ab12d-1689-4b2c-8a8d-275376f11077",
          });

        expect(iouRes.status).toEqual(200);
        expect(iouRes.body).not.toHaveProperty("usersInParty");
      }
    }

    const loginRes = await request(app)
      .post("/api/login")
      .send({
        username: `${TESTUSERARRAY[TESTUSERARRAY.length - 1].username}`,
        password: `${TESTUSERARRAY[TESTUSERARRAY.length - 1].password}`,
      });

    expect(loginRes.status).toEqual(200);

    const cookie = await getAuthenticatedUserCookie();

    const iouRes = await request(app)
      .post("/api/iou/owe")
      .set("Cookie", cookie)
      .send({
        username: `${TESTUSERARRAY[0].username}`,
        item: "510ab12d-1689-4b2c-8a8d-275376f11077",
      });

    expect(iouRes.status).toEqual(200);
    expect(iouRes.body).toHaveProperty("usersInParty");
  });

  it("should remove deadend branches", async () => {
    for (var [index, current] of TESTUSERARRAY.entries()) {
      var j = index + 1;
      if (j < 4) {
        const loginRes = await request(app)
          .post("/api/login")
          .send({
            username: `${current.username}`,
            password: `${current.password}`,
          });

        expect(loginRes.status).toEqual(200);

        const cookie = await getAuthenticatedUserCookie();

        const iouRes = await request(app)
          .post("/api/iou/owe")
          .set("Cookie", cookie)
          .send({
            username: `${TESTUSERARRAY[j].username}`,
            item: "510ab12d-1689-4b2c-8a8d-275376f11077",
          });

        expect(iouRes.status).toEqual(200);
        expect(iouRes.body).not.toHaveProperty("usersInParty");
      }
    }

    const firstUserloginRes = await request(app)
      .post("/api/login")
      .send({
        username: `${current.username}`,
        password: `${current.password}`,
      });

    expect(firstUserloginRes.status).toEqual(200);

    const firstUserCookie = await getAuthenticatedUserCookie();

    const firstUserIouRes = await request(app)
      .post("/api/iou/owe")
      .set("Cookie", firstUserCookie)
      .send({
        username: `${TESTUSERARRAY[4].username}`,
        item: "510ab12d-1689-4b2c-8a8d-275376f11077",
      });

    expect(firstUserIouRes.status).toEqual(200);
    expect(firstUserIouRes.body).not.toHaveProperty("usersInParty");

    for (var [index, current] of TESTUSERARRAY.entries()) {
      var j = index + 1;
      if (j >= 5 && j < TESTUSERARRAY.length) {
        const loginRes = await request(app)
          .post("/api/login")
          .send({
            username: `${current.username}`,
            password: `${current.password}`,
          });

        expect(loginRes.status).toEqual(200);

        const cookie = await getAuthenticatedUserCookie();

        const iouRes = await request(app)
          .post("/api/iou/owe")
          .set("Cookie", cookie)
          .send({
            username: `${TESTUSERARRAY[j].username}`,
            item: "510ab12d-1689-4b2c-8a8d-275376f11077",
          });

        expect(iouRes.status).toEqual(200);
        expect(iouRes.body).not.toHaveProperty("usersInParty");
      }
    }

    const loginRes = await request(app)
      .post("/api/login")
      .send({
        username: `${TESTUSERARRAY[TESTUSERARRAY.length - 1].username}`,
        password: `${TESTUSERARRAY[TESTUSERARRAY.length - 1].password}`,
      });

    expect(loginRes.status).toEqual(200);

    const cookie = await getAuthenticatedUserCookie();

    const iouRes = await request(app)
      .post("/api/iou/owe")
      .set("Cookie", cookie)
      .send({
        username: `${TESTUSERARRAY[0].username}`,
        item: "510ab12d-1689-4b2c-8a8d-275376f11077",
      });

    expect(iouRes.status).toEqual(200);
    expect(iouRes.body).toHaveProperty("usersInParty");
  });
});
