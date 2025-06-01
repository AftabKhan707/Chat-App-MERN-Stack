import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  FaDownload,
  FaFile,
  FaImage,
  FaVideo,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileAudio,
  FaFileArchive,
} from "react-icons/fa";

const Message = ({ messageDetails }) => {
  const messageRef = useRef(null);
  const { userProfile, selectedUser } = useSelector(
    (state) => state.userReducer
  );

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const getFileIcon = (mimeType) => {
    if (mimeType?.startsWith("image/"))
      return <FaImage className="text-blue-500" />;
    if (mimeType?.startsWith("video/"))
      return <FaVideo className="text-red-500" />;
    if (mimeType?.startsWith("audio/"))
      return <FaFileAudio className="text-purple-500" />;
    if (mimeType === "application/pdf")
      return <FaFilePdf className="text-red-600" />;
    if (mimeType?.includes("word"))
      return <FaFileWord className="text-blue-600" />;
    if (mimeType?.includes("excel") || mimeType?.includes("spreadsheet"))
      return <FaFileExcel className="text-green-600" />;
    if (mimeType?.includes("powerpoint") || mimeType?.includes("presentation"))
      return <FaFilePowerpoint className="text-orange-600" />;
    if (
      mimeType?.includes("zip") ||
      mimeType?.includes("rar") ||
      mimeType?.includes("7z")
    )
      return <FaFileArchive className="text-yellow-600" />;
    return <FaFile className="text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileDownload = (fileUrl, originalName) => {
    try {
      // Get server URL with fallback
      const serverUrl =
        import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
      const downloadUrl = `${serverUrl}${fileUrl}?download=true`;

      // Log the URL being used for debugging
      console.log("Server URL from env:", import.meta.env.VITE_SERVER_URL);
      console.log("Using server URL:", serverUrl);
      console.log("Download URL:", downloadUrl);
      console.log("Original filename:", originalName);
      console.log("File URL path:", fileUrl);

      // Use fetch to ensure complete download
      console.log("Starting download:", originalName);

      fetch(downloadUrl, {
        method: "GET",
        headers: {
          Accept: "*/*",
        },
      })
        .then((response) => {
          console.log("Response status:", response.status);
          console.log("Response headers:", [...response.headers.entries()]);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          // Get the content length and content type
          const contentLength = response.headers.get("content-length");
          const contentType = response.headers.get("content-type");
          console.log("Expected file size:", contentLength, "bytes");
          console.log("Content type:", contentType);

          return response.blob();
        })
        .then((blob) => {
          console.log("Downloaded blob size:", blob.size, "bytes");
          console.log("Downloaded blob type:", blob.type);

          // Check if this looks like an error response (HTML instead of PDF)
          if (blob.type.includes("text/html") || blob.size < 10000) {
            // This is likely an error response, let's see what it says
            return blob.text().then((text) => {
              console.log("Server response content:", text);
              throw new Error(
                "Server returned HTML error page instead of PDF file"
              );
            });
          }

          // Verify the blob size matches expected size
          if (blob.size === 0) {
            throw new Error("Downloaded file is empty");
          }

          // Create blob URL and download
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = originalName;
          link.style.display = "none";

          // Add to DOM and trigger download
          document.body.appendChild(link);
          link.click();

          // Clean up after download
          setTimeout(() => {
            if (document.body.contains(link)) {
              document.body.removeChild(link);
            }
            window.URL.revokeObjectURL(blobUrl);
          }, 1000);
        })
        .catch((error) => {
          console.error("Fetch download failed:", error);

          // Fallback to simple anchor method
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.download = originalName;
          link.style.display = "none";
          link.target = "_blank";
          link.rel = "noopener noreferrer";

          document.body.appendChild(link);
          link.click();

          setTimeout(() => {
            if (document.body.contains(link)) {
              document.body.removeChild(link);
            }
          }, 2000);
        });
    } catch (error) {
      console.error("File download failed:", error);
      // Final fallback - open in new tab
      const serverUrl =
        import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
      window.open(`${serverUrl}${fileUrl}?download=true`, "_blank");
    }
  };

  const renderFileMessage = () => {
    const { fileAttachment } = messageDetails;
    const isImage = fileAttachment?.mimeType?.startsWith("image/");

    return (
      <div className="max-w-xs">
        {isImage ? (
          <div className="relative group">
            <img
              src={`${import.meta.env.VITE_SERVER_URL}${
                fileAttachment.fileUrl
              }`}
              alt={fileAttachment.originalName}
              className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() =>
                window.open(
                  `${import.meta.env.VITE_SERVER_URL}${fileAttachment.fileUrl}`,
                  "_blank"
                )
              }
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() =>
                  handleFileDownload(
                    fileAttachment.fileUrl,
                    fileAttachment.originalName
                  )
                }
                className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
              >
                <FaDownload size={12} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3 p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
            <div className="text-2xl">
              {getFileIcon(fileAttachment?.mimeType)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {fileAttachment?.originalName}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(fileAttachment?.fileSize)}
              </p>
            </div>
            <button
              onClick={() =>
                handleFileDownload(
                  fileAttachment.fileUrl,
                  fileAttachment.originalName
                )
              }
              className="btn btn-sm btn-ghost btn-circle"
            >
              <FaDownload size={14} />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div
        ref={messageRef}
        className={`chat ${
          userProfile?._id === messageDetails?.senderId
            ? "chat-end"
            : "chat-start"
        }`}
      >
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img
              alt="Tailwind CSS chat bubble component"
              src={
                userProfile?._id === messageDetails?.senderId
                  ? userProfile?.avatar
                  : selectedUser?.avatar
              }
            />
          </div>
        </div>
        <div className="chat-header">
          <time className="text-xs opacity-50">
            {new Date(messageDetails?.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        </div>
        <div className="chat-bubble">
          {messageDetails?.messageType === "file"
            ? renderFileMessage()
            : messageDetails?.message}
        </div>
      </div>
    </>
  );
};

export default Message;
