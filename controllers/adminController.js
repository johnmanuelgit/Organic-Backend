const Admin = require("../models/defaultAdmin");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Login attempt:", { username, password });

    const admin = await Admin.findOne({ username });
    console.log("Admin found:", admin);

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid credentials" });
    }

    if (!admin.isActive) {
      return res
        .status(403)
        .json({ status: "error", message: "Account is inactive" });
    }

    const jwt = require("jsonwebtoken");
    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username,
        role: admin.role,
      },
      process.env.JWT_SECRET || "2003",
      { expiresIn: "24h" }
    );

    req.session.admin = {
      id: admin._id,
      username: admin.username,
      role: admin.role,
      moduleAccess: admin.moduleAccess,
    };

    return res.json({
      status: "success",
      message: "Login successful",
      token: token,
      user: req.session.admin,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid");
    return res.json({ message: "Logout successful" });
  });
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("Forgot password request for email:", email); 

    
    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Email is required",
      });
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: "error",
        message: "Please provide a valid email address",
      });
    }

    const admin = await Admin.findOne({ email });
    console.log("Admin found:", admin ? "Yes" : "No"); 

    
    const responseMessage =
      "If this email exists in our system, you will receive a password reset link shortly";

    if (admin) {
      try {
        
        const token = crypto.randomBytes(32).toString("hex");

        
        admin.resetToken = token;
        admin.resetTokenExpiry = new Date(Date.now() + 3600000); 
        await admin.save();

        console.log("Reset token generated and saved"); 

        
        if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
          console.error("Email credentials not configured");
          
          return res.json({
            status: "success",
            message: responseMessage,
          });
        }

        const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
          },
          
          secure: true,
          tls: {
            rejectUnauthorized: false,
          },
        });

        
        await transporter.verify();
        console.log("Email transporter verified"); 

        
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;


        const mailOptions = {
          from: process.env.EMAIL_USERNAME, 
          to: email,
          subject: "Password Reset Request - Admin Portal",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Password Reset Request</h2>
              <p>Hello,</p>
              <p>You requested a password reset for your admin account.</p>
              <p>Click the button below to reset your password:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background-color: #007bff; color: white; padding: 12px 30px; 
                          text-decoration: none; border-radius: 5px; display: inline-block;">
                  Reset Password
                </a>
              </div>
              <p>Or copy and paste this link in your browser:</p>
              <p style="word-break: break-all; color: #007bff;">${resetUrl}</p>
              <p><strong>This link will expire in 1 hour.</strong></p>
              <p>If you didn't request this password reset, please ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="color: #666; font-size: 12px;">
                This is an automated message, please do not reply.
              </p>
            </div>
          `,
        };

        
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.messageId); 
      } catch (emailError) {
        console.error("Email sending error:", emailError);
        
        
      }
    }

    return res.json({
      status: "success",
      message: responseMessage,
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({
      status: "error",
      message: "Server error during password reset. Please try again later.",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    console.log("Reset password attempt with token:", token); 

    
    if (!token || !newPassword) {
      return res.status(400).json({
        status: "error",
        message: "Token and new password are required",
      });
    }

    
    if (newPassword.length < 6) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 6 characters long",
      });
    }

    
    const admin = await Admin.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }, 
    });

    console.log("Admin found with token:", admin ? "Yes" : "No"); 

    if (!admin) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired reset token",
      });
    }

    
    const saltRounds = 12; 
    admin.password = await bcrypt.hash(newPassword, saltRounds);

    
    admin.resetToken = undefined;
    admin.resetTokenExpiry = undefined;

    await admin.save();

    console.log("Password reset successful for admin:", admin.username); 

    return res.json({
      status: "success",
      message:
        "Password reset successful. You can now login with your new password.",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({
      status: "error",
      message: "Server error during password reset. Please try again.",
    });
  }
};


exports.forgotUsername = async (req, res) => {
  try {
    const { email } = req.body;

    
    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Email is required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: "error",
        message: "Please provide a valid email address",
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    const responseMessage =
      "If this email exists in our system, you will receive an email with your username shortly";

    if (admin) {
      try {
        
        if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
          console.error("Email credentials not configured");
          return res.json({
            status: "success",
            message: responseMessage,
          });
        }

        
        const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
          },
          secure: true,
          tls: {
            rejectUnauthorized: false,
          },
        });

        
        await transporter.verify();
        console.log("Email transporter verified");

        const mailOptions = {
          from: process.env.EMAIL_USERNAME,
          to: email.toLowerCase().trim(),
          subject: "Username Recovery - Admin Portal",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Username Recovery</h2>
              <p>Hello,</p>
              <p>You requested a reminder of your username for the admin portal.</p>
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0; font-size: 18px;">Your username is: <strong style="color: #007bff;">${admin.username}</strong></p>
              </div>
              <p>You can now use this username to log in to the admin portal.</p>
              <p>If you didn't request this information, please ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="color: #666; font-size: 12px;">
                This is an automated message, please do not reply.
              </p>
            </div>
          `,
          text: `Username Recovery\n\nYour username is: ${admin.username}`,
        };

        
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
      } catch (emailError) {
        console.error("Email sending error:", emailError);
        
        if (process.env.NODE_ENV === "development") {
          return res.status(500).json({
            status: "error",
            message: "Email sending failed",
            error: emailError.message,
          });
        }
      }
    }

    return res.json({
      status: "success",
      message: responseMessage,
    });
  } catch (err) {
    console.error("Forgot username error:", err);
    return res.status(500).json({
      status: "error",
      message: "Server error during username recovery",
    });
  }
};

exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.admin) return next();
  return res.status(401).json({ message: "Unauthorized" });
};


exports.listAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({ role: "admin" });
    return res.json(admins);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { username, email, password, moduleAccess } = req.body;

    
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    
    const existingEmail = await Admin.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingUsername = await Admin.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
      role: "admin",
      moduleAccess: moduleAccess || {
        lcf: false,
        incomeExpense: false,
        members: false,
        user: false,
      },
      isActive: true,
    });

    await newAdmin.save();
    return res
      .status(201)
      .json({ message: "Admin created successfully", admin: newAdmin });
  } catch (err) {
    console.error("Create admin error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const { username, email, moduleAccess, isActive } = req.body;
    const updated = await Admin.findByIdAndUpdate(
      req.params.id,
      {
        username,
        email,
        moduleAccess,
        isActive,
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Admin not found" });
    return res.json({ message: "Admin updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const deleted = await Admin.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Admin not found" });
    return res.json({ message: "Admin deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};


