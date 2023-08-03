import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    movieList: {
      type: Array,
      required: true
    },
    avatarUrl: String,
    movieList: {
      type: Array,
      unique: true
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
