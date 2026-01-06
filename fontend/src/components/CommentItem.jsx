import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import {
  deleteComment,
  dislikeComment,
  editComment,
  likeComment,
} from "../store/commentManager";
import { userAuth } from "../hooks/userAuth";
import CommentForm from "./CommentForm";

export default function CommentItem({ comment, isReply = false }) {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = userAuth();

  const [editing, setEditing] = useState(false);
  const [replying, setReplying] = useState(false);
  const [draft, setDraft] = useState(comment.content);

  const isOwner = useMemo(() => {
    const authorId = comment.author?._id || comment.author;
    return user?.id && String(authorId) === String(user.id);
  }, [comment, user]);

  const likeCount = comment.likes?.length || 0;
  const dislikeCount = comment.dislikes?.length || 0;

  async function onSave() {
    const res = await dispatch(
      editComment({ id: comment._id, content: draft })
    );
    if (res.meta.requestStatus === "fulfilled") setEditing(false);
  }

  async function onDelete() {
    if (!confirm("Delete this comment?")) return;
    dispatch(deleteComment(comment._id));
  }

  async function onLike() {
    if (!isAuthenticated) return alert("Login required.");
    const res = await dispatch(likeComment(comment._id));
    if (res.meta.requestStatus === "rejected") alert(res.payload);
  }

  async function onDislike() {
    if (!isAuthenticated) return alert("Login required.");
    const res = await dispatch(dislikeComment(comment._id));
    if (res.meta.requestStatus === "rejected") alert(res.payload);
  }

  return (
    <div className={`comment ${isReply ? "comment-reply" : ""}`}>
      <div className="comment-top">
        <span className="author">@{comment.author?.username || "unknown"}</span>
        <span className="muted small">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
      </div>

      {editing ? (
        <div className="editbox">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
          />
          <div className="row">
            <button onClick={onSave}>Save</button>
            <button
              className="ghost"
              onClick={() => {
                setEditing(false);
                setDraft(comment.content);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="content">{comment.content}</p>
      )}

      <div className="comment-actions">
        <button onClick={onLike}>👍 {likeCount}</button>
        <button onClick={onDislike}>👎 {dislikeCount}</button>

        {!isReply ? (
          <button className="ghost" onClick={() => setReplying((v) => !v)}>
            Reply
          </button>
        ) : null}

        {isOwner ? (
          <>
            <button className="ghost" onClick={() => setEditing((v) => !v)}>
              Edit
            </button>
            <button className="danger ghost" onClick={onDelete}>
              Delete
            </button>
          </>
        ) : null}
      </div>

      {replying ? (
        <div className="replybox">
          <CommentForm
            pageId={comment.pageId}
            parentId={comment._id}
            onDone={() => setReplying(false)}
          />
        </div>
      ) : null}
    </div>
  );
}
