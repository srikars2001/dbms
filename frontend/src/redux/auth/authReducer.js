import {USER_LOADED,USER_LOADING,AUTH_ERROR,LOGIN_FAILED,LOGIN_SUCCESS,SIGNUP_FAILED,SIGNUP_SUCCESS,LOGOUT_SUCCESS} from './authActionTypes'

const initialState = {
    token:localStorage.getItem('jwtToken'),
    user:null,
    isAuthenticated:false,
    loading:false,
    error:null,
    role:null
}


export default function authReducer(state = initialState,action){
    switch(action.type){

        case USER_LOADING:
            return{
                ...state,
                loading:true,
                isAuthenticated:false,
                user:null,
                error:null,
                role:null
            }

        case SIGNUP_FAILED:
        case LOGIN_FAILED:
        case AUTH_ERROR:
            localStorage.removeItem('jwtToken')
            return{
                ...state,
                token:null,
                user:null,
                isAuthenticated:false,
                loading:false,
                error:action.payload,
                role:null
            };

        case LOGOUT_SUCCESS:
            localStorage.removeItem('jwtToken')
            return{
                ...state,
                token:null,
                user:null,
                isAuthenticated:false,
                loading:false,
                error:null,
                role:null
            }


        case USER_LOADED:
            return{
                ...state,
                user:action.payload.user,
                loading:false,
                isAuthenticated:true,
                error:null,
                role:action.payload.role
            }
        
        case SIGNUP_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem('jwtToken',action.payload.jwtToken)
            return{
                ...state,
                token:action.payload.jwtToken,
                user:action.payload.user,
                loading:false,
                isAuthenticated:true,
                error:null,
                role:action.payload.role

            }
        default:
            return state
    }
}