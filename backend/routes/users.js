import express from 'express';
import { UserService } from '../service/users.js';
import Errors from '../library/errors.js';

const router = express.Router();
const service = new UserService();

router.get('/', async (req, res) => {
  try {
    const users = await service.readUsers();
    res.json(users);
  } catch (error) {
    return Errors.throwError(error, res);
  }
});

router.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      throw new Errors('Name is required', 400);
    }

    const newUser = {
      name: name,
    };
    
    const result = await service.writeUsers(newUser);

    res.status(201).json(result);
  } catch (error) {
    return Errors.throwError(error, res);
  }
});

export default router;