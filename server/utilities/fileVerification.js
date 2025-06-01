import fs from "fs";
import path from "path";
import crypto from "crypto";

/**
 * Utility functions for file verification and debugging
 */

/**
 * Calculate MD5 hash of a file
 */
export const calculateFileHash = (filePath) => {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash("md5");
    hashSum.update(fileBuffer);
    return hashSum.digest("hex");
  } catch (error) {
    throw new Error(`Failed to calculate hash: ${error.message}`);
  }
};

/**
 * Verify PDF file integrity
 */
export const verifyPdfFile = (filePath) => {
  try {
    const buffer = fs.readFileSync(filePath, { start: 0, end: 1024 }); // Read first 1KB
    const content = buffer.toString("binary");

    // Check PDF header
    if (!content.startsWith("%PDF-")) {
      return {
        valid: false,
        error: "Invalid PDF header - file may be corrupted",
      };
    }

    // Check for PDF footer (EOF marker)
    const fullBuffer = fs.readFileSync(filePath);
    const fullContent = fullBuffer.toString("binary");

    if (!fullContent.includes("%%EOF")) {
      return {
        valid: false,
        error: "PDF EOF marker not found - file may be truncated",
      };
    }

    return {
      valid: true,
      size: fullBuffer.length,
      header: content.substring(0, 20),
    };
  } catch (error) {
    return {
      valid: false,
      error: `PDF verification failed: ${error.message}`,
    };
  }
};

/**
 * Get detailed file information
 */
export const getFileInfo = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    const ext = path.extname(filePath).toLowerCase();

    let verification = { valid: true };

    // Specific verification for PDF files
    if (ext === ".pdf") {
      verification = verifyPdfFile(filePath);
    }

    return {
      exists: true,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      extension: ext,
      hash: calculateFileHash(filePath),
      verification,
    };
  } catch (error) {
    return {
      exists: false,
      error: error.message,
    };
  }
};

/**
 * Verify uploaded files in the uploads directory
 */
export const verifyUploadsDirectory = (uploadsPath) => {
  try {
    const files = fs.readdirSync(uploadsPath);
    const results = [];

    for (const filename of files) {
      if (filename === ".gitkeep") continue;

      const filePath = path.join(uploadsPath, filename);
      const info = getFileInfo(filePath);

      results.push({
        filename,
        ...info,
      });
    }

    return results;
  } catch (error) {
    throw new Error(`Failed to verify uploads directory: ${error.message}`);
  }
};
