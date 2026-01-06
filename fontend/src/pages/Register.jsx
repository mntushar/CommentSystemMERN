import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/authManager";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { status, error } = useSelector((s) => s.auth);

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    const res = await dispatch(registerUser({ userName, email, password }));
    if (res.meta.requestStatus === "fulfilled") nav("/page/demo-page");
  }

  return (
    <div className="card">
      <h2>Register</h2>
      <form onSubmit={onSubmit} className="form">
        <label>Username</label>
        <input
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
          minLength={3}
        />

        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />

        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          minLength={6}
        />

        {error ? <p className="error">{error}</p> : null}

        <button disabled={status === "loading"} type="submit">
          {status === "loading" ? "Creating..." : "Create account"}
        </button>
      </form>

      <p className="muted">
        Have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
