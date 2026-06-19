import {configureStore} from "@reduxjs/toolkit";
import {productReducer} from "./ProductReducer.js";
import {errorReducer} from "./errorReducer.js";

export const store = configureStore({
    reducer: {
        products: productReducer,
        error: errorReducer,
    },
    preloadedState: {},
});

export default store;