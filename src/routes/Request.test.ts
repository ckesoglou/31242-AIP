import app from "../Server";
import request from "supertest";
import sequelize from "../daos/DBInstance";
import { deleteAllOffers } from "../daos/Offers";
import { getAuthenticatedUserCookie } from "../shared/test.config";
import { v4 as uuid } from "uuid";
import { createItem } from "../daos/Items";

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
const ITEMID = uuid();
let cookie = "";
let testRequestId = "";

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

  // Create item in database
  await createItem({ id: ITEMID, display_name: "Coffee" });
});

beforeEach(async () => {
  cookie = await getAuthenticatedUserCookie();
  // Create test request
  const res = await request(app)
    .post("/api/requests")
    .send({
      details: "Test request",
      item: ITEMID,
    })
    .set("Cookie", cookie);
  testRequestId = res.body.id;
});

afterEach(async () => {
  await deleteAllOffers();
});

afterAll(async () => {
  await sequelize.drop();
});

describe("Request endpoint", () => {
  describe("Create requests", () => {
    it("should create a new request", async () => {
      const res = await request(app)
        .post("/api/requests")
        .send({
          details: "Clean my fridge",
          item: ITEMID,
        })
        .set("Cookie", cookie);
      testRequestId = res.body.id;
      expect(res.status).toEqual(201);
      expect(res.body).toHaveProperty("id");
    });

    it("should validate authenticated user creating request", async () => {
      const res = await request(app).post("/api/requests").send({
        details: "Clean my fridge",
        item: ITEMID,
      });
      testRequestId = res.body.id;
      expect(res.status).toEqual(401);
    });
  });

  describe("Get requests", () => {
    it("should return all requests", async () => {
      const res = await request(app).get("/api/requests");
      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(1);
      expect(res.body[0]).toHaveProperty("id");
      expect(res.body[0]).toHaveProperty("author");
      expect(res.body[0]).toHaveProperty("completed_by");
      expect(res.body[0]).toHaveProperty("proof_of_completion");
      expect(res.body[0]).toHaveProperty("rewards");
      expect(res.body[0]).toHaveProperty("details");
      expect(res.body[0]).toHaveProperty("created_time");
      expect(res.body[0]).toHaveProperty("completion_time");
      expect(res.body[0]).toHaveProperty("is_completed");
    });

    it("should return request by requestID", async () => {
      const res = await request(app).get(`/api/request/${testRequestId}`);
      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("author");
      expect(res.body).toHaveProperty("completed_by");
      expect(res.body).toHaveProperty("proof_of_completion");
      expect(res.body).toHaveProperty("rewards");
      expect(res.body).toHaveProperty("details");
      expect(res.body).toHaveProperty("created_time");
      expect(res.body).toHaveProperty("completion_time");
      expect(res.body).toHaveProperty("is_completed");
    });
  });

  describe("Delete request", () => {
    it("should delete request by requestID", async () => {
      const res = await request(app)
        .delete(`/api/request/${testRequestId}`)
        .set("Cookie", cookie);
      expect(res.status).toEqual(200);
    });
  });

  describe("Complete request", () => {
    it("should validate proof of completion file", async () => {
      const res = await request(app)
        .put(`/api/request/${testRequestId}/complete`)
        .set("Cookie", cookie);
      expect(res.status).toEqual(400);
      expect(res.body).toHaveProperty("errors");
      expect(res.body.errors).toContain(
        "Image was not provided or is too large (only png or jpeg up to 5 MB)."
      );
    });

    it("should complete request by requestID", async () => {
      const res = await request(app)
        .put(`/api/request/${testRequestId}/complete`)
        .attach("proof", "react/public/iou-logo.png")
        .set("Cookie", cookie);
      expect(res.status).toEqual(403);
      expect(res.body).toHaveProperty("errors");
      expect(res.body.errors).toContain(
        "Not authorised to complete this request (you are the owner of it or the only one offering rewards)."
      );
    });

    it("should complete request by requestID", async () => {
      // Login as TESTUSER2 to complete request
      const resSignUp = await request(app)
        .post("/api/signup")
        .send({
          username: `${TESTUSER2.username}`,
          displayName: `${TESTUSER2.displayName}`,
          password: `${TESTUSER2.password}`,
        });
      cookie = resSignUp.headers["set-cookie"];

      const res = await request(app)
        .put(`/api/request/${testRequestId}/complete`)
        .attach("proof", "react/public/iou-logo.png")
        .set("Cookie", cookie);
      expect(res.status).toEqual(200);
    });
  });
  describe("Rewards", () => {
    it("should return rewards on request by requestID", async () => {
      const res = await request(app).get(
        `/api/request/${testRequestId}/rewards`
      );
      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(1);
      expect(res.body[0]).toHaveProperty("id");
      expect(res.body[0]).toHaveProperty("giver");
      expect(res.body[0]).toHaveProperty("item");
    });

    it("should add new reward to request by requestID", async () => {
      const res = await request(app)
        .post(`/api/request/${testRequestId}/rewards`)
        .send({
          item: ITEMID,
        })
        .set("Cookie", cookie);
      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty("id");
    });

    it("should validate user when adding new reward", async () => {
      const res = await request(app)
        .post(`/api/request/${testRequestId}/rewards`)
        .send({
          item: ITEMID,
        });
      expect(res.status).toEqual(401);
      expect(res.body).toHaveProperty("errors");
      expect(res.body.errors).toContain("Not authenticated.");
    });

    it("should return rewards on request by requestID", async () => {
      const resRequest = await request(app).get(
        `/api/request/${testRequestId}`
      );
      const testRewardId = resRequest.body.rewards[0].id;
      const res = await request(app).get(
        `/api/request/${testRequestId}/reward/${testRewardId}`
      );
      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("giver");
      expect(res.body).toHaveProperty("item");
      expect(res.body.id).toEqual(testRewardId);
    });

    it("should validate user deleting reward on request", async () => {
      const resRequest = await request(app).get(
        `/api/request/${testRequestId}`
      );
      const testRewardId = resRequest.body.rewards[0].id;
      const res = await request(app).delete(
        `/api/request/${testRequestId}/reward/${testRewardId}`
      );
      expect(res.status).toEqual(401);
    });

    it("should delete reward on request", async () => {
      const resRequest = await request(app).get(
        `/api/request/${testRequestId}`
      );
      const testRewardId = resRequest.body.rewards[0].id;
      const res = await request(app)
        .delete(`/api/request/${testRequestId}/reward/${testRewardId}`)
        .set("Cookie", cookie);
      expect(res.status).toEqual(200);
    });
  });
});
