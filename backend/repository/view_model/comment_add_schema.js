import z from "zod";

export const commentAddSchema = z.object({
  pageId: z.string().min(1),
  content: z.string().min(1).max(2000),
  parentId: z.string().optional().nullable(),
});
