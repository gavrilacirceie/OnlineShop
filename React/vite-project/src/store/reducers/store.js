import {configureStore} from "@reduxjs/toolkit";
import {productReducer} from "./ProductReducer.js";
import {errorReducer} from "./errorReducer.js";
import {authReducer} from "./authReducer.js";
import {cartReducer} from "./cartReducer.js";

export const store = configureStore({
    reducer: {
        products: productReducer,
        error: errorReducer,
        auth: authReducer,
        carts: cartReducer,
    },
    preloadedState: {},
});

export default store;