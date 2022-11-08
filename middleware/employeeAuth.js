const jwt = require("jsonwebtoken");
require("dotenv").config();

//this middleware will on continue on if the token is inside the local storage

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header("jwtToken");

  // Check if not token
  if (!token) {
    return res.status(403).json({ msg: "Authorization denied" });
  }

  // Verify token
  try {
    //it is going to give use the user id (user:{id: user.id})
    
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if(payload.user.role !== 'employee') return res.status(401).json({msg:"Authorization denied."})
    req.user = payload.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};