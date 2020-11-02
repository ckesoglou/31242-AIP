import app from "../Server";
import request from "supertest";
import sequelize from "../daos/DBInstance";
import { createUser, deleteAllUsers } from "../daos/Users";

const TESTUSER = {
  username: "testunittestuser",
  displayName: "testunittestuser",
  password: "Testunittestuser!",
};

beforeAll(async () => {
  await sequelize.drop();
  await sequelize.sync();
});

afterEach(async () => {
  await deleteAllUsers();
});

afterAll(async () => {
  await sequelize.drop();
});

describe("Signup endpoint", () => {
  describe("Successful signup", () => {
    it("should sign up new user", async () => {
      const res = await request(app).post("/api/signup").send({
        username: TESTUSER.username,
        displayName: TESTUSER.displayName,
        password: TESTUSER.password,
      });
      expect(res.status).toEqual(201);
    });
  });

  describe("Validation", () => {
    it("should validate usernames already taken", async () => {
      await createUser(
        TESTUSER.username,
        TESTUSER.displayName,
        "password hash"
      );

      const res = await request(app).post("/api/signup").send({
        username: TESTUSER.username,
        displayName: TESTUSER.displayName,
        password: TESTUSER.password,
      });
      expect(res.status).toEqual(422);
      expect(res.body).toHaveProperty("errors");
      expect(res.body.errors).toContain("Username already taken.");
    });

    it("should validate username max field length", async () => {
      const res = await request(app).post("/api/signup").send({
        username: "testmorethan16characters",
        displayName: TESTUSER.displayName,
        password: TESTUSER.password,
      });
      expect(res.status).toEqual(400);
      expect(res.body).toHaveProperty("errors");
      expect(res.body.errors).toContain(
        '"username" length must be less than or equal to 16 characters long'
      );
    });

    it("should validate username min field length", async () => {
      const res = await request(app).post("/api/signup").send({
        username: "s",
        displayName: TESTUSER.displayName,
        password: TESTUSER.password,
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
        const res = await request(app).post("/api/signup").send({
          username: character,
          displayName: TESTUSER.displayName,
          password: TESTUSER.password,
        });
        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors).toContain(
          '"username" must only contain alpha-numeric characters'
        );
      }
    });

    it("should validate password field", async () => {
      const res = await request(app).post("/api/signup").send({
        username: TESTUSER.username,
        displayName: TESTUSER.displayName,
      });
      expect(res.status).toEqual(400);
      expect(res.body).toHaveProperty("errors");
      expect(res.body.errors).toContain('"password" is required');
    });

    it("should validate display name field", async () => {
      const res = await request(app).post("/api/signup").send({
        username: TESTUSER.username,
        password: TESTUSER.password,
      });
      expect(res.status).toEqual(400);
      expect(res.body).toHaveProperty("errors");
      expect(res.body.errors).toContain('"displayName" is required');
    });
  });
});
