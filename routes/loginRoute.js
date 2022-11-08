const pool = require("../db");
const router = require("express").Router();
const bcrypt  = require('bcryptjs');
require('dotenv').config();
const jwtGenerator = require('../utils/jwtGenerator')

router.post('/',async (req,res)=>{
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ msg: "Enter all fields" });
    }

    try {
        let user = null;
        if(role==='customer')
            user = await pool.query("SELECT * FROM customer WHERE username = $1", [username]);
        else if(role === 'employee')
            user = await pool.query("SELECT * FROM employee WHERE username = $1", [username]);
    
        if (user.rows.length === 0) {
          return res.status(400).json({msg:"Username doesn't exist"});
        }
        //employee password handle
        let validPassword = null;
        if(role === 'customer')
        {
            validPassword = await bcrypt.compare(
            password,
            user.rows[0].password
          );
        }
        else if(role === 'employee' && password===user.rows[0].password){
          validPassword = true;
        }
    
        if (!validPassword) {
          return res.status(400).json({msg:"Invalid Credential"});
        }
        let jwtToken = null
        if(role === 'customer')  jwtToken = jwtGenerator(user.rows[0].username,role,user.rows[0].customer_id);
        else if(role === 'employee')  jwtToken = jwtGenerator(user.rows[0].username,role,user.rows[0].employee_id);
        return res.json({
           jwtToken,
           user:user.rows[0],
           role
        });
      } catch (err) {
        // res.status(500).json(err.message);
        res.status(500).json({msg:"Server error"});
      }
})

module.exports = router;