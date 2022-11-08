import React from 'react'
import { useState } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function CreateAccountComponent() {

    const auth = useSelector(state => state.auth)

    const [account, setAccount] = useState({
        balance:0,
        acc_type:null,
        acc_number:null,
        nominee_acc_name:"",
        ifsc:"",
        customer_id:null
    
    })

    
    function handleChange(event){
        const{name,value} = event.target;

        setAccount(prevValue => {
            return({
                ...prevValue,
                [name]:value
            })
        })
    }

    function handleSubmit(event){
        event.preventDefault();
       
        const config = {
            headers:{
                'Content-Type':'application/json'
            }
        }
        if(auth.token) config.headers['jwtToken']=auth.token;
        axios.post('http://localhost:8000/api/account/create',account,config)
        .then(result => {
            // console.log(result.data)
            alert("Account Created");
            // setAccounts(result.data)
        })
        .catch(error => {
            // dispatch(authError(null));
            alert(error.response.data.msg);
        })
    }


    return (
        <div>

            <form onSubmit={handleSubmit}>

                <input type='number' onChange={handleChange} name='customer_id' placeholder='Customer ID' value={account.customer_id} />

                <select name="acc_type" onChange={handleChange}>
                    <option value="">Select Account Type</option>
                    <option value="Savings">Savings</option>
                    <option value="Current">Current</option>
                </select>

                <input type='text' onChange={handleChange} name='nominee_acc_name' placeholder='Nominee Name' value={account.nominee_acc_name} />
                <input type='text' onChange={handleChange} name='ifsc' placeholder='IFSC' value={account.ifsc} />
                <input type='number' onChange={handleChange} name='acc_number' placeholder='Account Number' value={account.acc_number} />
                <input type='number' onChange={handleChange} name='balance' placeholder='Balance' value={account.balance} />
                <button type='submit'>Create Account</button>
            </form>

        </div>
    )
}
