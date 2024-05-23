const mongoose = require("mongoose")

// Định nghĩa schema cho tasks
const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["pending", "incomplete", "completed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    deadline: {
      type: Date,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Thay 'User' bằng tên của model User nếu bạn có
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

// Tạo model từ schema
const Task = mongoose.model("Task", taskSchema)

module.exports = Task
