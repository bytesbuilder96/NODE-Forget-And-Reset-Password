import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, //rejecs
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      enum: ["email", "google", "outlook"],
      default: "email",
    },
    passwordResetOTP: {
      type: String,
    },

    passwordResetOTPExpire: {
      type: Date,
    },
    canRequestResendOTP: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
};
userSchema.methods.generatePasswordResetOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  this.passwordResetOTP = crypto.createHash("sha256").update(otp).digest("hex");

  this.passwordResetOTPExpire = Date.now() + 10 * 60 * 1000;

  this.canRequestResendOTP = false;

  return otp;
};

export const User = mongoose.model("User", userSchema);
