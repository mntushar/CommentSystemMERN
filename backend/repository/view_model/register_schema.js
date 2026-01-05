import z from "zod";

export const registerSchema = z.object({
  userName: z.string().min(3).max(30),
  email: z.email(),
  password: z.string().min(6).max(100),
});
