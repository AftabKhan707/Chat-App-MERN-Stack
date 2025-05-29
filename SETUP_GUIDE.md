# Quick Setup Guide for File Upload Feature

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or cloud instance)
- Git

## Setup Instructions

### 1. Install Dependencies

#### Server

```bash
cd server
npm install
```

#### Client

```bash
cd client
npm install
```

### 2. Environment Configuration

#### Server (.env)

Create a `.env` file in the server directory:

```env
CLIENT_URL=http://localhost:5173
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gupshup
JWT_SECRET=your_jwt_secret_key
```

#### Client (.env)

Create a `.env` file in the client directory:

```env
VITE_DB_URL=http://localhost:5000/api/v1
VITE_SERVER_URL=http://localhost:5000
```

### 3. Start the Application

#### Terminal 1 - Server

```bash
cd server
npm run dev
```

#### Terminal 2 - Client

```bash
cd client
npm run dev
```

### 4. Access the Application

- Client: http://localhost:5173
- Server: http://localhost:5000

## File Upload Features Now Available

✅ Send images, documents, videos, and audio files
✅ Real-time file sharing
✅ Upload progress tracking
✅ File download capability
✅ File type detection and icons

## File Upload Testing

1. Register/Login with two accounts
2. Start a conversation
3. Click the attachment icon (📎)
4. Select any supported file
5. Watch the upload progress
6. File appears instantly for both users

## Supported File Types

- Images: JPG, PNG, GIF, WebP
- Documents: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT
- Media: MP3, WAV, MP4, AVI, MOV
- Archives: ZIP, RAR, 7Z

## File Size Limit

Maximum file size: 50MB per file

## Troubleshooting

- Ensure MongoDB is running
- Check environment variables
- Verify ports 5000 and 5173 are available
- Check console for any error messages
