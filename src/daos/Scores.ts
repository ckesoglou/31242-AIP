import User from "@entities/User";
import { QueryTypes } from "sequelize/types";
import sequelize from "./DBInstance";

export async function getScores(start: number = 0, limit: number = 25) {
  const scores = await sequelize.query("SELECT * FROM leaderboard");

  const trimmedScores = scores[0].slice(start, start + limit);
  console.log(trimmedScores.length);

  return trimmedScores;
}

export async function getUserScores(user: User) {
  const [scores, metadata] = await sequelize.query(
    `SELECT rank, score from leaderboard WHERE username='${user.username}'`
  );
  return scores[0];
}
