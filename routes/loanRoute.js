const pool = require("../db");
const router = require("express").Router();
require('dotenv').config();
const customerAuth = require("../middleware/customerAuth");
const employeeAuth = require('../middleware/employeeAuth');

router.post('/apply',customerAuth,async (req,res)=>{
    const {amount,interest,remitter_acc_no,duration} = req.body;
    if(!interest || !remitter_acc_no || !duration)
        return res.status(400).json({msg:"Enter all fields"});
    if(!amount || amount==='0')
        return res.status(400).json({msg:"Enter valid amount"});
    try{
        const loan = await pool.query("insert into loan values(default,$1,$2,$3,'Pending',$4) RETURNING *",[remitter_acc_no,interest,duration,amount]);
        if(loan.rows.length)
            return res.status(200).json({msg:"Application successful"});
        return res.status(500).json({msg:"Something went wrong"})

    }catch(err){
        // res.status(500).json(err.message);
        res.status(500).json({msg:"Server Error"});
    }
})

router.post('/resolve',employeeAuth,async (req,res)=>{
    const {id,status} = req.body;
    if(!status || !id)
        return res.status(400).json({msg:"Enter all fields"});
    
    try{
        const loan = await pool.query("update loan set status = $1 where id = $2 returning *",[status,id]);
        if(loan.rows.length)
            return res.status(200).json({msg:"Loan "+status});
        return res.status(400).json({msg:"Couldn't find loan id"})
    }catch(err){
        return res.status(500).json({msg:"Server Error"});
    }

})

router.get('/pending',employeeAuth,async (req,res)=>{
    // if(req.params.acc_no === null)
    //     return res.status(400).json({msg:"Enter valid account number"});
    try{
        const loans = await pool.query("select * from loan where status = 'Pending' ");
        return res.status(200).json(loans.rows);
    }catch(err){
        return res.status(500).json({msg:"Server Error"})
    }
})

router.post('/reject',employeeAuth,async (req,res)=>{
    const {id} = req.body;
    if(!id)
        return res.status(400).json({msg:"Enter all fields"});

    try{
        const updatedLoan = await pool.query("update loan set status = 'Rejected' where id=$1 returning *",[id]);
        if(updatedLoan.rows.length)
            return res.status(200).json({msg:"Loan Application Rejected"})
        return res.status(400).json({msg:"Couldn't find loan id"})
        
    }catch(err){
        console.log(err.message)
        return res.status(500).json({msg:"Server Error"})
    }

})

router.post('/accept',employeeAuth,async (req,res)=>{
    const {id} = req.body;
    if(!id)
        return res.status(400).json({msg:"Enter all fields"});

    try{
        const updatedLoan = await pool.query("update loan set status = 'Accepted' where id=$1 returning *",[id]);
        if(updatedLoan.rows.length)
            return res.status(200).json({msg:"Loan Application Accepted"})
        return res.status(400).json({msg:"Couldn't find loan id"})
        
    }catch(err){
        return res.status(500).json({msg:"Server Error"})
    }

})

module.exports = router;