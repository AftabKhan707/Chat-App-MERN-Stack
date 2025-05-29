import React, { useState, useRef } from "react";
import { IoIosSend } from "react-icons/io";
import { MdAttachFile, MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  sendMessageThunk,
  sendFileMessageThunk,
} from "../../store/slice/message/message.thunk";
import { setUploadProgress } from "../../store/slice/message/message.slice";

const SendMessage = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.userReducer);
  const { fileUploading, uploadProgress } = useSelector(
    (state) => state.messageReducer
  );
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleSendMessage = () => {
    if (message.trim() && !fileUploading) {
      dispatch(
        sendMessageThunk({
          recieverId: selectedUser?._id,
          message,
        })
      );
      setMessage("");
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => setFilePreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleFileSend = () => {
    if (selectedFile && !fileUploading) {
      dispatch(
        sendFileMessageThunk({
          recieverId: selectedUser?._id,
          file: selectedFile,
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            dispatch(setUploadProgress(progress));
          },
        })
      );

      // Reset file selection
      setSelectedFile(null);
      setFilePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const clearFileSelection = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full p-3">
      {/* File Preview Section */}
      {selectedFile && (
        <div className="mb-3 p-3 bg-base-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">File to send:</h4>
            <button
              onClick={clearFileSelection}
              className="btn btn-sm btn-ghost btn-circle"
              disabled={fileUploading}
            >
              <MdClose />
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {filePreview ? (
              <img
                src={filePreview}
                alt="Preview"
                className="w-16 h-16 object-cover rounded"
              />
            ) : (
              <div className="w-16 h-16 bg-base-300 rounded flex items-center justify-center">
                <MdAttachFile className="text-2xl text-gray-500" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>

          {/* Upload Progress */}
          {fileUploading && (
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <button
            onClick={handleFileSend}
            disabled={fileUploading}
            className="btn btn-primary btn-sm mt-3 w-full"
          >
            {fileUploading ? "Uploading..." : "Send File"}
          </button>
        </div>
      )}

      {/* Message Input Section */}
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <textarea
            placeholder="Type a message..."
            className="textarea textarea-bordered textarea-primary w-full resize-none"
            rows="1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={fileUploading}
          />
        </div>

        <div className="flex gap-2">
          {/* File Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-square btn-outline btn-secondary"
            disabled={fileUploading}
          >
            <MdAttachFile />
          </button>

          {/* Send Message Button */}
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || fileUploading}
            className="btn btn-square btn-outline btn-primary"
          >
            <IoIosSend />
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.7z"
        />
      </div>
    </div>
  );
};

export default SendMessage;
