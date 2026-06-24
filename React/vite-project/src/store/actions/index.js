import api from "../../api/api.js";

export const fetchProducts = (queryString) => async dispatch => {
    try{
        dispatch({type: "IS_FETCHING"});
        const {data} = await api.get(`/public/products?${queryString}`);
        dispatch({
            type: 'FETCH_PRODUCTS',
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({type: "FETCH_PRODUCTS_SUCCESS"});
    }catch(err){
        console.log(err);
        dispatch({type: "IS_ERROR", payload: err?.response?.data?.message || "Something went wrong"});
    }
}

export const fetchCategories = (queryString) => async dispatch => {
    try{
        dispatch({type: "CATEGORY_LOADING"});
        const {data} = await api.get(`/public/categories?${queryString}`);
        dispatch({
            type: 'FETCH_CATEGORY',
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({type: "CATEGORY_SUCCESS"});
    }catch(err){
        console.log(err);
        dispatch({type: "IS_ERROR", payload: err?.response?.data?.message || "Something went wrong"});
    }
}

export const logOutUser = (navigate) => (dispatch) => {
    dispatch({ type: "LOG_OUT" });
    localStorage.removeItem("auth");
    navigate("/login");
};

export const addToCart = (data, qty = 1, toast) => (dispatch, getState) => {
    const { products } = getState().products;
    const getProduct = products.find(item => item.productId === data.productId);

    const quantityExists = getProduct.quantity >= qty;
    if (quantityExists) {
        dispatch({type: "ADD_TO_CART", payload: {...data, quantity: qty}});
        localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart))
        toast.success(`${data?.productName} added to cart`);
    }else{
        toast.error(`${data?.productName} fail to add to cart`);
    }
};

export const incrementCartQuantity= (data, toast, currentQuantity, setCurrentQuantity) =>
    (dispatch, getState) => {
        const { products } = getState().products;
        let canIncrement = true;

        if (products) {
            const getProduct = products.find(item => item.productId === data.productId);
            if (getProduct) {
                canIncrement = getProduct.quantity >= currentQuantity + 1;
            }
        }

        if (canIncrement) {
            const newQuantity = currentQuantity + 1;
            setCurrentQuantity(newQuantity);

            dispatch({type: "INCREMENT", payload: {...data, quantity: newQuantity}});
            localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart))
        }else{
            toast.error(`${data?.productName} out of stock`);
        }

    };

export const decrementCartQuantity = (data, toast, currentQuantity, setCurrentQuantity) =>
    (dispatch, getState) => {
        if (currentQuantity <= 1) {
            toast.error("Minimum quantity is 1");
            return;
        }

        const newQuantity = currentQuantity - 1;
        setCurrentQuantity(newQuantity);

        dispatch({type: "DECREMENT", payload: {...data, quantity: newQuantity}});
        localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart))
    };

export const removeFromCart = (data, toast) => (dispatch, getState) => {
    dispatch({type: "REMOVE_FROM_CART", payload: data.productId});
    localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
    toast.success(`${data?.productName} removed from cart`);
};

