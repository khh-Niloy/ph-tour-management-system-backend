import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export const generateToken = (
  jwtPayload: JwtPayload,
  jwtSecret: string,
  jwtExpiresIn: string
) => {
  const accessToken = jwt.sign(jwtPayload, jwtSecret, {
    expiresIn: jwtExpiresIn,
  } as SignOptions);
  return accessToken;
};

export const verifyToken = (accessTokenPayLoad: string, jwtSecret: string) => {
  const accessToken = jwt.verify(accessTokenPayLoad, jwtSecret);
  return accessToken;
};