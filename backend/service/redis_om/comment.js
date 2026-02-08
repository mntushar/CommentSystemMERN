import { CommentRedisRepository } from "../../repository/redis_om/comment.js";

export class CommentRedisService {
  constructor() {
    this.commentRepo = new CommentRedisRepository();
  }

  async addComment(data) {
    return await this.commentRepo.create(data);
  }

  async findByPageId(pageId) {
    return await this.commentRepo.findByPageId(pageId);
  }

  async updateContentByPageId(pageId, content) {
    return await this.commentRepo.updateContentByPageId(pageId, content);
  }
}
