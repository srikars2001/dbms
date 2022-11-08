import React from 'react'
import {useState,useEffect} from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'


export default function LoanResolveComponent() {
    
    const auth = useSelector(state => state.auth)
    const [loans, setLoans] = useState([])
    useEffect(() => {
        const config = {
            headers:{
                'Content-Type':'application/json'
            }
        }
        if(auth.token) config.headers['jwtToken']=auth.token;
       axios.get('http://localhost:8000/api/loan/pending',config)
       .then(result => {
            setLoans(result.data)
        })
        .catch(error => {
            alert(error.response.data.msg);
        })
    }, [])

    function handleAccept(id){

        const config = {
            headers:{
                'Content-Type':'application/json'
            }
        }
        if(auth.token) config.headers['jwtToken']=auth.token;
       axios.post('http://localhost:8000/api/loan/accept',{id},config)
       .then(result => {
            alert(result.data.msg)
            window.location.reload(false);
        })
        .catch(error => {
            alert(error.response.data.msg);
        })
    }

    function handleReject(id){

        const config = {
            headers:{
                'Content-Type':'application/json'
            }
        }
        if(auth.token) config.headers['jwtToken']=auth.token;
       axios.post('http://localhost:8000/api/loan/reject',{id},config)
       .then(result => {
            alert(result.data.msg)
            window.location.reload(false);
        })
        .catch(error => {
            alert(error.response.data.msg);
        })
    }

    return (
        <div>
            <h2>Pending Loans</h2>
            {
                    loans.map(loan => {
                        return(
                            <div  style={{borderStyle:'solid',margin:'10px',padding:'10px'}}>
                                <div key={loan.id} >Loan ID: {loan.id}</div>
                                <div key={loan.acc_number} >Applicant Account Number : {loan.acc_number}</div>
                                <div key={loan.interest} >Interest : {loan.interest}%</div>
                                <div key={loan.amount} >Amount : {loan.amount}</div>
                                <button onClick={() => handleAccept(loan.id)}>Accept</button>
                                <button onClick={()=> handleReject(loan.id)} name={loan.id}>Reject</button>
                                {/* <Link to={'/fetchTransactions/'+loan.acc_number}><button>View Transactions</button></Link> */}
                            </div>

                        )
                    })
                }
        </div>
    )
}
