import app from "../Server";
import request from "supertest";
import sequelize from "../daos/DBInstance";
import { deleteAllUsers, createUser } from "../daos/Users";
import { getAuthenticatedUserCookie } from "../shared/test.config";

const TESTUSER = {
  username: "testunittestuser",
  displayName: "testunittestuser",
  password: "Testunittestuser!",
};
const TESTUSER2 = {
  username: "testunittestusr2",
  displayName: "testunittestusr2",
  password: "Testunittestusr2!",
};
let cookie = "";

beforeAll(async () => {
  await sequelize.drop();
  await sequelize.sync();
});

beforeEach(async () => {
  // Create test users
  await request(app)
    .post("/api/signup")
    .send({
      username: `${TESTUSER.username}`,
      displayName: `${TESTUSER.displayName}`,
      password: `${TESTUSER.password}`,
    });
  await createUser({
    username: TESTUSER2.username,
    display_name: TESTUSER2.displayName,
    password_hash: "password hash",
  });
  cookie = await getAuthenticatedUserCookie();
});

afterEach(async () => {
  await deleteAllUsers();
});

afterAll(async () => {
  await sequelize.drop();
});

describe("Users endpoint", () => {
  it("should filter users based on query", async () => {
    const res = await request(app).get(
      `/api/users?search=${TESTUSER.username.slice(0, 14)}`
    );
    expect(res.status).toEqual(200);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });
});

describe("Users endpoint", () => {
  it("should return authenticated user information", async () => {
    const res = await request(app).get(`/api/user`).set("Cookie", cookie);
    expect(res.status).toEqual(200);
  });
  it("should validate authenticated user", async () => {
    const res = await request(app).get(`/api/user`);
    expect(res.status).toEqual(401);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toContain("Not authenticated.");
  });
});
