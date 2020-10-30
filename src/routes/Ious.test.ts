/// <reference types="jest" />
const request = require("supertest");
// const app = require("../Server");
const APP = "https://ioweyou.tech";

// import sum from "./functions";
// test("Adds 2 + 2 to equal 4", () => {
//   expect(sum(2, 2)).toBe(4);
// });

describe("Login endpoint", () => {
  it("should login user with correct credentials", async () => {
    const res = await request(APP).post("/api/login").send({
      username: "sean",
      password: "Seansean!",
    });
    expect(res.statusCode).toEqual(200);
  });

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

  it("should validate username field length", async () => {
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

  it("should validate username field valid characters", async () => {
    const res = await request(APP).post("/api/login").send({
      username: "sean#",
      password: "Seansean!",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toContain(
      '"username" must only contain alpha-numeric characters'
    );
  });
});
// describe("Ious Endpoints", () => {
//   it("should get owed ious", async () => {
//     const res = await request(app).get("/api/iou/owed");
//     expect(res.statusCode).toEqual(200);
//     // expect(res.body).toHaveProperty("post");
//   });
// });
