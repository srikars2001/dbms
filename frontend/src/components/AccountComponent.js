import React,{useState,useEffect} from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
export default function AccountComponent() {
    
    const auth = useSelector(state => state.auth)
    const [accounts, setAccounts] = useState([])
    const [clicked, setClicked] = useState(false)

    useEffect(() => {
        //get accounts for customer id
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

    function viewBalance(){
        setClicked(prevValue =>{
            return !prevValue
        })
    }


    if(accounts.length === 0){
        return(
            <h3>You don't have any account</h3>
        )
    }
    else{

        return (
            <div>
                <h2>Your Accounts</h2>
                <ul>
                 {
                    accounts.map(account => {
                        return(
                            <div>
                                <li key={account.acc_number} >{account.acc_number}</li>
                                <button onClick={viewBalance} >{clicked?account.balance:"View Balance"}</button>
                                <Link to={'/fetchTransactions/'+account.acc_number}><button>View Transactions</button></Link>
                            </div>

                        )
                    })
                }
                </ul>
            </div>
        )
    }
}
