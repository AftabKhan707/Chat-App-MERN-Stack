import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with better naming
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileExtension = path.extname(sanitizedName);
    const baseName = path.basename(sanitizedName, fileExtension);
    cb(null, baseName + "-" + uniqueSuffix + fileExtension);
  },
});

// Enhanced file filter with better validation
const fileFilter = (req, file, cb) => {
  // Allow common file types (you can customize this)
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "audio/mpeg",
    "audio/wav",
    "audio/mp3",
    "video/mp4",
    "video/avi",
    "video/quicktime",
    "application/zip",
    "application/x-rar-compressed",
    "application/x-7z-compressed",
  ];

  // Additional validation for PDF files
  if (file.mimetype === "application/pdf") {
    // Check if the file extension is actually .pdf
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (fileExtension !== ".pdf") {
      cb(new Error("PDF file must have .pdf extension"), false);
      return;
    }
  }

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Please upload a supported file format.`
      ),
      false
    );
  }
};

// Configure multer with better error handling
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    fieldSize: 50 * 1024 * 1024, // 50MB field size limit
  },
  preservePath: false, // Prevent path traversal attacks
});

// File validation function to check integrity after upload
export const validateUploadedFile = (filePath, originalMimeType) => {
  try {
    // Check if file exists and is readable
    if (!fs.existsSync(filePath)) {
      throw new Error("Uploaded file not found");
    }

    const stats = fs.statSync(filePath);

    // Check if file is not empty
    if (stats.size === 0) {
      throw new Error("Uploaded file is empty");
    }

    // For PDF files, do additional validation
    if (originalMimeType === "application/pdf") {
      const buffer = fs.readFileSync(filePath, { start: 0, end: 7 });
      const pdfHeader = buffer.toString("ascii", 0, 4);

      if (pdfHeader !== "%PDF") {
        throw new Error("Invalid PDF file - corrupted or incorrect format");
      }
    }

    return true;
  } catch (error) {
    throw new Error(`File validation failed: ${error.message}`);
  }
};

export { upload };
