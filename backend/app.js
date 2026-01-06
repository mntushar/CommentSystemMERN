import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";
import commentRoutes from "./routes/comment.js";

export function createApp(io) {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      limit: 120,
    })
  );

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/comments", commentRoutes(io));

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "OK",
      message: "Backend server is running successfully!",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      error: "Route not found",
      message: `The route ${req.originalUrl} does not exist on this server`,
    });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      error: "Something went wrong!",
      message: err.message,
    });
  });

  return app;
}
