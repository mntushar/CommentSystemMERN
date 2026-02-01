import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addComment } from "../store/commentManager";
import { userAuth } from "../hooks/userAuth";

// eslint-disable-next-line react/prop-types
export default function CommentForm({ pageId, parentId = null, onDone }) {
  const { isAuthenticated } = userAuth();
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      setError("You must be logged in to comment.");
      return;
    }

    if (!content.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    const res = await dispatch(addComment({ pageId, content, parentId }));
    if (res.meta.requestStatus === "fulfilled") {
      setContent("");
      onDone?.();
    }
  }

  return (
    <div className="card">
      <form onSubmit={submit} className="form">
        <label>{parentId ? "Reply" : "Add a comment"}</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder={
            isAuthenticated ? "Write something..." : "Login to comment"
          }
          disabled={!isAuthenticated}
        />
        {error ? <p className="error">{error}</p> : null}
        <button type="submit" disabled={!isAuthenticated}>
          {parentId ? "Reply" : "Post"}
        </button>
      </form>
    </div>
  );
}
