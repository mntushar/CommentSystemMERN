import z from "zod";

export const commentRefreshSchema = z.object({
  pageId: z.string().min(1),
  authorId: z.string(),
  total: z.number(),
});
