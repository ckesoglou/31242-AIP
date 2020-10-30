/// <reference types="jest" />
const request = require("supertest");
const APP = "https://ioweyou.tech";

describe("Login endpoint", () => {
  it("should login user with correct credentials", async () => {
    const res = await request(APP).post("/api/login").send({
      username: "sean",
      password: "Seansean!",
    });
    expect(res.statusCode).toEqual(200);
  });

  describe("Unauthorised", () => {
    it("should return error with wrong password", async () => {
      const res = await request(APP).post("/api/login").send({
        username: "sean",
        password: "wrongpassword",
      });
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("errors");
      expect(res.body.errors).toContain("Username or password was incorrect");
    });

    it("should return error with nonexistent username", async () => {
      const res = await request(APP).post("/api/login").send({
        username: "seanasdfasdfasdf",
        password: "Seansean!",
      });
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("errors");
      expect(res.body.errors).toContain("Username or password was incorrect");
    });
  });

  describe("Validation", () => {
    it("should validate username max field length", async () => {
      const res = await request(APP).post("/api/login").send({
        username: "seanmorethan16characters",
        password: "Seansean!",
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("errors");
      expect(res.body.errors).toContain(
        '"username" length must be less than or equal to 16 characters long'
      );
    });

    it("should validate username min field length", async () => {
      const res = await request(APP).post("/api/login").send({
        username: "s",
        password: "Seansean!",
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("errors");
      expect(res.body.errors).toContain(
        '"username" length must be at least 2 characters long'
      );
    });

    it("should validate username field valid characters", async () => {
      const nonAlphaNumeric = "!@#$%^&*()_+-=`~[{]}\\|;:'\",<.>/?";
      for (let character of nonAlphaNumeric) {
        const res = await request(APP).post("/api/login").send({
          username: character,
          password: "Seansean!",
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors).toContain(
          '"username" must only contain alpha-numeric characters'
        );
      }
    });

    it("should validate password field", async () => {
      const res = await request(APP).post("/api/login").send({
        username: "sean",
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("errors");
      expect(res.body.errors).toContain('"password" is required');
    });
  });
});
