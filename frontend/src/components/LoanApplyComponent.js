import React from 'react'
import {useState,useEffect} from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
export default function LoanApplyComponent(props) {
    const auth = useSelector(state => state.auth)

    const [accounts, setAccounts] = useState([]);

    const [loan, setLoan] = useState({
        remitter_acc_no:null,
        amount:null,
        interest:null,
        duration:null
    })

    useEffect(() => {
        //api call to fetch user accounts
        const config = {
            headers:{
                'Content-Type':'application/json'
            }
        }
        if(auth.token) config.headers['jwtToken']=auth.token;
        // console.log(auth.token)
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

    function handleChange(event) {
        const { name, value } = event.target;
        setLoan(prevValue => {
            return ({
                ...prevValue,
                [name]: value
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
        axios.post('http://localhost:8000/api/loan/apply',loan,config)
        .then(result => {
            // console.log(result.data)
            // setAccounts(result.data)
            alert(result.data.msg)
        })
        .catch(error => {
            // dispatch(authError(null));
            alert(error.response.data.msg);
        })
    }

    return (
        <div>
            <h2>Loan</h2>
            <form onSubmit={handleSubmit}>
                <select name="remitter_acc_no" onChange={handleChange}>
                    <option value="">Select Remitter Account Number</option>

                    {
                        accounts.map(account => {
                            return(
                                <option key={account.acc_number} value={account.acc_number}>{account.acc_number}</option>
                            )
                        })
                    }
                </select>
                <input type="number" placeholder="Amount" name="amount" onChange={handleChange} />
                {/* <input type="number" placeholder="Interest" /> */}
                <select name="interest" onChange={handleChange}>
                    <option value=''>Select Scheme</option>
                    <option value='7'>Education Loan</option>
                    <option value='10'>Home Loan</option>
                </select>
                <input type="number" placeholder="Duration" name="duration" onChange={handleChange}/>
                <input type="submit" value="Apply" />
            </form>
        </div>
    )
}
