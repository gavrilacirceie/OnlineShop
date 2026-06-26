import {configureStore} from "@reduxjs/toolkit";
import {productReducer} from "./ProductReducer.js";
import {errorReducer} from "./errorReducer.js";
import {authReducer} from "./authReducer.js";
import {cartReducer} from "./cartReducer.js";
import {paymentMethodReducer} from "./paymentMethodReducer.js";

const cartItems = localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [];

const user = localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth")) : []

const initialState = {
    auth: {user: user},
    carts: { cart: cartItems },
};
export const store = configureStore({
    reducer: {
        products: productReducer,
        errors: errorReducer,
        auth: authReducer,
        carts: cartReducer,
        payment: paymentMethodReducer,
    },
    preloadedState: initialState,
});

export default store;