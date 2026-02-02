import bcrypt from "bcryptjs";
import { signToken } from "../library/jwt.js";
import { UserRepository } from "../repository/user.js";

export class AuthService {
  constructor() {
    this.userRepo = new UserRepository();
  }

  async register({ userName, email, password }) {
    const existingEmail = await this.userRepo.findByEmail(email);
    if (existingEmail)
      throw Object.assign(new Error("Email already in use"), { status: 409 });

    const existinguserName = await this.userRepo.findByUsername(userName);
    if (existinguserName)
      throw Object.assign(new Error("userName already in use"), {
        status: 409,
      });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.userRepo.create({
      userName,
      email,
      password: passwordHash,
    });

    const token = signToken({ id: user._id, username: userName, email: email });
    return {
      user: { id: user._id, userName: user.userName, email: user.email },
      token,
    };
  }

  async login({ email, password }) {
    const user = await this.userRepo.findByEmail(email);
    if (!user)
      throw Object.assign(new Error("Invalid credentials"), { status: 401 });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      throw Object.assign(new Error("Invalid credentials"), { status: 401 });

    const token = signToken({ id: user._id, username: user.userName, email: user.email });
    return {
      user: { id: user._id, userName: user.userName, email: user.email },
      token,
    };
  }
}
