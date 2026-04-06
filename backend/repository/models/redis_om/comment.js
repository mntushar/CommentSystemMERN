import { Repository, Schema } from "redis-om";
import { redisOm } from "../../db/redis_om_connection.js";

const schema = new Schema(
  "Comment",
  {
    pageId: { type: 'string' },
    authorId: { type: 'string' },
    total: { type: 'number' },
  },
  {
    dataStructure: "HASH",
  },
);

// @ts-ignore
export const Comment = new Repository(schema, redisOm)