# 💬 Gup-Shup Chat App

A modern, real-time chat application built with the MERN stack, featuring instant messaging, file sharing, and a beautiful responsive UI.

![Chat App Demo](https://img.shields.io/badge/Status-Active-green)
![Version](https://img.shields.io/badge/Version-2.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌟 Features

### 💬 Core Chat Features

- **Real-time Messaging** - Instant message delivery using Socket.io
- **User Authentication** - Secure login/register with JWT tokens
- **User Profiles** - Customizable user avatars and profiles
- **Online Status** - See who's currently online
- **Message History** - Persistent conversation storage

### 📁 File Sharing (NEW!)

- **Multiple File Types** - Images, documents, videos, audio, archives
- **File Upload Progress** - Real-time upload progress tracking
- **Image Previews** - Instant image thumbnails in chat
- **File Download** - One-click file downloads
- **File Type Detection** - Smart icons for different file types
- **Size Validation** - 50MB file size limit with user feedback

### 🎨 UI/UX Features

- **Modern Design** - Clean, intuitive interface with Tailwind CSS
- **Responsive Layout** - Works perfectly on desktop and mobile
- **Dark/Light Theme** - DaisyUI theme support
- **Toast Notifications** - User-friendly error and success messages
- **Loading States** - Smooth loading indicators
- **Auto-scroll** - Messages automatically scroll to bottom

### 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Input Validation** - Server-side validation for all inputs
- **File Type Validation** - Secure file upload with type checking
- **CORS Protection** - Properly configured cross-origin requests
- **Password Hashing** - Bcrypt password encryption

## 🛠️ Tech Stack

### Frontend

- **React 19** - Modern React with hooks
- **Redux Toolkit** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Beautiful component library
- **Vite** - Fast build tool and dev server
- **Socket.io Client** - Real-time communication
- **React Icons** - Icon library
- **React Hot Toast** - Toast notifications
- **Axios** - HTTP client

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.io** - Real-time communication
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/AftabKhan707/gup-shup-chat-app.git
cd gup-shup-chat-app
```

2. **Install server dependencies**

```bash
cd server
npm install
```

3. **Install client dependencies**

```bash
cd ../client
npm install
```

4. **Environment Setup**

Create `.env` file in the server directory:

```env
CLIENT_URL=http://localhost:5173
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gupshup
JWT_SECRET=your_super_secret_jwt_key_here
```

Create `.env` file in the client directory:

```env
VITE_DB_URL=http://localhost:5000/api/v1
VITE_SERVER_URL=http://localhost:5000
```

5. **Start the application**

Terminal 1 (Server):

```bash
cd server
npm run dev
```

Terminal 2 (Client):

```bash
cd client
npm run dev
```

6. **Access the application**

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 📁 Project Structure

```
gup-shup-chat-app/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   └── utilities/           # Utility components
│   │   ├── pages/                   # Page components
│   │   │   ├── authentication/      # Login/Register pages
│   │   │   └── home/               # Chat interface
│   │   ├── store/                   # Redux store
│   │   │   └── slice/              # Redux slices
│   │   │       ├── message/        # Message management
│   │   │       ├── socket/         # Socket management
│   │   │       └── user/           # User management
│   │   ├── App.jsx                 # Main App component
│   │   └── main.jsx                # Entry point
│   ├── package.json
│   └── vite.config.js
├── server/                          # Express backend
│   ├── controllers/                 # Route handlers
│   ├── db/                         # Database connection
│   ├── middlewares/                # Custom middleware
│   ├── models/                     # Mongoose models
│   ├── routes/                     # API routes
│   ├── socket/                     # Socket.io configuration
│   ├── uploads/                    # File upload storage
│   ├── utilities/                  # Helper functions
│   ├── server.js                   # Entry point
│   └── package.json
├── FILE_UPLOAD_FEATURE.md          # File upload documentation
├── SETUP_GUIDE.md                  # Quick setup guide
└── README.md                       # This file
```

## 🔌 API Endpoints

### Authentication

- `POST /api/v1/user/register` - Register new user
- `POST /api/v1/user/login` - User login
- `POST /api/v1/user/logout` - User logout
- `GET /api/v1/user/profile` - Get user profile

### Messages

- `POST /api/v1/message/send/:receiverId` - Send text message
- `POST /api/v1/message/send-file/:receiverId` - Send file message
- `GET /api/v1/message/get-messages/:otherParticipantId` - Get conversation

### Files

- `GET /api/files/:filename` - Download/view uploaded files

### Users

- `GET /api/v1/user/users` - Get all users (for sidebar)

## 🎯 Usage Guide

### Getting Started

1. **Register** - Create a new account with email and password
2. **Login** - Sign in with your credentials
3. **Select User** - Choose a user from the sidebar to start chatting
4. **Send Messages** - Type and send text messages
5. **Share Files** - Click the attachment icon to share files

### File Sharing

1. Click the **📎 attachment icon** in the message input
2. Select any supported file (images, documents, videos, etc.)
3. Preview the file and see file details
4. Click **"Send File"** to upload
5. Watch the real-time upload progress
6. File appears instantly in both users' chats
7. Click on files to download or view

### Keyboard Shortcuts

- **Enter** - Send message
- **Shift + Enter** - New line in message

## 🧪 Testing the File Upload Feature

1. Open two browser windows/tabs
2. Register/login with different accounts in each
3. Start a conversation between the users
4. Try uploading different file types:
   - Images (JPG, PNG, GIF)
   - Documents (PDF, DOC, XLS)
   - Media files (MP3, MP4)
   - Archives (ZIP, RAR)
5. Verify real-time delivery and download functionality

## 🔧 Environment Variables

### Server Environment Variables

| Variable      | Description               | Default                 |
| ------------- | ------------------------- | ----------------------- |
| `CLIENT_URL`  | Frontend URL for CORS     | `http://localhost:5173` |
| `PORT`        | Server port               | `5000`                  |
| `MONGODB_URI` | MongoDB connection string | Required                |
| `JWT_SECRET`  | JWT signing secret        | Required                |

### Client Environment Variables

| Variable          | Description        | Default                        |
| ----------------- | ------------------ | ------------------------------ |
| `VITE_DB_URL`     | Backend API URL    | `http://localhost:5000/api/v1` |
| `VITE_SERVER_URL` | Backend server URL | `http://localhost:5000`        |

## 📋 Supported File Types

- **Images**: JPEG, JPG, PNG, GIF, WebP
- **Documents**: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT
- **Media**: MP3, WAV, MP4, AVI, QuickTime
- **Archives**: ZIP, RAR, 7Z

**File Size Limit**: 50MB per file

## 🎨 Customization

### Themes

The app uses DaisyUI themes. You can customize the theme in `tailwind.config.js`:

```javascript
module.exports = {
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "cupcake", "corporate"], // Add your themes
  },
};
```

### File Upload Settings

Modify file upload settings in `server/middlewares/fileUpload.middleware.js`:

```javascript
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // Change file size limit
  },
});
```

## 🛡️ Security Best Practices

- JWT tokens are stored in HTTP-only cookies
- Passwords are hashed using bcrypt
- File uploads are validated for type and size
- CORS is properly configured
- Input validation on both client and server
- Unique filename generation prevents conflicts

## 🚨 Troubleshooting

### Common Issues

**1. Connection Issues**

- Ensure MongoDB is running
- Check environment variables
- Verify ports 5000 and 5173 are available

**2. File Upload Issues**

- Check file size (must be under 50MB)
- Verify file type is supported
- Ensure uploads directory exists

**3. Socket Connection Issues**

- Check CORS configuration
- Verify CLIENT_URL environment variable
- Ensure both frontend and backend are running

**4. Authentication Issues**

- Verify JWT_SECRET is set
- Check cookie settings
- Ensure MongoDB connection is working

## 📈 Performance Optimization

- **File Storage**: Files are stored locally (can be upgraded to cloud storage)
- **Image Optimization**: Consider adding image compression
- **Caching**: Redis can be added for session management
- **Database**: MongoDB indexes for better query performance
- **CDN**: Static assets can be served via CDN

## 🔮 Future Enhancements

- [ ] **Multiple File Selection** - Upload multiple files at once
- [ ] **File Compression** - Automatic image/video compression
- [ ] **Cloud Storage** - AWS S3/Cloudinary integration
- [ ] **Voice Messages** - Record and send audio messages
- [ ] **Video Calls** - WebRTC video calling
- [ ] **Group Chat** - Multi-user conversations
- [ ] **Message Reactions** - Emoji reactions to messages
- [ ] **Message Search** - Search through conversation history
- [ ] **Typing Indicators** - Show when users are typing
- [ ] **Message Encryption** - End-to-end encryption
- [ ] **Push Notifications** - Browser push notifications
- [ ] **Message Status** - Read receipts and delivery status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add comments for complex functionality
- Test your changes thoroughly
- Update documentation if needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**MKL** - _Initial work_

## 🙏 Acknowledgments

- React.js team for the amazing framework
- Socket.io for real-time communication
- Tailwind CSS for the utility-first CSS framework
- DaisyUI for beautiful components
- MongoDB for the flexible database solution

## 📞 Support

If you have any questions or issues, please:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the [Setup Guide](SETUP_GUIDE.md)
3. Check the [File Upload Documentation](FILE_UPLOAD_FEATURE.md)
4. Open an issue on GitHub

---

⭐ **Star this repository if you found it helpful!**

**Happy Chatting! 💬✨**
