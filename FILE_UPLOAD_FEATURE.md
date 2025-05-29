# File Upload Feature Implementation

## Overview

This document describes the comprehensive file upload feature added to the Gup-Shup Chat App. Users can now send files alongside text messages with real-time progress tracking and file type detection.

## Features

- ✅ Multiple file type support (images, documents, videos, audio, archives)
- ✅ File size validation (50MB limit)
- ✅ Real-time upload progress tracking
- ✅ Image preview functionality
- ✅ File download capability
- ✅ File type icons and visualization
- ✅ Drag & drop file selection
- ✅ Socket.io real-time file sharing

## Supported File Types

- **Images**: JPEG, JPG, PNG, GIF, WebP
- **Documents**: PDF, Word, Excel, PowerPoint, Text
- **Media**: MP3, WAV, MP4, AVI, QuickTime
- **Archives**: ZIP, RAR, 7Z

## Backend Changes

### 1. Dependencies Added

```json
{
  "multer": "^1.4.5-lts.1",
  "path": "^0.12.7"
}
```

### 2. File Upload Middleware (`middlewares/fileUpload.middleware.js`)

- Configures multer with disk storage
- Generates unique filenames
- Validates file types and sizes
- Creates uploads directory automatically

### 3. Updated Message Model (`models/message.model.js`)

```javascript
{
  messageType: String, // 'text' or 'file'
  fileAttachment: {
    fileName: String,
    originalName: String,
    filePath: String,
    fileSize: Number,
    mimeType: String,
    fileUrl: String
  }
}
```

### 4. New Controller Method (`controllers/message.controller.js`)

- `sendFileMessage()`: Handles file uploads
- Creates file URLs for client access
- Maintains conversation structure

### 5. File Serving Route

- Static file serving at `/api/files/`
- Secure file access through Express static middleware

## Frontend Changes

### 1. Updated Redux Store

- `sendFileMessageThunk`: Handles file upload with progress
- `fileUploading` state management
- `uploadProgress` tracking

### 2. Enhanced Message Component

- File type detection and icon display
- Image preview with download overlay
- File download functionality
- Responsive file display

### 3. Improved SendMessage Component

- File selection with preview
- Upload progress indicator
- File size display
- Drag & drop support
- Keyboard shortcuts (Enter to send)

## API Endpoints

### Send File Message

```
POST /api/v1/message/send-file/:receiverId
Content-Type: multipart/form-data
```

### Get Files

```
GET /api/files/:filename
```

## Environment Variables

### Client (.env)

```
VITE_DB_URL=http://localhost:5000/api/v1
VITE_SERVER_URL=http://localhost:5000
```

### Server (.env)

```
CLIENT_URL=http://localhost:5173
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

## Usage Instructions

### For Users:

1. Click the attachment icon (📎) in the chat input
2. Select a file from your device
3. Preview the file and see file details
4. Click "Send File" to upload
5. Monitor upload progress
6. File appears in chat for both users

### For Developers:

1. Ensure environment variables are set
2. Install dependencies: `npm install`
3. Start server: `npm run dev`
4. Files are stored in `/server/uploads/`
5. Files are accessible via `/api/files/` endpoint

## File Storage Structure

```
server/
├── uploads/
│   ├── file-{timestamp}-{random}.{extension}
│   └── ...
└── ...
```

## Security Features

- File type validation
- File size limits (50MB)
- Unique filename generation
- Secure file serving
- Upload progress tracking

## Real-time Features

- Instant file sharing via Socket.io
- Live upload progress updates
- Real-time message delivery

## UI/UX Improvements

- Modern file preview cards
- Progress bars with percentage
- File type-specific icons
- Hover effects and animations
- Responsive design
- Error handling with toast notifications

## Error Handling

- Invalid file type messages
- File size limit notifications
- Upload failure recovery
- Network error handling

## Performance Optimizations

- Efficient file streaming
- Progress tracking without blocking UI
- Lazy loading for file previews
- Optimized file serving

## Future Enhancements

- Multiple file selection
- File compression
- Cloud storage integration
- File sharing expiration
- Advanced file management
- Audio/video message recording

## Testing

To test the file upload feature:

1. Start both server and client
2. Login with two different users
3. Try uploading different file types
4. Verify real-time delivery
5. Test download functionality
6. Check upload progress tracking
