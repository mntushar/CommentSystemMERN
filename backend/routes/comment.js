import express from "express";
import { authRequired } from "../library/auth_mddleware.js";
import Errors from "../library/errors.js";
import { eventBus } from "../library/realtime/eventBus.js";
import { validateObjectId } from "../library/validate_objectId.js";
import { commentAddSchema } from "../repository/view_model/comment_add_schema.js";
import { commentEditSchema } from "../repository/view_model/comment_edit_schema.js";
import { CommentService } from "../service/comment.js";

export default function commentRoutes() {
  const router = express.Router();
  const service = new CommentService();

  router.post("/", authRequired(), async (req, res) => {
    try {
      const body = commentAddSchema.parse(req.body);

      const created = await service.addCommentWithCach({
        pageId: body.pageId,
        content: body.content,
        parentId: body.parentId || null,
        // @ts-ignore
        authorId: req.user.id,
      });

      eventBus.emit("comment.created", created);

      res.status(201).json(created);
    } catch (error) {
      return Errors.throwError(error, res);
    }
  });

  router.get("/", authRequired(), async (req, res) => {
    try {
      const pageId = String(req.query.pageId || "");
      if (!pageId)
        return res.status(400).json({ message: "pageId is required" });

      const sort = String(req.query.sort || "newest");
      // @ts-ignore
      const page = Math.max(1, parseInt(req.query.page || "1", 10));
      const limit = Math.min(
        50,
        // @ts-ignore
        Math.max(1, parseInt(req.query.limit || "10", 10)),
      );

      const data = await service.list({ pageId, sort, page, limit });
      res.json({ ...data, page, limit, sort });
    } catch (error) {
      return Errors.throwError(error, res);
    }
  });

  router.put(
    "/:id",
    authRequired(),
    validateObjectId("id"),
    async (req, res) => {
      try {
        const body = commentEditSchema.parse(req.body);
        const updated = await service.editComment({
          commentId: req.params.id,
          content: body.content,
          // @ts-ignore
          userId: req.user.id,
        });

        eventBus.emit("comment.updated", updated);

        res.json(updated);
      } catch (error) {
        return Errors.throwError(error, res);
      }
    },
  );

  router.delete(
    "/:id",
    authRequired(),
    validateObjectId("id"),
    async (req, res) => {
      try {
        const deletedInfo = await service.deleteComment({
          commentId: req.params.id,
          // @ts-ignore
          userId: req.user.id,
        });

        eventBus.emit("comment.deleted", {
          id: deletedInfo._id,
          pageId: deletedInfo.pageId,
        });

        res.json(deletedInfo);
      } catch (error) {
        return Errors.throwError(error, res);
      }
    },
  );

  router.post(
    "/:id/like",
    authRequired(),
    validateObjectId("id"),
    async (req, res) => {
      try {
        const updated = await service.likeOnce({
          commentId: req.params.id,
          // @ts-ignore
          userId: req.user.id,
        });

        eventBus.emit("comment.reaction", { comment: updated });

        res.json(updated);
      } catch (error) {
        return Errors.throwError(error, res);
      }
    },
  );

  router.post(
    "/:id/dislike",
    authRequired(),
    validateObjectId("id"),
    async (req, res) => {
      try {
        const updated = await service.dislikeOnce({
          commentId: req.params.id,
          // @ts-ignore
          userId: req.user.id,
        });

        eventBus.emit("comment.reaction", { comment: updated });

        res.json(updated);
      } catch (error) {
        return Errors.throwError(error, res);
      }
    },
  );

  return router;
}
