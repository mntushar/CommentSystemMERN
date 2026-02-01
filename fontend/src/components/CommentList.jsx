/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import CommentItem from "./CommentItem";

export default function CommentList({ comments }) {
  // one-level reply grouping
  const parents = comments.filter((c) => !c.parentId);
  const repliesByParent = new Map();

  for (const c of comments) {
    if (c.parentId) {
      const k = String(c.parentId);
      if (!repliesByParent.has(k)) repliesByParent.set(k, []);
      repliesByParent.get(k).push(c);
    }
  }

  return (
    <div className="comment-list">
      {parents.map((c) => (
        <div key={c._id}>
          <CommentItem comment={c} />
          {(repliesByParent.get(String(c._id)) || []).map((r) => (
            <div key={r._id} className="reply">
              <CommentItem comment={r} isReply />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
