const pool = require("../db");
const router = require("express").Router();
require('dotenv').config();
const jwt = require('jsonwebtoken')
const customerAuth = require('../middleware/customerAuth');


router.get('/loadUser',async(req,res)=>{
    const token = req.header("jwtToken");

    try{
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    let user=null;
    if(payload.user.role === 'customer')
        user = await pool.query("select * from customer where username=$1",[payload.user.username])
    else if(payload.user.role === 'employee')
        user = await pool.query("select * from employee where username=$1",[payload.user.username])

    if(user.rows.length ===0)
        return res.status(400).json({msg:"User not found"})
    
    return res.status(200).json({
        user:user.rows[0],
        role:payload.user.role
    })

    }catch(err){
        return res.status(400).json({msg:"Invalid Token"});
    }
    

})

router.get('/getAccount',async(req,res)=>{
  
    const token = req.header("jwtToken");

    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if(payload.user.role !== 'customer')
            return res.status(400).json({msg:'Unauthorized'})
        const accounts = await pool.query('select * from account where customer_id = $1',[payload.user.id]);
        res.status(200).json(accounts.rows);
    }catch(err){
        return res.status(500).json({msg:"Invalid Token"})
    }


})

module.exports = router;