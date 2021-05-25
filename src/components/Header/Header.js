import React from 'react'
import { NavLink } from 'react-router-dom'
import classes from './Header.module.css'

const Header =(props)=>{
    
    return<div className={classes.Header}>
        <span>Your orders: <b>{props.itemsNumber}</b> items</span>
        {props.user && <span className={classes.Hello}>Hello {props.user}
        <button onClick={props.onLogoutHandler}>Logout</button></span>}
        <div className={classes.LinkContainer}>
        <NavLink className={classes.Link} to='/'>Meals</NavLink>
        <NavLink className={classes.Link} to='/orders'>Orders</NavLink>
        {!props.loggedIn && <NavLink className={classes.Link} to='/auth'>Login/Sign up</NavLink>}
        </div>
    </div>
}

export default Header;