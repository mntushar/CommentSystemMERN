import { EntityId } from "redis-om";
import Errors from "../../library/errors.js";
import { Comment } from "../models/redis_om/comment.js";

export class CommentRedisRepository {
  async create(data) {
    return await Comment.save(data);
  }

  async findByEntityId(entityId) {
    return await Comment.fetch(entityId);
  }

  async findByPageId(pageId) {
    return await Comment.search().where("pageId").equals(pageId).return.first();
  }

  async updateContentByPageId(pageId, content) {
    const data = await this.findByEntityId(content[EntityId]);
    if (!data) throw new Errors("Bad request", 400);

    Object.assign(data, content);
    return await Comment.save(data);
  }
}
