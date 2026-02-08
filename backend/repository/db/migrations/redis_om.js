import { connectRedis } from "../redis_om_connection.js";
import { Comment } from "../../models/redis_om/comment.js";

async function main() {
  await connectRedis();

  await Comment.createIndex();

  console.log("✅ redis-om index successfully");
}

main().catch((err) => {
  console.error("❌ redis-om failed:", err);
  process.exit(1);
});
