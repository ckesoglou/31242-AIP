import User from "../models/User";
import sequelize from "./DBInstance";

/*
 *  Leaderboard database view definition
 */

export const dropLeaderboardViewSQL = "DROP VIEW IF EXISTS leaderboard";

export const createLeaderboardViewSQL = `
  CREATE VIEW leaderboard AS
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

      /* 1 point for any request (offer) you have published */
      SELECT
        offers.author AS username,
        1 AS points
      FROM
        offers
      UNION

      /* 3 points for any request (offer) you have completed */
      SELECT
        offers.completed_by AS username,
        3 AS points
      FROM
        offers
      WHERE
        offers.is_completed = 1
    ) activityLog
      ON users.username = activityLog.username

    GROUP BY
      users.username
`;

/*
 *  Leaderboard CRUD operations
 */

export async function getScores(start = 0, limit = 25) {
  const scores = await sequelize.query("SELECT * FROM leaderboard");

  const trimmedScores = scores[0].slice(start, start + 9999); // TODO replace 9999 limit
  console.log(trimmedScores.length);

  return trimmedScores;
}

export async function getUserScores(user: User) {
  const [scores, metadata] = await sequelize.query(
    `SELECT rank, score from leaderboard WHERE username='${user.username}'`
  );
  return scores[0];
}
