import { verifyHmacSignature } from "./hmac.js";
import { verifyToken } from "./jwt.js";

export function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Missing token" });

    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ message: "Invalid token" });

    // @ts-ignore
    req.user = {
      // @ts-ignore
      id: decoded.id,
      // @ts-ignore
      username: decoded.username,
      // @ts-ignore
      email: decoded.email,
    };
    next();
  } catch (e) {
    throw e;
  }
}

export function socketAuthRequired(token) {
  try {
    const decoded = verifyToken(token);
    if (!decoded) throw Error("Invalid token");
    // @ts-ignore
    return { id: decoded.id, username: decoded.username, email: decoded.email };
  } catch (e) {
    throw e;
  }
}

export const hmacAuthRequired = (req, res, next) => {
  try {
    const signature = req.headers["x-signature"];

    if (!signature) {
      return res.status(401).json({ message: "Missing signature" });
    }

    const bodyString = req.rawBody || JSON.stringify(req.body);

    const isValid = verifyHmacSignature(
      process.env.HMAC_SECRET,
      bodyString,
      signature,
    );

    if (!isValid) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    next();
  } catch (error) {
    throw error;
  }
};
