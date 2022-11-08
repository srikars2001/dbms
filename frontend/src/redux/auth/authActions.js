import {USER_LOADED,USER_LOADING,AUTH_ERROR,LOGIN_FAILED,LOGIN_SUCCESS,SIGNUP_FAILED,SIGNUP_SUCCESS,LOGOUT_SUCCESS} from './authActionTypes'
// import {setError,clearError} from '../error/errorActions'
import axios from 'axios'

export function userLoading(){
    return{
        type:USER_LOADING
    }
}

export function userLoaded(user){
    return{
        type:USER_LOADED,
        payload:user
    }
}

export function authError(error){
    return{
        type:AUTH_ERROR,
        payload:error
    }
}

export function loginFailed(error){
    return{
        type:LOGIN_FAILED,
        payload:error
    }
}

export function loginSuccess(user){
    return{
        type:LOGIN_SUCCESS,
        payload:user
    }
}

export function logoutSuccess(){
    return{
        type:LOGOUT_SUCCESS
    }
}

export function signupFailed(error){
    return{
        type:SIGNUP_FAILED,
        payload:error
    }
}

export function signupSuccess(user){
    return{
        type:SIGNUP_SUCCESS,
        payload:user
    }
}


//check token and load user

export function loadUser(){
    return function (dispatch,getState){
        dispatch(userLoading());
        const token = getState().auth.token;
        const config = {
            headers:{
                'Content-Type':'application/json'
            }
        }
        if(token) config.headers['jwtToken']=token;
        axios.get('http://localhost:8000/api/user/loadUser',config)
        .then(result => {
          
            dispatch(userLoaded(result.data))
            
        })
        .catch(error => {
            // dispatch(setError(error.response.status,error.response.data.msg));
            // dispatch(authError(error.response.data.msg));
            dispatch(authError(null));
        })
    }
}

//Signup user

export function signupUser({username,c_name,c_address,aadhaar,pan,password}){
    return function(dispatch){
        dispatch(userLoading());
        const newUser = {
            username,c_name,c_address,aadhaar,pan,password
        }
        axios.post('http://localhost:8000/api/signup',newUser)
        .then(result => {
            // dispatch(clearError())
            dispatch(signupSuccess(result.data));
            // window.location.href = '/';
        })
        .catch(error => {
            // dispatch(setError(error.response.status,error.response.data.msg));
            dispatch(signupFailed(error.response.data.msg));
        })
    }
}

//Login user

export function loginUser({username,password,role}){
    return function(dispatch){
        dispatch(userLoading());
        const user = {
            username,password,role
        }
        axios.post('http://localhost:8000/api/login',user)
        .then(result => {
            // dispatch(clearError())
            dispatch(loginSuccess(result.data));
            //redirect
        })
        .catch(error => {
            // dispatch(setError(error.response.status,error.response.data.msg));
            dispatch(loginFailed(error.response.data.msg));
        })
    }
}

export function logout(){
    return function (dispatch){
        dispatch(logoutSuccess());
        // window.location.href = '/login';
    }
}