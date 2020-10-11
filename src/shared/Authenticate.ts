import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";
import { createToken, deleteToken, getToken } from "@daos/Tokens";
import { getUser } from "@daos/Users";
import { ITokenCookie } from "@entities/Token";
import User from "@entities/User";
import env from "../Environment";

export async function getAuthenticatedUser(req: Request, res: Response) {
  // 'any' is used since cookie parser doesn't extend request type definitions
  const clientTokensCookie = (<any>req).cookies["access_tokens"] ?? {};

  const clientAccessToken = verifyToken(clientTokensCookie.access_token);
  if (clientAccessToken) {
    return getUser(clientAccessToken.username);
  }

  const clientRefreshToken = verifyToken(clientTokensCookie.refresh_token);
  if (clientRefreshToken) {
    const user = await getUser(clientRefreshToken.username);
    const serverRefreshToken = await getToken(clientRefreshToken.token);
    if (user && serverRefreshToken) {
      // existing refresh token is removed before a new one is created
      await deleteToken(serverRefreshToken);
      await generateNewAuthenticationTokens(
        user,
        req.headers.host ?? "Unknown",
        res
      );

      return user;
    }
  }
}

function verifyToken(token: string) {
  try {
    return jwt.verify(token, env.jwt_secret) as ITokenCookie;
  } catch (err) {}
}

export async function generateNewAuthenticationTokens(
  user: User,
  deviceName: string,
  res: Response
) {
  const now = new Date();
  const monthFromNow = new Date();
  monthFromNow.setDate(monthFromNow.getDate() + 30);

  const serverRefreshToken = await createToken(
    uuid(),
    user.username,
    deviceName,
    now,
    monthFromNow
  );
  const clientRefreshToken = jwt.sign(
    {
      username: user.username,
      token: serverRefreshToken.refresh_token,
    },
    env.jwt_secret,
    { expiresIn: "30 days" }
  );
  const clientAccessToken = jwt.sign(
    {
      username: user.username,
      token: uuid(),
    },
    env.jwt_secret,
    { expiresIn: "30m" }
  );

  res.cookie("access_tokens", {
    access_token: clientAccessToken,
    refresh_token: clientRefreshToken,
  });
}
