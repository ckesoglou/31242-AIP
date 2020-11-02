import app from "../Server";
import request from "supertest";
import sequelize from "../daos/DBInstance";

beforeAll(async () => {
  await sequelize.drop();
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.drop();
});

describe("Item endpoint", () => {
  it("should return list of items", async () => {
    const res = await request(app).get("/api/items");
    expect(res.status).toEqual(200);
  });
});
