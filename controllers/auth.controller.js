const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Admin = require("../models/defaultAdmin");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).send({ error: "Email already registered" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });

  try {
    await user.save();
    res.status(200).send({ message: "User Registered" });
  } catch (err) {
    res.status(500).send({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).send({ error: "User not found" });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).send({ error: "Incorrect password" });
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
 res.send({
  message: "Welcome back, already registered user!",
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    imageUrl: user.imageUrl,
  },
  token,
});

};

exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // Get fields from request body
    const updatedFields = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
    };

    // ✅ If a file is uploaded, save its filename
    if (req.file) {
      updatedFields.imageUrl = `/uploads/${req.file.filename}`;
    }

    // Update and return the updated user (excluding password)
    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
    }).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated successfully", updatedUser });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Error updating profile" });
  }
};


