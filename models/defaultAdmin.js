const mongoose = require("mongoose");

const defaultadmin = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "superadmin"],
    default: "admin",
  },

  isActive: {
    type: Boolean,
    default: true,
  },
  moduleAccess: {
    lcf: { type: Boolean, default: false },
    incomeExpense: { type: Boolean, default: false },
    members: { type: Boolean, default: false },
    user: { type: Boolean, default: false },
  },
  resetToken: {
    type: String,
  },
  resetTokenExpiry: {
    type: Date,
  },
});
module.exports = mongoose.model("defaultadmin", defaultadmin);
