const initialState = {
    cart: [],
    totalPrice: 0,
    cartId: null,
};

export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case "ADD_TO_CART": {
            const product = action.payload;
            const existingProduct = state.cart.find(
                (item) => item.productId === product.productId
            );

            if (existingProduct) {
                const updatedCart = state.cart.map((item) => {
                    if(item.productId === product.productId) {
                        return product;
                    }
                    else{
                        return item;
                    }
                });

                return {
                    ...state,
                    cart: updatedCart,
                }
            }else {
                const newCart = [...state.cart, product];
                return {
                    ...state,
                    cart: newCart,
                }
            }
        }
        case "SET_TOTAL_PRICE":
            return { ...state, totalPrice: action.payload };
        case "INCREMENT":
        case "DECREMENT": {
            const updatedItem = action.payload;
            const updatedCartQty = state.cart.map((item) =>
                item.productId === updatedItem.productId ? updatedItem : item
            );
            return { ...state, cart: updatedCartQty };
        }
        case "REMOVE_FROM_CART": {
            const filteredCart = state.cart.filter(
                (item) => item.productId !== action.payload
            );
            return { ...state, cart: filteredCart };
        }
        case "GET_USER_CART_PRODUCTS":
            return {
                ...state,
                cart: action.payload || [],
                totalPrice: action.totalPrice || 0,
                cartId: action.cartId || null,
            };
        case "CLEAR_CART":
            return { ...state, cart: [], totalPrice: 0, cartId: null };
        default:
            return state;
    }
};
