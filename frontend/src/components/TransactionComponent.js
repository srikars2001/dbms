import axios from 'axios'
import React,{useEffect,useState} from 'react'
import { useSelector, useDispatch } from 'react-redux';

export default function TransactionComponent() {
    
    
    const auth = useSelector(state => state.auth)
    // const dispatch = useDispatch()
    
    const [transaction, setTransaction] = useState({
        transaction_type:'',
        remitter_acc_no:'',
        beneficiary_acc_no:null,
        amount:0
    })

    const [accounts, setAccounts] = useState([])

    useEffect(() => {
        //api call to fetch user accounts
        const config = {
            headers:{
                'Content-Type':'application/json'
            }
        }
        if(auth.token) config.headers['jwtToken']=auth.token;
        console.log(auth.token)
        axios.get('http://localhost:8000/api/user/getAccount',config)
        .then(result => {
            // console.log(result.data)
            setAccounts(result.data)
        })
        .catch(error => {
            // dispatch(authError(null));
            alert(error.response.data.msg);
        })

    }, [])

    function handleChange(event){
        const{name,value} = event.target;

        setTransaction(prevValue => {
            return({
                ...prevValue,
                [name]:value
            })
        })
    }

    function handleSubmit(event){
        event.preventDefault();
        if(transaction.amount == 0){
            alert("Enter Valid Amount")
            return;
        }
        const config = {
            headers:{
                'Content-Type':'application/json'
            }
        }
        if(auth.token) config.headers['jwtToken']=auth.token;
        axios.post('http://localhost:8000/api/transaction/payment',transaction,config)
        .then(result => {
            // console.log(result.data)
            alert("Transaction Succesful\nTransaction id: "+result.data.transaction_id)
            // setAccounts(result.data)
        })
        .catch(error => {
            // dispatch(authError(null));
            alert(error.response.data.msg);
        })
    }

    if(accounts.length === 0){
        return(
            <h3>You don't have any account to make transactions</h3>
        )
    }

    else{
        return (
            <div>
                <h2>Payment</h2>
                <form onSubmit={handleSubmit}>

                    <select name="transaction_type" onChange={handleChange}>
                        <option value="">Select Mode of Payment</option>
                        <option value="NEFT">NEFT</option>
                        <option value="RTGS">RTGS</option>
                        <option value="IMPS">IMPS</option>
                    </select>

                    <select name="remitter_acc_no" onChange={handleChange}>
                        <option value="">Select Remitter Account Number</option>

                        {
                            accounts.map(account => {
                                return(
                                    <option key={account.acc_number} value={account.acc_number}>{account.acc_number}</option>
                                )
                            })
                        }
                            {/* <option value="employee">Employee</option> */}
                    </select>

                    <input type='number' onChange={handleChange} name='beneficiary_acc_no' placeholder='Beneficiary Account Number' value={transaction.beneficiary_acc_no} />
                    <input type='number' onChange={handleChange} name='amount' value={transaction.amount} />
                    <button type='submit'>Pay</button>
                </form>
            </div>
        )
    }
}
