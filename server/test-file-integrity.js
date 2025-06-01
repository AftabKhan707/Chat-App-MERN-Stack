import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("🔍 File Integrity Test Script");
console.log("==============================\n");

// Check uploads directory
const uploadsDir = path.join(__dirname, "uploads");
console.log(`📁 Checking uploads directory: ${uploadsDir}`);

try {
  const files = fs.readdirSync(uploadsDir);
  const pdfFiles = files.filter((file) => file.endsWith(".pdf"));

  console.log(`Found ${pdfFiles.length} PDF files:\n`);

  for (const filename of pdfFiles) {
    const filePath = path.join(uploadsDir, filename);
    console.log(`📄 Testing file: ${filename}`);

    try {
      const stats = fs.statSync(filePath);
      console.log(`   Size: ${stats.size} bytes`);

      // Check PDF header
      const buffer = fs.readFileSync(filePath, { start: 0, end: 10 });
      const header = buffer.toString("ascii");

      if (header.startsWith("%PDF-")) {
        console.log(`   ✅ Valid PDF header: ${header.trim()}`);

        // Check for EOF marker
        const fullBuffer = fs.readFileSync(filePath);
        const content = fullBuffer.toString("binary");

        if (content.includes("%%EOF")) {
          console.log(`   ✅ Valid PDF structure (EOF marker found)`);
        } else {
          console.log(`   ⚠️  PDF may be truncated (no EOF marker)`);
        }
      } else {
        console.log(`   ❌ Invalid PDF header: ${header}`);
      }
    } catch (error) {
      console.log(`   ❌ Error reading file: ${error.message}`);
    }

    console.log("");
  }

  // Test file serving URL construction
  console.log("🌐 Testing file URL construction:");
  if (pdfFiles.length > 0) {
    const testFile = pdfFiles[0];
    const fileUrl = `/api/files/${testFile}`;
    console.log(`   File URL: http://localhost:5000${fileUrl}`);
    console.log(
      `   Try opening this URL in your browser to test file serving\n`
    );
  }
} catch (error) {
  console.error("❌ Error accessing uploads directory:", error.message);
}

console.log("💡 Debugging Tips:");
console.log("1. Open http://localhost:5173 in your browser");
console.log("2. Try uploading a small PDF file");
console.log("3. Check the browser Network tab for any errors");
console.log("4. Try downloading the file and opening it");
console.log("5. If issues persist, check CORS and environment variables");
