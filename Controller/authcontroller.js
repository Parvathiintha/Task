const User = require("../Models/UserModel")
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already exists' }).Select("-password")

  const user = await User.create({ 
    username, 
    email, password, role })

  res.status(201).json({ message: 'User created', user })
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
     { 
     return res.status(400).json({ message: 'Invalid credentials' });
     }
    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    // ✅ Generate token before using it
    const token = generateToken(user._id, user.role);

    // Now safely send the response
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
exports.logout = async (req, res) => {
  // For JWT, logout is typically handled on the client side by deleting the token.
  // Optionally, you can implement token blacklisting on the server side.
  res.status(200).json({ message: 'Logout successful' });
}
