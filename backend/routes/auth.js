import express from "express";
import Errors from "../library/errors.js";
import { AuthService } from "../service/auth.js";
import { registerSchema } from "../repository/view_model/register_schema.js";

const router = express.Router();
const service = new AuthService();

router.post("/register", async (req, res, next) => {
  try {
    const body = registerSchema.parse(req.body);
    const result = await service.register(body);
    res.json(result);
  } catch (error) {
    return Errors.throwError(error, res);
  }
});

// router.post("/", async (req, res) => {
//   try {
//     const { name } = req.body;

//     if (!name) {
//       throw new Errors("Name is required", 400);
//     }

//     const newUser = {
//       name: name,
//     };

//     const result = await service.writeUsers(newUser);

//     res.status(201).json(result);
//   } catch (error) {
//     return Errors.throwError(error, res);
//   }
// });

export default router;
