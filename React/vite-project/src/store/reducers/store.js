import {configureStore} from "@reduxjs/toolkit";
import {productReducer} from "./ProductReducer.js";
import {errorReducer} from "./errorReducer.js";
import {authReducer} from "./authReducer.js";
import {cartReducer} from "./cartReducer.js";
import {paymentMethodReducer} from "./paymentMethodReducer.js";
import {adminReducer} from "./adminReducer.js";

const cartItems = localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [];

const user = localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth")) : [];

const selectUserCheckoutAddress = localStorage.getItem("CHECKOUT_ADDRESS")
    ? JSON.parse(localStorage.getItem("CHECKOUT_ADDRESS"))
    : [];

const initialState = {
    auth: {
        user: user,
        address: [],
        orders: [],
        orderPagination: {
            pageNumber: 0,
            pageSize: 10,
            totalElements: 0,
            totalPages: 0,
            lastPage: true,
        },
        clientSecret: null,
        selectedUserCheckoutAddress: selectUserCheckoutAddress,
    },
    carts: { cart: cartItems },
};
export const store = configureStore({
    reducer: {
        products: productReducer,
        errors: errorReducer,
        auth: authReducer,
        carts: cartReducer,
        payment: paymentMethodReducer,
        admin: adminReducer,
    },
    preloadedState: initialState,
});

export default store;
