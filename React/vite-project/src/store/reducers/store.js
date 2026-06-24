import {configureStore} from "@reduxjs/toolkit";
import {productReducer} from "./ProductReducer.js";
import {errorReducer} from "./errorReducer.js";
import {authReducer} from "./authReducer.js";
import {cartReducer} from "./cartReducer.js";

const cartItems = localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [];

const initialState = {
    carts: { cart: cartItems },
};
export const store = configureStore({
    reducer: {
        products: productReducer,
        error: errorReducer,
        auth: authReducer,
        carts: cartReducer,
    },
    preloadedState: initialState,
});

export default store;