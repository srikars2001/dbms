import React from 'react'
import { useState,useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser,loadUser } from '../redux/auth/authActions';
import { Link,Redirect } from 'react-router-dom';

export default function LoginComponent(props) {

    const auth = useSelector(state => state.auth)
    const dispatch = useDispatch()

    // useEffect(() => {
    //     loadUser()
    // }, [])

    const [user, setUser] = useState({
        username: "",
        password: "",
        role: "customer"
    })

    function handleChange(event) {
        const { name, value } = event.target;
        setUser(prevValue => {
            return ({
                ...prevValue,
                [name]: value
            })
        })
    }

    function handleSubmit(event){
        event.preventDefault();
        dispatch(loginUser(user))
    }

    if(auth.isAuthenticated){
        return (
            <Redirect to={
                {
                  pathname: auth.user.customer_id? '/customer':'/employee',
                  state: {
                    from: props.location
                  }
                }
              } />
            // <h3>Login Success</h3>
        )
    }
    else if(auth.loading){
        return(
            <h3>Loading...</h3>
        )
    }

    else{
        return (
            <div>
                <h2 className="text-center"><strong>Login</strong></h2>
                {auth.error?(
                        <div>
                            {auth.error}
                        </div>):null
                    }
                <form onSubmit={handleSubmit}>
                    <input type="text" name="username" placeholder="Username" onChange={handleChange} value={user.username} />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} value={user.password} />
                    <select name="role" onChange={handleChange}>
                        <option value="customer">Customer</option>
                        <option value="employee">Employee</option>
                    </select>
                    <div><button type="submit">Login</button></div>Don't have an account?<Link to="/signup"> Signup here.</Link>

                </form>

            </div>
        )
    }
}
