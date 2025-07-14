import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export const generateAccessToken = (
  jwtPayload: JwtPayload,
  jwtSecret: string,
  jwtExpiresIn: string
) => {
  const accessToken = jwt.sign(jwtPayload, jwtSecret, {
    expiresIn: jwtExpiresIn,
  } as SignOptions);
  return accessToken;
};

export const verifyToken = (accessTokenPlayLoad: string, jwtSecret: string) => {
  const accessToken = jwt.verify(accessTokenPlayLoad, jwtSecret);
  return accessToken;
};
