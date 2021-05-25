import React, { Fragment, useEffect, useState } from "react";
import Meals from "../components/Meals/Meals.js";
import Header from "../components/Header/Header.js";
import CurrentOrder from "../components/CurrentOrder/CurrentOrder.js";
import OrderItem from "../components/OrderItem/OrderItem.js";
import Modal from "../components/Modal/Modal.js";
import { Route, Switch, useHistory } from "react-router-dom";
import SavedOrders from "../components/SavedOrders/SavedOrders.js";
import axios from "axios";
import useAxios from "../hooks/useAxios.js";
import Spinner from "../ui/Spinner.js";
import LoginSignUp from "../components/LoginSignUp/LoginSignUp.js";
import OrderButton from "../components/OrderButton/OrderButton.js";
import ContactForm from "../components/ContactForm/ContactForm.js";

let errorPostContactMessage = "";

const MainContainer = () => {
  const history = useHistory();

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loggedIn, setLoggedIn] = useState(!!token);
  const [user, setUser] = useState(localStorage.getItem("user"));

  const [order, setOrder] = useState({});
  const [newOrder, setNewOrder] = useState({});
  // const [quantityOfNewestOrder, setQuantityOfNewestOrder] = useState(0);

  const [modalIsVisible, setModalIsVisible] = useState(false);

  const [fetchedTelephoneValue, setFetchedTelephoneValue] = useState("");
  const [fetchedAddressValue, setFetchedAddressValue] = useState("");
  const [telephoneValue, setTelephoneValue] = useState("");
  const [addressValue, setAddressValue] = useState("");
  const [
    allNecessaryInformationIsAvailable,
    setAllNecessaryInformationIsAvailable,
  ] = useState(true);

  //FOR THE POST ORDER REQUEST
  const {
    loading,
    error,
    sendRequest: postData,
  } = useAxios(
    {
      url: `https://react-project-server-default-rtdb.firebaseio.com/myAppOrders/${
        user && user.replace(".", "_")
      }/orders.json`,
      func: axios.post,
      body: { order: order, date: new Date().toLocaleString() },
    },
    () => {},
    () => {}
  );

  //FOR THE POST CONTACT REQUEST
  const postPostContactFunction = (error) => {
    errorPostContactMessage = error.toString();
  };

  const {
    loading: loadingPostContact,
    error: errorPostContact,
    sendRequest: postContact,
  } = useAxios(
    {
      url: `https://react-project-server-default-rtdb.firebaseio.com/myAppOrders/${
        user && user.replace(".", "_")
      }/contact.json`,
      func: axios.post,
      body: { telephone: telephoneValue, address: addressValue },
    },
    () => {},
    postPostContactFunction
  );

  //TO GET ADDRESS AND TELEPHONE WHEN USER SIGNS IN
  const transformFetchedContactData = (dataObj) => {
    if (!dataObj) {
      setTelephoneValue("");
      setAddressValue("");
    }
    Object.keys(dataObj.data).forEach((el) => {
      setTelephoneValue(dataObj.data[el].telephone);
      setAddressValue(dataObj.data[el].address);
      setFetchedTelephoneValue(dataObj.data[el].telephone);
      setFetchedAddressValue(dataObj.data[el].telephone);
    });
  };

  const { sendRequest: getContact } = useAxios(
    {
      url: `https://react-project-server-default-rtdb.firebaseio.com/myAppOrders/${
        user && user.replace(".", "_")
      }/contact.json`,
      func: axios.get,
      body: null,
    },
    transformFetchedContactData,
    () => {}
  );

  Object.keys(newOrder).forEach((el) => {
    if (order[el]) {
      order[el].quantity = order[el].quantity + newOrder[el].quantity;
    } else {
      order[`${el}`] = newOrder[el];
    }
  });

  const totalAmountOfItems = Object.keys(order).reduce(
    (currentNumber, element) => {
      return currentNumber + order[element].quantity;
    },
    0
  );

  const errorItself = (
    <div>
      {error
        ? error.toString()
        : errorPostContact
        ? errorPostContact.toString()
        : null}
    </div>
  );

  const onCancelItem = (data) => {
    const updatedOrder = { ...order };
    updatedOrder[data].quantity = 0;
    setOrder(updatedOrder);
    setNewOrder({});
  };

  const onAddItem = (data) => {
    const updatedOrder = { ...order };
    updatedOrder[data].quantity = updatedOrder[data].quantity + 1;
    setOrder(updatedOrder);
    setNewOrder({});
  };

  const onRemoveItem = (data) => {
    const updatedOrder = { ...order };
    updatedOrder[data].quantity = updatedOrder[data].quantity - 1;
    setOrder(updatedOrder);
    setNewOrder({});
  };

  const onOrder = () => {
    if (totalAmountOfItems === 0) {
      return;
    }
    setModalIsVisible(true);
    setNewOrder({});
  };

  const onClose = () => {
    setModalIsVisible(false);
    setAllNecessaryInformationIsAvailable(true);
  };

  const onConfirm = () => {
    if (telephoneValue === "" || addressValue === "") {
      setAllNecessaryInformationIsAvailable(false);
      return;
    }
    if (
      telephoneValue !== fetchedTelephoneValue ||
      addressValue !== fetchedAddressValue
    ) {
      (async () => {
        await axios.delete(
          `https://react-project-server-default-rtdb.firebaseio.com/myAppOrders/${
            user && user.replace(".", "_")
          }/contact.json`
        );
        await postContact();
        if (errorPostContactMessage === "") {
          postData();
        }
      })();
    }
    setModalIsVisible(false);
    setAllNecessaryInformationIsAvailable(true);
    Object.keys(order).forEach((el) => {
      order[el].quantity = 0;
    });
  };

  const onLoginSignUpClicked = () => {
    history.push("/auth");
    onClose();
  };

  const onLogoutHandler = () => {
    setNewOrder({});
    setLoggedIn(false);
    setUser("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    history.push("/");
  };

  const onChangeTelephoneValueHandler = (e) => {
    setTelephoneValue(e.target.value);
  };

  const onChangeAddressValueHandler = (e) => {
    setAddressValue(e.target.value);
  };

  useEffect(() => {
    if (
      loggedIn &&
      modalIsVisible &&
      telephoneValue === "" &&
      addressValue === ""
    ) {
      getContact();
    }
  }, [loggedIn, modalIsVisible, telephoneValue, addressValue]);

  return (
    <Fragment>
      {error || errorPostContact ? (
        <div>{errorItself}</div>
      ) : (
        <Fragment>
          {loading || loadingPostContact ? (
            <Spinner />
          ) : (
            <Fragment>
              <Header
                itemsNumber={totalAmountOfItems}
                user={user}
                onLogoutHandler={onLogoutHandler}
                loggedIn={loggedIn}
              />
              <Switch>
                <Route path="/orders">
                  <SavedOrders user={user} />
                </Route>
                <Route path="/auth">
                  <LoginSignUp
                    setLoggedIn={setLoggedIn}
                    setUser={setUser}
                    setToken={setToken}
                  />
                </Route>
                <Route path="">
                  <Fragment>
                    <Fragment>
                      {modalIsVisible && (
                        <Modal
                          onClose={onClose}
                          onConfirm={onConfirm}
                          order={order}
                          onLoginSignUpClicked={onLoginSignUpClicked}
                          loggedIn={loggedIn}
                        >
                          <ContactForm
                            telephoneValue={telephoneValue}
                            onChangeTelephoneValueHandler={
                              onChangeTelephoneValueHandler
                            }
                            addressValue={addressValue}
                            onChangeAddressValueHandler={
                              onChangeAddressValueHandler
                            }
                            allNecessaryInformationIsAvailable={
                              allNecessaryInformationIsAvailable
                            }
                          />
                        </Modal>
                      )}
                      <CurrentOrder order={order}>
                        {totalAmountOfItems !== 0 &&
                          Object.keys(order).map((el) => {
                            if (order[el].quantity > 0) {
                              return (
                                <OrderItem
                                  key={order[el].name}
                                  name={order[el].name}
                                  quantity={order[el].quantity}
                                  price={order[el].price}
                                  onCancelItem={() => onCancelItem(el)}
                                  onAddItem={() => onAddItem(el)}
                                  onRemoveItem={() => onRemoveItem(el)}
                                ></OrderItem>
                              );
                            }
                            return null;
                          })}
                      </CurrentOrder>
                      <OrderButton onOrder={onOrder} loggedIn={loggedIn} />
                    </Fragment>
                    <Meals setNewOrder={setNewOrder} />
                  </Fragment>
                </Route>
              </Switch>
            </Fragment>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default MainContainer;
