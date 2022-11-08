import React from 'react'
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/auth/authActions';
import { Link } from 'react-router-dom';

export default function CustomerDashboard() {

    const auth = useSelector(state => state.auth)
    const dispatch = useDispatch()
    

    function logoutUser(){
        dispatch(logout());
    }

    return (    

        <div>
            <h3>Welcome {auth.user.c_name}</h3>
            <Link to='/accounts'><button>Your Accounts</button></Link>
            <Link to='/transaction'><button>Transfer Money</button></Link>
            <Link to='/loanApply'><button>Apply for Loan</button></Link>
            <button onClick={logoutUser}>Logout</button>
        </div>
    )
}
