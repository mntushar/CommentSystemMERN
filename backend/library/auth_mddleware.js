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
      const user = await userRepo.findById(decoded.userId);
      if (!user) return res.status(401).json({ message: "Invalid token" });

      req.user = { id: user._id, username: user.userName, email: user.email };
      next();
    } catch (e) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
}
