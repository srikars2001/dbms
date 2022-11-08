import React,{useEffect,useState} from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'

export default function FetchTransactionsComponent(props) {
    const auth = useSelector(state => state.auth)
    const [transactions, setTransactions] = useState([])
    useEffect(() => {
        //fetch transactions
        const account  = {
            remitter_acc_no:props.match.params.account_no
        }
        const config = {
            headers:{
                'Content-Type':'application/json'
            }
        }

        if(auth.token) config.headers['jwtToken']=auth.token;
        // console.log(auth.token)
        axios.post('http://localhost:8000/api/transaction/get',account,config)
        .then(result => {
            // console.log(result.data)
            setTransactions(result.data)
        })
        .catch(error => {
            // dispatch(authError(null));
            alert(error.response.data.msg);
        })
    }, [])

    if(transactions.length === 0){
        return(
            <div>
                You don't have any transactions
            </div>
        )
    }

    else{

        return (
            <div>
                <h2>Your transactions</h2>
                <ul>
                {
                    transactions.map(transaction => {
                        return (
                            <div key={transaction.transaction_id}  style={{borderStyle:'solid',margin:'10px',padding:'10px'}}>
                                <h4>Transaction ID : {transaction.transaction_id}</h4>
                                <h4 style={{color:props.match.params.account_no==transaction.remitter_acc_no?'red':'green'}}>Amount : {transaction.amount}</h4>
                                <h4>Remitter : {transaction.remitter_acc_no}</h4>
                                <h4>Beneficiary : {transaction.beneficiary_acc_no}</h4>
                            </div>
                        )
                    })
                }
                </ul>
            </div>
        )
    }
}
