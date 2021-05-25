import React from 'react'
import classes from './OrderButton.module.css'

const OrderButton =(props)=>{
    const loggedIn=props.loggedIn
    return(
        <div className={classes.OrderButtonDiv}>
        <button className={classes.OrderButton} onClick={props.onOrder}>{loggedIn ? 'CONFIRM ORDER' : 'ORDER'}</button>
      </div>
    )
}

export default OrderButton