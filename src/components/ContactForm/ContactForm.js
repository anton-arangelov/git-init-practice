import React from "react";
import classes from "./ContactForm.module.css";

const ContactForm = (props) => {
  return (
    <div className = {classes.ContactForm}>
      <div>
        <label htmlFor="telephone">Telephone</label>
        <input type='text' value = {props.telephoneValue} onChange={props.onChangeTelephoneValueHandler}></input>
      </div>
      <div>
        <label htmlFor="address">Address</label>
        <input type='text' value = {props.addressValue} onChange={props.onChangeAddressValueHandler}></input>
      </div>
      {!props.allNecessaryInformationIsAvailable && <p>Please enter telephone and address!</p>}
    </div>
  );
};

export default ContactForm;
