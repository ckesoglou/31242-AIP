import app from "../Server";
import request from "supertest";
import sequelize from "@daos/DBInstance";
import { getAuthenticatedUserCookie } from "@shared/test.config";

const TESTUSER2 = {
  username: "testunittestusr2",
  displayName: "testunittestusr2",
  password: "Testunittestusr2!",
};
const ITEMID = "814120d4-5d3a-464b-8040-a9fecc107e54"; // Coffee

let cookie = "";
let IouOwedId = "";
let IouOweId = "";

beforeAll(async () => {
  await sequelize.drop();
  await sequelize.sync();
});

beforeEach(async () => {
  cookie = await getAuthenticatedUserCookie();
});

afterAll(async () => {
  await sequelize.drop();
});

describe("Ious endpoint", () => {
  describe("Validation", () => {
    it("should validate not authenticated user", async () => {
      const res = await request(app)
        .post("/api/iou/owed")
        .send({
          username: `${TESTUSER2.username}`,
          item: ITEMID,
        });
      expect(res.status).toEqual(401);
      expect(res.body.errors).toContain("Not authenticated");
    });
  });

  describe("Create Ious", () => {
    it("should create new Iou owed to authenticated user", async () => {
      const res = await request(app)
        .post("/api/iou/owed")
        .field("username", TESTUSER2.username)
        .field("item", ITEMID)
        .attach("proof", "react/public/iou-logo.png")
        .set("Cookie", cookie);
      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty("id");
      IouOwedId = res.body.id;
    });

    it("should create new Iou authenticated user owes", async () => {
      const res = await request(app)
        .post("/api/iou/owe")
        .send({
          username: `${TESTUSER2.username}`,
          item: ITEMID,
        })
        .set("Cookie", cookie);
      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty("id");
      IouOweId = res.body.id;
    });
  });

  describe("Get Ious", () => {
    it("should retrieve Iou owed to authenticated user", async () => {
      const res = await request(app).get("/api/iou/owed").set("Cookie", cookie);
      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(1);
      expect(res.body[0].id).toEqual(IouOwedId);
    });

    it("should retrieve Iou authenticated user owes", async () => {
      const res = await request(app).get("/api/iou/owe").set("Cookie", cookie);
      expect(res.status).toEqual(200);
      expect(res.body.length).toEqual(1);
      expect(res.body[0].id).toEqual(IouOweId);
    });
  });

  describe("Complete Ious", () => {
    it("should complete Iou owed to authenticated user", async () => {
      const res = await request(app)
        .put(`/api/iou/owed/${IouOwedId}/complete`)
        .set("Cookie", cookie);
      expect(res.status).toEqual(200);
    });

    it("should complete Iou authenticated user owes", async () => {
      const res = await request(app)
        .put(`/api/iou/owe/${IouOweId}/complete`)
        .attach("proof", "react/public/iou-logo.png")
        .set("Cookie", cookie);
      expect(res.status).toEqual(200);
    });
  });
});
