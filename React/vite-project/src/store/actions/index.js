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

export const clearAuth = () => (dispatch) => {
    dispatch({ type: "LOG_OUT" });
    localStorage.removeItem("auth");
};

export const logOutUser = (navigate) => async (dispatch) => {
    try {
        await api.post("/auth/signout");
    } catch (error) {
        console.log(error);
    } finally {
        dispatch(clearAuth());
        navigate("/login");
    }
};

export const loadCurrentUser = () => async (dispatch) => {
    try {
        const { data } = await api.get("/auth/user");
        dispatch({ type: "LOGIN_USER", payload: data });
        localStorage.setItem("auth", JSON.stringify(data));
    } catch {
        dispatch(clearAuth());
    }
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

export const authenticateSignInUser
    = (sendData, toast, reset, navigate, setLoader) => async (dispatch) => {
    try {
        setLoader(true);
        const { data } = await api.post("/auth/signin", sendData, { withCredentials: true });
        dispatch({ type: "LOGIN_USER", payload: data });
        localStorage.setItem("auth", JSON.stringify(data));
        reset();
        toast.success("Login Success");
        navigate("/");
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Internal Server Error");
    } finally {
        setLoader(false);
    }
}

export const authenticateSignUpUser
    = (sendData, toast, reset, navigate, setLoader) => async () => {
    try {
        setLoader(true);
        await api.post("/auth/signup", sendData);
        reset();
        toast.success("Registration successful! Please login.");
        navigate("/login");
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
        setLoader(false);
    }
}

export const addUpdateUserAddress =
    (sendData, toast, addressId, setOpenAddress) => async (dispatch) => {
        /*
        const { user } = getState().auth;
        await api.post(`/addresses`, sendData, {
              headers: { Authorization: "Bearer " + user.jwtToken },
            });
        */
        dispatch({ type:"BTN_LOADER" });
        try {
            if (!addressId) {
                await api.post("/addresses", sendData);
            } else {
                await api.put(`/addresses/${addressId}`, sendData);
            }
            dispatch(getUserAddresses());
            toast.success("Address saved successfully");
            dispatch({ type:"IS_SUCCESS" });
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Internal Server Error");
            dispatch({ type:"IS_ERROR", payload: null });
        } finally {
            dispatch({ type:"BTN_LOADER_DONE" });
            if (typeof setOpenAddress === "function") {
                setOpenAddress(false);
            }
        }
    };

export const getUserAddresses = () => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.get("/addresses/user");
        dispatch({type: "USER_ADDRESS", payload: data});
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch user addresses",
        });
    }
};

export const selectUserCheckoutAddress = (address) => {
    localStorage.setItem("CHECKOUT_ADDRESS", JSON.stringify(address));

    return {
        type: "SELECT_CHECKOUT_ADDRESS",
        payload: address,
    }
};

export const deleteUserAddress =
    (toast, addressId, setOpenDeleteModal) => async (dispatch) => {
        try {
            dispatch({ type: "BTN_LOADER" });
            await api.delete(`/addresses/${addressId}`);
            dispatch({ type: "IS_SUCCESS" });
            dispatch(getUserAddresses());
            dispatch(clearCheckoutAddress());
            toast.success("Address deleted successfully");
        } catch (error) {
            console.log(error);
            dispatch({
                type: "IS_ERROR",
                payload: error?.response?.data?.message || "Some Error Occured",
            });
        } finally {
            dispatch({ type: "BTN_LOADER_DONE" });
            setOpenDeleteModal(false);
        }
    };

export const clearCheckoutAddress = () => {
    return {
        type: "REMOVE_CHECKOUT_ADDRESS",
    }
};

export const addPaymentMethod = (paymentMethod) => {
    return {
        type: "ADD_PAYMENT_METHOD",
        payload: paymentMethod,
    }
};

export const createUserCart = (sendCartItems) => async (dispatch, getState) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        await api.post('/cart/create', sendCartItems);
        await dispatch(getUserCart());
    } catch (error) {
        console.log(error);
        dispatch({
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to create cart items",
        });
    }
};

export const getUserCart = () => async (dispatch, getState) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.get('/carts/users/cart');

        dispatch({
            type: "GET_USER_CART_PRODUCTS",
            payload: data.products,
            totalPrice: data.totalPrice,
            cartId: data.cartId
        })
        localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch cart items",
        });
    }
};
