import { Comment } from "./models/comment.js";

export class CommentRepository {
  async create(data) {
    return await Comment.create(data);
  }

  async findById(id) {
    return await Comment.findById(id);
  }

  async updateContentById(id, content) {
    return await Comment.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    ).populate("author", "username");
  }

  async deleteById(id) {
    return await Comment.findByIdAndDelete(id);
  }

  async listByPageId({ pageId, sort, page, limit }) {
    const skip = (page - 1) * limit;

    let sortStage = { createdAt: -1 };
    if (sort === "most_liked") sortStage = { likeCount: -1, createdAt: -1 };
    if (sort === "most_disliked") sortStage = { dislikeCount: -1, createdAt: -1 };

    const pipeline = [
      { $match: { pageId } },
      {
        $addFields: {
          likeCount: { $size: "$likes" },
          dislikeCount: { $size: "$dislikes" },
        },
      },
      { $sort: sortStage },
      { $skip: skip },
      { $limit: limit },
    ];

    const [items, total] = await Promise.all([
      Comment.aggregate(pipeline),
      Comment.countDocuments({ pageId })
    ]);

    const ids = items.map((x) => x._id);
    const populated = await Comment.find({ _id: { $in: ids } })
      .populate("author", "username")
      .lean()

    const byId = new Map(populated.map((p) => [String(p._id), p]));
    const ordered = items.map((x) => byId.get(String(x._id))).filter(Boolean);

    return { items: ordered, total };
  }
}
