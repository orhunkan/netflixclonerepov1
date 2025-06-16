import jwt, { SignOptions } from "jsonwebtoken";

const secret = process.env.JWT_SECRET as string;

export function signJwt(payload: object, options?: SignOptions) {
  return jwt.sign(payload, secret, {
    expiresIn: "7d",
    ...(options || {}),
  });
}

export function verifyJwt<T>(token: string): T | null {
  try {
    return jwt.verify(token, secret) as T;
  } catch {
    return null;
  }
}
