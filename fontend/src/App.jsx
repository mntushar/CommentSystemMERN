/* eslint-disable react/react-in-jsx-scope */
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CommentPage from "./pages/CommentPage";
import { userAuth } from "./hooks/userAuth";

function App() {
  const { isAuthenticated } = userAuth();

  return (
    <div className="app">
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* restrict page */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/page/demo-page" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/page/:pageId"
            element={
              isAuthenticated ? (
                <CommentPage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
