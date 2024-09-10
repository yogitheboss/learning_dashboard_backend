import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: [],
      required: true,
    },
    duration: {
      type: Number, // Duration in minutes
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Reference to the User model (instructor)
      required: true,
    },
    originalFileName: {
      type: String, // Name of the uploaded CSV file
      required: true,
    },
    uploadDate: {
      type: Date, // Date when the CSV was uploaded
      default: Date.now,
    },
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", // Reference to the User model (student)
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

export const CourseModel = mongoose.model("course", courseSchema);
