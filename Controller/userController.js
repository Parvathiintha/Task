const User= require('../Models/UserModel');

exports.getAllUsers = async (req, res) => {
  let users;
  if (req.user.role === 'admin')
     {
    users = await User.find({ isActive: true }).select('-password');
  }
   else if (req.user.role === 'manager') { 
    users = await User.find({ _id: { $in: req.user.team } }).select('-password');
  }
   else {
   res.status(403).json({ message: 'Forbidden' });
    return;
  }
  res.json(users);
};
exports.getUsers = async(req,res)=>{
    try{
        const users = await User.find({},"-password");
        if(users.length === 0){
            console.log("User Not Found");
        }
        res.status(200)
        .json({message : "Users Fetched Successfully" , users})
    }
    catch(err){
        console.log(err);
        
        res.status(500).json({message : "Internal Server Error"});
    }
}


exports.deleteUser = async(req,res)=>{
  try {
      const {id} = req.params;
      const user = await User.findById(id);
      if(!user){
        return res.status(404).json({message : "User Not Found"});
      }
      
     user.isDeleted =  true;
     await user.save();

      res.status(200).json({message : "User Deleted Successfully"})
  } catch (error) {
    console.log(error);
    
    res.status(500).json({message : "Internal Server Error "})
  }
}
