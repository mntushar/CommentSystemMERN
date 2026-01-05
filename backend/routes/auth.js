import express from "express";
import Errors from "../library/errors.js";
import { AuthService } from "../service/auth.js";
import { registerSchema } from "../repository/view_model/register_schema.js";
import { loginSchema } from "../repository/view_model/login_schema.js";

const router = express.Router();
const service = new AuthService();

router.post("/register", async (req, res) => {
  try {
    const body = registerSchema.parse(req.body);
    const result = await service.register(body);
    res.json(result);
  } catch (error) {
    return Errors.throwError(error, res);
  }
});

router.post("/login", async (req, res) => {
  try {
    const body = loginSchema.parse(req.body);
    const result = await service.login(body);
    res.json(result);
  } catch (error) {
    return Errors.throwError(error, res);
  }
});

export default router;
