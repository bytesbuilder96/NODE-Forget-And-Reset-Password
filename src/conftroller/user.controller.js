import bcrypt from "bcrypt";
import { User } from "../model/user.model.js";
import sendEmail from "../utils/sendMail.util.js";
import jwt from "jsonwebtoken";

// ╔═════════════════════╗
// ║     Create User     ║
// ╚═════════════════════╝
export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email) {
      res.status(400).json({
        success: false,
        message: "Email not Found",
      });
    }
    if (!password) {
      res.status(400).json({
        success: false,
        message: "password not Found",
      });
    }
    if (!name) {
      res.status(400).json({
        success: false,
        message: "name not Found",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User Already Exist",
      });
    }
    await User.create({ name, email, password });
    res.status(200).json({
      success: true,
      message: "User Create Successfuly",
    });
    console.log("User Created Successfuly");
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "user not create",
      error,
    });
  }
};

// ╔════════════════════╗
// ║     Login User     ║
// ╚════════════════════╝
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      res.status(400).json({
        success: false,
        message: "Email not Found",
      });
    }
    if (!password) {
      res.status(400).json({
        success: false,
        message: "password not Found",
      });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(400).json({
        success: false,
        message: "User not Found",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({
        message: "message.error",
      });
    }
    const accessToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET
    );
    return res.status(200).json({
      message: "Login successful",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        accessToken,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "User login field",
    });
    console.log("error", error);
  }
};

// ╔═════════════════════╗
// ║     Forget User     ║
// ╚═════════════════════╝

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Not Found",
      });
    }

    if (user.provider !== "email") {
      return res.status(400).json({
        success: false,
        message: "This email cannot reset password",
      });
    }

    const otp = user.generatePasswordResetOTP();
    user.canRequestResendOTP = true;
    await user.save();

    const emailHtml = `
      <h2>Password Reset</h2>
      <p>Your password reset OTP is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 10 minutes.</p>
    `;

    await sendEmail(user.email, "Password Reset", emailHtml);

    return res.status(200).json({
      success: true,
      message: "Password reset OTP sent to your email",
    });
  } catch (error) {
    console.log("Forget Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Forget password failed",
    });
  }
};
