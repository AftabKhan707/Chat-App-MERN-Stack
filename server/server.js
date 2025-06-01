import { app, server } from "./socket/socket.js";
import express from "express";
import { connectDB } from "./db/connection1.db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

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

// Enhanced file serving with proper headers and validation
app.use("/api/files", (req, res, next) => {
  // Parse the URL to separate filename from query parameters
  const urlParts = req.url.substring(1).split("?"); // Remove leading slash and split by ?
  const filename = decodeURIComponent(urlParts[0]); // Get just the filename part
  const filePath = path.join(__dirname, "uploads", filename);

  // Add CORS headers for file serving
  res.header(
    "Access-Control-Allow-Origin",
    process.env.CLIENT_URL || "http://localhost:5173"
  );
  res.header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  // Get file stats
  const stats = fs.statSync(filePath);

  // Set proper headers based on file type
  const ext = path.extname(filename).toLowerCase();
  const contentTypes = {
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".mp4": "video/mp4",
    ".mp3": "audio/mpeg",
    ".zip": "application/zip",
    ".doc": "application/msword",
    ".docx":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };

  const contentType = contentTypes[ext] || "application/octet-stream";

  // Special handling for PDF files
  if (ext === ".pdf") {
    res.setHeader("Content-Type", "application/pdf");
    // Use attachment for download parameter, inline for regular viewing
    if (req.query.download === "true") {
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="' + path.basename(filename) + '"'
      );
    } else {
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + path.basename(filename) + '"'
      );
    }
    res.setHeader("X-Content-Type-Options", "nosniff");
  } else {
    res.setHeader("Content-Type", contentType);
    // For non-PDF files, always use attachment when download=true
    if (req.query.download === "true") {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${path.basename(filename)}"`
      );
    }
  }

  res.setHeader("Content-Length", stats.size);
  res.setHeader("Accept-Ranges", "bytes");
  res.setHeader("Cache-Control", "public, max-age=3600"); // 1 hour cache

  // Stream the file
  const fileStream = fs.createReadStream(filePath);
  fileStream.on("error", (err) => {
    console.error("File stream error:", err);
    res.status(500).json({ error: "File reading error" });
  });

  fileStream.pipe(res);
});

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
