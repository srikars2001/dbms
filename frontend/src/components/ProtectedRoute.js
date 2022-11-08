import React, { useEffect } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { loadUser } from '../redux/auth/authActions'
import { useSelector, useDispatch } from 'react-redux'

const ProtectedRoute = ({ component: Component,role, ...rest }) => {
  const auth = useSelector(state => state.auth);
  // const dispatch = useDispatch();
  // useEffect(() => {
  //     dispatch(loadUser())
  // }, []) 

  return (
    <Route {...rest} render={
      (props) => {
        if (auth.loading) {
        //   return (<div class="spinner-border text-primary" role="status">
        //     <span class="sr-only">Loading...</span>
        //   </div>)
        console.log("loading")
        return(<h3>Loadin...</h3>)
        }
        else if (auth.isAuthenticated && role===auth.role) {
          return <Component {...props} />
        }
        else if ((!auth.isAuthenticated && !auth.token)) {
          return <Redirect to={
            {
              pathname: '/login',
              state: {
                from: props.location
              }
            }
          } />
        }
        else if(role!==null && role!==auth.role){
          console.log(role)
          console.log(auth.role)
          return <Redirect to={
            {
              pathname: '/'+auth.role ,
              state: {
                from: props.location
              }
            }
          } />
        }
          // else {return(<h2>Nothing</h2>)}
      }
    } />
  )
}


export default ProtectedRoute;