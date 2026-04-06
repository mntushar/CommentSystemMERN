/* eslint-disable react/react-in-jsx-scope */
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { userAuth } from "../hooks/userAuth";
import { logout } from "../store/authManager";

export default function Navbar() {
  const { isAuthenticated, user } = userAuth();
  const dispatch = useDispatch();

  return (
    <div className="nav">
      <div className="nav-inner">
        <Link
          className="brand"
          to={isAuthenticated ? "/page/demo-page" : "/login"}
        >
          CommentSystem
        </Link>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <span className="muted">Hi, {user.username}</span>
              <button onClick={() => dispatch(logout())}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
