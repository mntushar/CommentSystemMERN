import { useSelector } from "react-redux";

export function userAuth() {
  const { user, token } = useSelector((s) => s.auth);
  return { user, token, isAuthenticated: Boolean(user && token) };
}
