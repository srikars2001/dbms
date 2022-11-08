const pool = require("../db");
const router = require("express").Router();
const bcrypt  = require('bcryptjs');
require('dotenv').config();
const jwtGenerator = require('../utils/jwtGenerator')

router.post('/', async (req, res) => {
    const { username,c_name, c_address, aadhaar, pan, password } = req.body;

    if (!username || !c_name || !c_address || !aadhaar || !pan || !password) {
        return res.status(400).json({ msg: "Enter all fields" });
    }


    try {
        const customer = await pool.query("select * from customer where username = $1", [username]);
        if (customer.rows.length === 0) {
            try {

                const salt = await bcrypt.genSalt(10);
                const bcryptPassword = await bcrypt.hash(password, salt);
                let newCustomer = await pool.query("insert into customer values(default,$1,$2,$3,$4,$5,$6) RETURNING *", [c_name, c_address, aadhaar, pan,bcryptPassword,username]);
                // console.log(newCustomer.rows)
                const jwtToken = jwtGenerator(newCustomer.rows[0].username,'customer',newCustomer.rows[0].customer_id);
                return res.status(200).json({
                    jwtToken,
                    user:newCustomer.rows[0],
                    role:'customer'
                })

            } catch (err) {
                return res.status(400).json({ msg: "Unable to create customer" });
            }
        }
        else {
            return res.status(400).json({ msg: "User already exists" });
        }
    } catch (error) {
        return res.status(400).json({ msg: "Couldn't query database" });
    }


})




module.exports = router;