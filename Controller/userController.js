const User = require('../Models/UserModel');

exports.getAllUsers = async (req, res) => {
  let users;
  if (req.user.role === 'admin') {
    users = await User.find({ isActive: true }).select('-password');
  } else if (req.user.role === 'manager') {
    users = await User.find({ _id: { $in: req.user.team } }).select('-password');
  } else {
res.status(403).json({ message: 'Forbidden' });
    return;
  }
  res.json(users);
};

// exports.updateUser = async (req, res) => {
//   const { id } = req.params;
//   if (req.user.role !== 'admin' && String(req.user._id) !== id)
//     return res.status(403).json({ message: 'Access denied' });

//   const updated = await User.findByIdAndUpdate(id, req.body, { new: true }).select('-password');
//   res.json(updated);
// };