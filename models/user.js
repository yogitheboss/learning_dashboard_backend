import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    picture: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "instructor",""],  // Define role as an enum
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model("user", userSchema);
