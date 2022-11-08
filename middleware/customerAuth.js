const jwt = require("jsonwebtoken");
require("dotenv").config();
const pool = require("../db");


//this middleware will on continue on if the token is inside the local storage

module.exports = async function(req, res, next) {
  // Get token from header
  const token = req.header("jwtToken");

  // Check if not token
  if (!token) {
    return res.status(403).json({ msg: "Authorization denied" });
  }

  // Verify token
  try {
    //it is going to give use the user id (user:{id: user.id})
    // console.log(req.body)
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if(payload.user.role !== 'customer') return res.status(400).json({msg:"Authorization denied"})
    const account = await pool.query("select * from account where acc_number = $1",[req.body.remitter_acc_no]);
    if(account.rows.length === 0) return res.status(400).json({msg:"Account doesn't exist"})
    if(account.rows[0].customer_id !== payload.user.id) return res.status(400).json({msg:"Authorization denied"})
    req.user = payload.user;
    next();
  } catch (err) {
    // res.status(401).json(err.response);
    res.status(401).json({ msg: "Token is not valid" });
  }
};