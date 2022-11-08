import React, { useState, useEffect } from 'react'
import {Link,Redirect} from 'react-router-dom'
import {useSelector,useDispatch} from 'react-redux';
import { signupUser } from '../redux/auth/authActions';

export default function SignupComponent(props) {


    const auth = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const [user, setUser] = useState({
        username:"",
        c_name:"",
        c_address:"",
        aadhaar:"",
        pan:"",
        password:""
    })

    function handleChange(event){
        const{name,value} = event.target;
        setUser(prevValue => {
            return{
                ...prevValue,
                [name]:value
            }
        })
    }

    function handleSubmit(event){
        event.preventDefault();
        dispatch(signupUser(user));
    }

    if(auth.isAuthenticated){
        return (
            <Redirect to={
                {
                  pathname: '/customer',
                  state: {
                    from: props.location
                  }
                }
              } />
            // <h3>Signup Success</h3>
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

                <div>
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-center"><strong>Signup</strong></h2>
                        {auth.error?(
                                <div>
                                    {auth.error}
                                </div>):null
                            }
                        <div><input onChange={handleChange} type="text" name="username" placeholder="Username" value={user.username} /></div>
                        <div ><input onChange={handleChange} type="text" name="c_name" placeholder="Name" value={user.c_name} /></div>
                        <div ><input onChange={handleChange} type="text" name="c_address" placeholder="Address" value={user.c_address} /></div>
                        <div ><input onChange={handleChange} type="text" name="pan" placeholder="PAN" value={user.pan} /></div>
                        <div ><input onChange={handleChange} type="text" name="aadhaar" placeholder="Aadhaar" value={user.aadhaar} /></div>
                        <div ><input onChange={handleChange} type="password" name="password" placeholder="Password" value={user.password} /></div>
                        {/* <div className="form-group">
                            <div className="form-check"><label className="form-check-label"><input className="form-check-input" type="checkbox" />I agree to the license terms.</label></div>                
                        </div> */}
                        <div><button type="submit">Signup</button></div>Already registered? <Link to="/login">Login here.</Link>
                    </form>
                </div>

            </div>
        )
    }

}