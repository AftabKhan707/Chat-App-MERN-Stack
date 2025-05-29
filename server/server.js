import { app, server } from "./socket/socket.js";
import express from "express";
import { connectDB } from "./db/connection1.db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

connectDB();

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      // List of allowed origins
      const allowedOrigins = [
        process.env.CLIENT_URL,
        "https://chat-app-mern-stack-3p3t.onrender.com",
        "http://localhost:3000",
        "http://localhost:5173",
      ].filter(Boolean); // Remove any undefined values

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Serve static files (uploaded files)
app.use("/api/files", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;

// routes
import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";

// Health check route for debugging
app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "OK",
    environment: process.env.NODE_ENV,
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasCookieExpires: !!process.env.COOKIE_EXPIRES,
    clientUrl: process.env.CLIENT_URL,
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

// middlwares
import { errorMiddleware } from "./middlewares/error.middlware.js";
app.use(errorMiddleware);

// code for deployment
if (process.env.NODE_ENV === "production") {
  const dirPath = path.resolve();
  app.use(express.static("./Frontend/dist"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(dirPath, "./Frontend/dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`your server listening at port ${PORT}`);
});
