import app from "../Server";
import request from "supertest";
import sequelize from "@daos/DBInstance";
import { deleteAllTokens } from "@daos/Tokens";
import { deleteAllUsers } from "@daos/Users";

const TESTUSER = {
  username: "testunittestuser",
  displayName: "testunittestuser",
  password: "Testunittestuser!",
};

beforeAll(async () => {
  await sequelize.drop();
  await sequelize.sync();

  // Create test user in database
  await request(app)
    .post("/api/signup")
    .send({
      username: `${TESTUSER.username}`,
      displayName: `${TESTUSER.displayName}`,
      password: `${TESTUSER.password}`,
    });
});

afterEach(async () => {
  await deleteAllTokens();
  await deleteAllUsers();
});

afterAll(async () => {
  await sequelize.drop();
});

describe("Login endpoint", () => {
  it("should login user with correct credentials", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        username: `${TESTUSER.username}`,
        password: `${TESTUSER.password}`,
      });
    expect(res.status).toEqual(200);
  });

  describe("Unauthorised", () => {
    it("should return error with wrong password", async () => {
      const res = await request(app)
        .post("/api/login")
        .send({
          username: `${TESTUSER.username}`,
          password: "wrongpassword",
        });
      expect(res.status).toEqual(401);
      expect(res.body).toHaveProperty("errors");
      expect(res.body.errors).toContain("Username or password was incorrect");
    });

    it("should return error with nonexistent username", async () => {
      const res = await request(app)
        .post("/api/login")
        .send({
          username: "seanasdfasdfasdf",
          password: `${TESTUSER.password}`,
        });
      expect(res.status).toEqual(401);
      expect(res.body).toHaveProperty("errors");
      expect(res.body.errors).toContain("Username or password was incorrect");
    });
  });

  describe("Validation", () => {
    it("should validate username max field length", async () => {
      const res = await request(app)
        .post("/api/login")
        .send({
          username: "seanmorethan16characters",
          password: `${TESTUSER.password}`,
        });
      expect(res.status).toEqual(400);
      expect(res.body).toHaveProperty("errors");
      expect(res.body.errors).toContain(
        '"username" length must be less than or equal to 16 characters long'
      );
    });

    it("should validate username min field length", async () => {
      const res = await request(app)
        .post("/api/login")
        .send({
          username: "s",
          password: `${TESTUSER.password}`,
        });
      expect(res.status).toEqual(400);
      expect(res.body).toHaveProperty("errors");
      expect(res.body.errors).toContain(
        '"username" length must be at least 2 characters long'
      );
    });

    it("should validate username field valid characters", async () => {
      const nonAlphaNumeric = "!@#$%^&*()_+-=`~[{]}\\|;:'\",<.>/?";
      for (const character of nonAlphaNumeric) {
        const res = await request(app)
          .post("/api/login")
          .send({
            username: character,
            password: `${TESTUSER.password}`,
          });
        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors).toContain(
          '"username" must only contain alpha-numeric characters'
        );
      }
    });

    it("should validate password field", async () => {
      const res = await request(app)
        .post("/api/login")
        .send({
          username: `${TESTUSER.username}`,
        });
      expect(res.status).toEqual(400);
      expect(res.body).toHaveProperty("errors");
      expect(res.body.errors).toContain('"password" is required');
    });
  });
});
