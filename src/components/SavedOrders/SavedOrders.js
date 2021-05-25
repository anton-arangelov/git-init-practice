import React, { useEffect, useState, Fragment, useRef } from "react";
import useAxios from "../../hooks/useAxios.js";
import axios from "axios";
import Spinner from "../../ui/Spinner.js";
import classes from "./SavedOrders.module.css";

const SavedOrders = (props) => {
  const interval = useRef(undefined);

  const [orders, setOrders] = useState([]);
  const user = props.user;

  const [shouldCheckStatus, setShouldCheckStatus] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().getTime());

  let status = "";
  

  const transformData = (dataObj) => {
    console.log(dataObj)
    let updatedOrders = [];
    Object.keys(dataObj.data).forEach((el) => {
      updatedOrders.push(dataObj.data[el]);
      setOrders(updatedOrders);
    });
  };

  const {
    loading,
    error,
    sendRequest: fetchData,
  } = useAxios(
    {
      url: `https://react-project-server-default-rtdb.firebaseio.com/myAppOrders${
        user ? `/${user.replace(".", "_")}` : ""
      }/orders.json`,
      func: axios.get,
      body: null,
    },
    transformData,
    () => {}
  );

  const stop = () => {
    if (!interval.current) return;
    clearInterval(interval);
    interval.current = null;
  };

  const start = () => {
    if (!interval.current)
    interval.current = setInterval(() => {
      setShouldCheckStatus(false);
      setCurrentTime(new Date().getTime());
    }, 30000);
  };

  useEffect(() => {
    if (shouldCheckStatus) {
      start();
    } else stop();
  }, [shouldCheckStatus]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, []);
  
  return (
    <Fragment>
      {!user ? <p className = {classes.Paragraph}>You need to login or create account</p> : <Fragment>
      {error &&
      error.toString() ===
        "TypeError: Cannot convert undefined or null to object" ? (
        <p className = {classes.Paragraph}>There are no orders</p>
      ) : (
        <div>
          {error ? (
            <div>{error.response.data}</div>
          ) : (
            <Fragment>
              {loading ? (
                <Spinner />
              ) : (
                <div>
                  <p className = {classes.Paragraph}>
                    Each order takes 2 minutes to be ready. If your order is
                    older than 2 minutes it will be with status "ready".
                    Otherwise it will be with status "pending"
                  </p>
                  {orders.map((data) => {
                    if (
                      currentTime - new Date(data.date).getTime() >
                      60000 * 2
                    ) {
                      status = "ready";
                    } else {
                      status = "pending";
                      if (!shouldCheckStatus) {
                        setShouldCheckStatus(true);
                      }
                    }
                    let totalCost = 0;
                    return (
                      <div
                        className={classes.SavedOrder}
                        key={new Date(data.date).toLocaleString()}
                      >
                        <div className={classes.FirstColumn}>
                          {" "}
                          On {new Date(data.date).toLocaleString()} you ordered:
                          {Object.keys(data.order).map((el) => {
                            totalCost = totalCost + data.order[el].quantity * data.order[el].price
                              return (
                                <div key={data.order[el].name}>
                                  {data.order[el].name} x {` `}
                                  {data.order[el].quantity}
                                  {` times, which cost ${
                                    data.order[el].quantity *
                                    data.order[el].price
                                  } levs`}
                                </div>
                              );
                            })}
                            <div><b>Your order totally cost {totalCost} levs</b></div>
                        </div>
                        <div
                          className={`${classes.SecondColumn} ${
                            status === "pending" && classes.Pending
                          }`}
                        >
                          {status}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Fragment>
          )}
        </div>
      )}
      </Fragment>}
    </Fragment>
  );
};

export default SavedOrders;
