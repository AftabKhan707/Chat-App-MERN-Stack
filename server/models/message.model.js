import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: function () {
        return !this.fileAttachment;
      },
    },
    messageType: {
      type: String,
      enum: ["text", "file"],
      default: "text",
    },
    fileAttachment: {
      fileName: {
        type: String,
        required: function () {
          return this.messageType === "file";
        },
      },
      originalName: {
        type: String,
        required: function () {
          return this.messageType === "file";
        },
      },
      filePath: {
        type: String,
        required: function () {
          return this.messageType === "file";
        },
      },
      fileSize: {
        type: Number,
        required: function () {
          return this.messageType === "file";
        },
      },
      mimeType: {
        type: String,
        required: function () {
          return this.messageType === "file";
        },
      },
      fileUrl: {
        type: String,
        required: function () {
          return this.messageType === "file";
        },
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
