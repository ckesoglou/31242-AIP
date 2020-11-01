/// <reference types="jest" />

import {
  request,
  APP,
  TESTUSER2,
  ITEMID,
  getAuthenticatedUserCookie,
  deleteTestUsers,
  createTestUsers,
} from "@shared/test.config";

let cookie = "";
let IouOwedId = "";
let IouOweId = "";

beforeAll(async () => {
  await deleteTestUsers();
  await createTestUsers();
  cookie = await getAuthenticatedUserCookie();
});

afterAll(async () => {
  await deleteTestUsers();
});

describe("Ious endpoint", () => {
  describe("Validation", () => {
    it("should validate not authenticated user", async () => {
      const res = await request(APP)
        .post("/api/iou/owed")
        .send({
          username: `${TESTUSER2.username}`,
          item: ITEMID,
        });
      expect(res.statusCode).toEqual(401);
      expect(res.body.errors).toContain("Not authenticated");
    });
  });

  describe("Create Ious", () => {
    it("should create new Iou owed to authenticated user", async () => {
      const res = await request(APP)
        .post("/api/iou/owed")
        .field("username", TESTUSER2.username)
        .field("item", ITEMID)
        .attach("proof", "react/public/iou-logo.png")
        .set("Cookie", cookie);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("id");
      IouOwedId = res.body.id;
      console.log(`IouOwedId: ${IouOwedId}`);
    });

    it("should create new Iou authenticated user owes", async () => {
      const res = await request(APP)
        .post("/api/iou/owe")
        .send({
          username: `${TESTUSER2.username}`,
          item: ITEMID,
        })
        .set("Cookie", cookie);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("id");
      IouOweId = res.body.id;
      console.log(`IouOweId: ${IouOweId}`);
    });
  });

  describe("Get Ious", () => {
    it("should retrieve Iou owed to authenticated user", async () => {
      const res = await request(APP).get("/api/iou/owed").set("Cookie", cookie);
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(1);
      expect(res.body[0].id).toEqual(IouOwedId);
    });

    it("should retrieve Iou authenticated user owes", async () => {
      const res = await request(APP).get("/api/iou/owe").set("Cookie", cookie);
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(1);
      expect(res.body[0].id).toEqual(IouOweId);
    });
  });

  describe("Complete Ious", () => {
    it("should complete Iou owed to authenticated user", async () => {
      const res = await request(APP)
        .put(`/api/iou/owed/${IouOwedId}/complete`)
        .set("Cookie", cookie);
      expect(res.statusCode).toEqual(200);
    });

    it("should complete Iou authenticated user owes", async () => {
      const res = await request(APP)
        .put(`/api/iou/owe/${IouOweId}/complete`)
        .attach("proof", "react/public/iou-logo.png")
        .set("Cookie", cookie);
      expect(res.statusCode).toEqual(200);
    });
  });
});
