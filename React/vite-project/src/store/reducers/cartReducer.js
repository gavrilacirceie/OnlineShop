const initialState = {
    cart: [],
    totalPrice: 0,
};

export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_CART":
            return { ...state, cart: action.payload };
        case "SET_TOTAL_PRICE":
            return { ...state, totalPrice: action.payload };
        case "CLEAR_CART":
            return { ...state, cart: [], totalPrice: 0 };
        default:
            return state;
    }
};

