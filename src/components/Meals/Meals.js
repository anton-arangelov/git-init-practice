import React, { useState } from "react";
import classes from "./Meals.module.css";
import Meal from "../Meal/Meal.js";
import DUMMY_MEALS from "./DummyData.js";

let inputValues = {};

const Meals = (props) => {
  const [, setValue] = useState();

  const onOrder = (el, price, name) => {
    if (!inputValues[el]) {
      return;
    }
    let order = {};
    let orderDetailedElement = {};
    orderDetailedElement.name = name;
    orderDetailedElement.quantity = +inputValues[el];
    orderDetailedElement.price = +price;
    order[`${el}`] = orderDetailedElement;
    setValue("");
    props.setNewOrder(order);
    inputValues = {};
  };

  const onValueChange = (event, element) => {
    props.setNewOrder({});
    if (event.target.value < 0) {
      return;
    }
    setValue(event.target.value);
    inputValues[`${element}`] = +event.target.value;
  };
  return (
    <div className={classes.Meals}>
      {DUMMY_MEALS.map((data) => {
        return Object.keys(data).map((el) => {
          return (
            <Meal
              key={data[el].name}
              name={data[el].name}
              description={data[el].description}
              img={data[el].img}
              price={data[el].price}
              setItemsNumber={props.setItemsNumber}
              onOrder={() => onOrder(el, data[el].price, data[el].name)}
              value={inputValues[el] ? inputValues[el] : ``}
              onValueChange={(e) => onValueChange(e, el)}
            />
          );
        });
      })}
    </div>
  );
};

export default Meals;
