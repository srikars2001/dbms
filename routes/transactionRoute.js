const pool = require("../db");
const router = require("express").Router();
require('dotenv').config();
const customerAuth = require('../middleware/customerAuth');

router.post('/payment',customerAuth,async(req,res)=>{
    const {transaction_type,remitter_acc_no,beneficiary_acc_no,amount} = req.body;
    if( !transaction_type || !remitter_acc_no || !beneficiary_acc_no || !amount )
        return res.status(400).json({msg:"Enter all fields"});

    try{    
        const beneficiary_account = await pool.query("select * from account where acc_number = $1", [beneficiary_acc_no]);
        if(beneficiary_account.rows.length === 0)
            return res.status(400).json({msg:"Invalid Beneficiary Account Number"});
        
        const remitter_account = await pool.query("select * from account where acc_number = $1", [remitter_acc_no]);
        if(remitter_account.rows[0].balance < amount) return res.status(400).json({msg:"Insufficient Balance"});
        const transaction = await pool.query("insert into transaction values(default,$1,$2,$3,$4,default,$5) returning *",[transaction_type,remitter_acc_no,beneficiary_acc_no,amount,"Success"]);
        const updated_remitter = await pool.query("update account set balance = (balance-$1) where acc_number = ($2)",[amount,remitter_acc_no]);
        const updated_beneficiary = await pool.query("update account set balance = (balance+$1) where acc_number = ($2)",[amount,beneficiary_acc_no]);
        return res.status(200).json(transaction.rows[0]);
        
    }catch(err){
        // return res.status(500).json(err.message);change this
        return res.status(500).json({msg:"Server Error"})
    }
    
})

router.post('/get',customerAuth,async (req,res)=>{
    const {remitter_acc_no} = req.body;
    try{
        const transactions = await pool.query("select * from transaction where remitter_acc_no = $1 union select * from transaction where beneficiary_acc_no = $1 order by timestamp desc",[req.body.remitter_acc_no])
        return res.status(200).json(transactions.rows);
    }catch(err){
        return res.status(500).json({msg:"Server Error"})
    }
})


module.exports = router;