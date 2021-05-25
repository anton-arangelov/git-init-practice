import React, { Fragment } from "react";
import classes from "./Modal.module.css";

const Backdrop = (props) => {
  return (
    <div className={classes.Backdrop} onClick={props.onClose}>
      <h1>X</h1>
    </div>
  );
};

const ModalOverlay = (props) => {
  return (
    <div className={classes.Modal}>
      <div className={classes.Content}>{props.children}</div>
    </div>
  );
};

const Modal = (props) => {
  let totalPrice = 0;
  Object.keys(props.order).forEach((el) => {
    totalPrice =
      totalPrice + props.order[`${el}`].quantity * props.order[`${el}`].price;
  });
  const loggedIn = props.loggedIn;
  return (
    <Fragment>
      <Backdrop onClose={props.onClose} />
      <ModalOverlay>
        {loggedIn ? (
          <Fragment >
            <h1>Your order is:</h1>
            <div>
              Order itself:{" "}
              {Object.keys(props.order).map((el) => {
                if (props.order[el].quantity > 0) {
                  return (
                    <div key={props.order[el].name} className={classes.Order}>
                      {props.order[el].name}: {props.order[el].quantity} times
                      <p>
                        Total price: {` `}
                        {props.order[el].quantity * props.order[el].price} levs
                      </p>
                    </div>
                  );
                }
                return null;
              })}
              {props.children}
            </div>
            <p>Total price ot all orders is: {totalPrice} levs</p>
            <div className = {classes.Buttons}>
            <button onClick={props.onClose}>Cancel</button>
            <button onClick={props.onConfirm}>Confirm</button>
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <h1>You need to log in to make an order</h1>
            <button className={classes.LoginSignUp} onClick={props.onLoginSignUpClicked}>
              Log in / Sign up
            </button>
          </Fragment>
        )}
      </ModalOverlay>
    </Fragment>
  );
};

export default Modal;
