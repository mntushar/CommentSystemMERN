/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { useSelector } from "react-redux";

export default function SortBar({ sort, onChange }) {
  const comments = useSelector((state) => state.comments);

  return (
    <div className="sort-menu">
      <div className="sortbar">
        <label>Sort:</label>
        <select value={sort} onChange={(e) => onChange(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="most_liked">Most liked</option>
          <option value="most_disliked">Most disliked</option>
        </select>
      </div>

      <div className="total-comment">
        Total Comment: {comments.totalComment}
      </div>
    </div>
  );
}
