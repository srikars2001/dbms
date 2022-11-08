import React from 'react'
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/auth/authActions';

export default function CustomerDashboard() {

    const auth = useSelector(state => state.auth)
    const dispatch = useDispatch()
    

    function logoutUser(){
        dispatch(logout());
    }

    return (    

        <div>
            <h3>Welcome {auth.user.e_name}</h3>
            <button onClick={logoutUser}>Logout</button>
        </div>
    )
}
