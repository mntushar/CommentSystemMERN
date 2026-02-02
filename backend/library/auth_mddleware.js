import { UserRepository } from "../repository/user.js";
import { verifyToken } from "./jwt.js";

export function authRequired() {
  const userRepo = new UserRepository();

  return async function (req, res, next) {
    try {
      const header = req.headers.authorization || "";
      const token = header.startsWith("Bearer ") ? header.slice(7) : null;
      if (!token) return res.status(401).json({ message: "Missing token" });

      const decoded = verifyToken(token);
      if (!decoded) return res.status(401).json({ message: "Invalid token" });

      // @ts-ignore
      req.user = { id: decoded.id, username: decoded.username, email: decoded.email };
      next();
    } catch (e) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
}

export function socketAuthRequired(token) {
    try {
      const decoded = verifyToken(token);
      if (!decoded) throw Error('Invalid token');
      // @ts-ignore
      return{ id: decoded.id, username: decoded.username, email: decoded.email };
    } catch (e) {
      throw e;
    }
}
