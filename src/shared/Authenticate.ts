import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";
import { createToken, getToken } from "@daos/Tokens";
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
      await serverRefreshToken.destroy();
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
