import mongoose from "mongoose";
import {
  COMMENT_QUEUE_NAME,
  commentQueue,
} from "../library/job_queue/comment/comment_queues.js";
import { CommentRepository } from "../repository/comment.js";
import { CommentRedisService } from "./redis_om/comment.js";

export class CommentService {
  constructor() {
    this.commentRepo = new CommentRepository();
    this.commentReidsService = new CommentRedisService();
  }

  async addComment({ pageId, content, authorId, parentId = null }) {
    if (!content?.trim())
      throw Object.assign(new Error("Content is required"), { status: 400 });

    if (parentId) {
      const parent = await this.commentRepo.findById(parentId);
      if (!parent)
        throw Object.assign(new Error("Parent comment not found"), {
          status: 404,
        });
      if (parent.pageId !== pageId)
        throw Object.assign(new Error("Parent comment page mismatch"), {
          status: 400,
        });
    }

    const created = await this.commentRepo.create({
      pageId,
      content: content.trim(),
      author: authorId,
      parentId: parentId ? new mongoose.Types.ObjectId(parentId) : null,
    });

    return await this.commentRepo.findById(created._id);
  }

  async commentCaching({ pageId, authorId }) {
    const totalComment = await this.commentRepo.getTotalComment(pageId);
    
    let redisData = await this.commentReidsService.findByPageId(pageId);
    if (redisData) {
      redisData.total = totalComment;
      await this.commentReidsService.updateContentByPageId(pageId, redisData);

      return redisData;
    }

    redisData = await this.commentReidsService.addComment({
      pageId: pageId,
      authorId: authorId,
      total: totalComment,
    });

    return redisData;
  }

  async addCommentWithCach({ pageId, content, authorId, parentId = null }) {
    const result = await this.addComment({
      pageId,
      content,
      authorId,
      parentId,
    });

    await commentQueue.add(COMMENT_QUEUE_NAME, { pageId, authorId });
    return result;
  }

  async getComment(commentId) {
    return await this.commentRepo.findById(commentId);
  }

  async editComment({ commentId, content, userId }) {
    const comment = await this.commentRepo.findById(commentId);
    if (!comment)
      throw Object.assign(new Error("Comment not found"), { status: 404 });
    if (String(comment.author?._id ?? comment.author) !== String(userId))
      throw Object.assign(new Error("Not allowed"), { status: 403 });

    if (!content?.trim())
      throw Object.assign(new Error("Content is required"), { status: 400 });
    return await this.commentRepo.updateContentById(commentId, content.trim());
  }

  async deleteComment({ commentId, userId }) {
    const comment = await this.commentRepo.findById(commentId);
    if (!comment)
      throw Object.assign(new Error("Comment not found"), { status: 404 });
    if (String(comment.author?._id ?? comment.author) !== String(userId))
      throw Object.assign(new Error("Not allowed"), { status: 403 });

    await this.commentRepo.deleteById(commentId);
    return comment;
  }

  async likeOnce({ commentId, userId }) {
    const comment = await this.commentRepo.findById(commentId);
    if (!comment)
      throw Object.assign(new Error("Comment not found"), { status: 404 });

    const alreadyLiked = comment.likes.some(
      (id) => String(id) === String(userId),
    );
    const alreadyDisliked = comment.dislikes.some(
      (id) => String(id) === String(userId),
    );
    if (alreadyLiked || alreadyDisliked)
      throw Object.assign(new Error("You already reacted to this comment"), {
        status: 400,
      });

    comment.likes.push(userId);
    await comment.save();
    return await this.commentRepo.findById(commentId);
  }

  async dislikeOnce({ commentId, userId }) {
    const comment = await this.commentRepo.findById(commentId);
    if (!comment)
      throw Object.assign(new Error("Comment not found"), { status: 404 });

    const alreadyLiked = comment.likes.some(
      (id) => String(id) === String(userId),
    );
    const alreadyDisliked = comment.dislikes.some(
      (id) => String(id) === String(userId),
    );
    if (alreadyLiked || alreadyDisliked)
      throw Object.assign(new Error("You already reacted to this comment"), {
        status: 400,
      });

    comment.dislikes.push(userId);
    await comment.save();
    return await this.commentRepo.findById(commentId);
  }

  async list({ pageId, sort, page, limit }) {
    return await this.commentRepo.listByPageId({ pageId, sort, page, limit });
  }
}
