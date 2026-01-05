import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: "string",
      required: true,
      trim: true,
      maxlength: 50,
      unique: true,
      minlength: 5,
    },
    email: {
      type: "string",
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: "string",
      required: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
