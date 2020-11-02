import app from "../Server";
import request from "supertest";
import sequelize from "@daos/DBInstance";
import { deleteAllTokens } from "@daos/Tokens";
import { deleteAllUsers } from "@daos/Users";
import { getAuthenticatedUserCookie } from "@shared/test.config";

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
  await sequelize.query(`DROP VIEW IF EXISTS leaderboard`);
  await sequelize.query(`CREATE VIEW leaderboard AS
	SELECT
		users.username,
		COALESCE(SUM(activityLog.points), 0) AS score,
		ROW_NUMBER() OVER(ORDER BY COALESCE(SUM(activityLog.points), 0) DESC) AS rank
	FROM
		users

	left join (
		/* 1 point for any IOU owed to you */
		SELECT
			ious.receiver AS username,
			1 AS points
		FROM
			ious
		UNION

		/* 2 points for any IOU you have repaid */
		SELECT
			ious.giver AS username,
			2 AS points
		FROM
			ious
		WHERE
			ious.is_claimed = 1
		UNION

		/* 1 point for any request you have published */
		SELECT
			requests.author AS username,
			1 AS points
		FROM
			requests
		UNION

		/* 3 points for any request you have completed */
		SELECT
			requests.completed_by AS username,
			3 AS points
		FROM
			requests
		WHERE
			requests.is_completed = 1
	) activityLog
		ON users.username = activityLog.username

	GROUP BY
		users.username`);

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
