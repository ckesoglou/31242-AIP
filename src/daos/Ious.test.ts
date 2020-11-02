import app from "../Server";
import { TESTUSERARRAY, ITEMID } from "../shared/test.config";
import request from "supertest";
import sequelize from "@daos/DBInstance";
import { deleteAllTokens } from "@daos/Tokens";
import { deleteAllUsers } from "@daos/Users";

beforeAll(async () => {
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

afterAll(async () => {
  await deleteAllTokens();
  await deleteAllUsers();
  await sequelize.drop();
  await sequelize.sync();
});

describe("Party detection", () => {
  it("should only detect parties at the end", async () => {
    for (var [index, current] of TESTUSERARRAY.entries()) {
      var j = index + 1;

      const loginRes = await request(app)
        .post("/api/login")
        .send({
          username: `${current.username}`,
          password: `${current.password}`,
        });

      expect(loginRes.status).toEqual(200);

      const iouRes = await request(app)
        .post("/api/iou/owe")
        .send({
          username: `${TESTUSERARRAY[j].username}`,
          item: "510ab12d-1689-4b2c-8a8d-275376f11077",
        });

      console.log(TESTUSERARRAY[j].username);

      expect(iouRes.status).toEqual(200);
      expect(iouRes.body).toHaveProperty("usersInParty");
      expect(iouRes.body.usersInParty).toEqual("");
    }

    const loginRes = await request(app)
      .post("/api/login")
      .send({
        username: `${TESTUSERARRAY[TESTUSERARRAY.length - 1].username}`,
        password: `${TESTUSERARRAY[TESTUSERARRAY.length - 1].password}`,
      });

    const iouRes = await request(app)
      .post("/api/iou/owe")
      .send({
        receiver: `${TESTUSERARRAY[0].username}`,
        item: `${ITEMID}`,
      });

    expect(iouRes.status).toEqual(200);
    expect(iouRes.body).toHaveProperty("usersInParty");
    expect(iouRes.body.usersInParty).toEqual("Stuff in here???");
  });
});
