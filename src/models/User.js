import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    is_active: {
      type: Boolean,
      default: false,
    },
    refresh_token: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model("User", userSchema);
