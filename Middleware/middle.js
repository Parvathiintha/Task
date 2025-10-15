const jwt = require('jsonwebtoken');
const User = require('../Models/UserModel');

exports.authenticateToken = (req,res,next)=>{
    const token = req.headers.authorization?.split(" ")[1];
    
    if(!token){
        return res.status(401).json({message : "No Token , Unauthorized"});
    }

    try{
        const decode = jwt.verify(token , process.env.JWT_SECRET);
        req.user = decode;
        next();
    }
    catch(err){
        res.status(403).json({message : "Invalid or Expired Token"})
    }
}
 
//Authorization middleware
exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log(req.user.role,'trsdt')
    if (!roles.includes(req.user.role))
      return res.status(403).json({ success: false, message: 'Access denied' });
    next();
  };
};
