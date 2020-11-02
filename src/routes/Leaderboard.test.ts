import app from "../Server";
import request from "supertest";
import sequelize from "../daos/DBInstance";
import { getAuthenticatedUserCookie } from "../shared/test.config";
import {
  createLeaderboardViewSQL,
  dropLeaderboardViewSQL,
} from "../daos/Scores";

const TESTUSER = {
  username: "testunittestuser",
  displayName: "testunittestuser",
  password: "Testunittestuser!",
};
let cookie = "";

beforeAll(async () => {
  await sequelize.drop();
  await sequelize.sync();

  // Create leaderboard view (not supported by Sequelize)
  await sequelize.query(dropLeaderboardViewSQL);
  await sequelize.query(createLeaderboardViewSQL);

  // Create test user in database
  await request(app).post("/api/signup").send({
    username: TESTUSER.username,
    displayName: TESTUSER.displayName,
    password: TESTUSER.password,
  });
});

beforeEach(async () => {
  cookie = await getAuthenticatedUserCookie();
});

afterAll(async () => {
  await sequelize.drop();
});

describe("Leaderboard endpoint", () => {
  it("should retrieve the current leaderboard", async () => {
    const res = await request(app).get("/api/leaderboard");
    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(1);
  });

  it("should retrieve the authenticated user's score", async () => {
    const res = await request(app)
      .get("/api/leaderboard/me")
      .set("Cookie", cookie);
    expect(res.status).toEqual(200);
  });

  it("should validate user when getting authenticated user's score", async () => {
    const res = await request(app).get("/api/leaderboard/me");
    expect(res.status).toEqual(401);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toContain("Not authenticated");
  });
});
