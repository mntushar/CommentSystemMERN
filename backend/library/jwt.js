import jwt from "jsonwebtoken";

export function signToken(payload) {
  const expiresIn = process.env.JWT_EXPIRES_IN || "1h";
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
