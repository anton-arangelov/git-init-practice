import React from "react";
import classes from "./OrderItem.module.css";

const OrderItem = (props) => {
  return (
    <div className={classes.ModuleItem}>
      <div className={classes.UpperPart}>
        <h1>{props.name}</h1>
        <button className={classes.CancelButton} onClick={props.onCancelItem}>X</button>
      </div>
      <div className={classes.LowerPart}>
        <div>
          <p><b>Quantity:</b></p>
          <p>{props.quantity}</p>
        </div>
        <div className={classes.ActionButtons}>
          <button onClick={props.onAddItem}>Add 1</button>
          <button onClick={props.onRemoveItem}>Remove 1</button>
        </div>
        <div>
          <p><b>Total Price:</b></p>
          <p>{props.quantity * props.price} levs</p>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
