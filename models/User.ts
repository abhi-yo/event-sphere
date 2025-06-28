import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    adminLevel: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    accountLocked: {
      type: Boolean,
      default: false,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
    adminCreatedAt: {
      type: Date,
      default: null,
    },
    adminCreatedBy: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ email: 1 });
UserSchema.index({ isAdmin: 1 });

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
