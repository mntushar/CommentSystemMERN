/* eslint-disable react/react-in-jsx-scope */
// eslint-disable-next-line react/prop-types
export default function Pagination({ total, page, limit, onChange }) {
  const pages = Math.max(1, Math.ceil(total / limit));
  if (pages <= 1) return null;

  return (
    <div className="pagination">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Prev
      </button>
      <span className="muted">
        Page {page} / {pages}
      </span>
      <button disabled={page >= pages} onClick={() => onChange(page + 1)}>
        Next
      </button>
    </div>
  );
}
