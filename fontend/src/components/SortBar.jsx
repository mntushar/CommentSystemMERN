/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
export default function SortBar({ sort, onChange }) {
  return (
    <div className="sortbar">
      <label>Sort:</label>
      <select value={sort} onChange={(e) => onChange(e.target.value)}>
        <option value="newest">Newest</option>
        <option value="most_liked">Most liked</option>
        <option value="most_disliked">Most disliked</option>
      </select>
    </div>
  );
}
