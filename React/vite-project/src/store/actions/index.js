import api from "../../api/api.js";
import toast from "react-hot-toast";

export const fetchProducts = (queryString) => async dispatch => {
    try{
        dispatch({type: "IS_FETCHING"});
        const {data} = await api.get(`/public/products?${queryString}`);
        dispatch({
            type: 'FETCH_PRODUCTS',
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalItems,
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
    dispatch({ type: "CLEAR_CART" });
    localStorage.removeItem("auth");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("CHECKOUT_ADDRESS");
    localStorage.removeItem("client-secret");
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
        await dispatch(getUserCart());
    } catch {
        dispatch(clearAuth());
    }
};

export const updateCurrentUserProfile =
    (sendData, toast, setOpenProfileModal) => async (dispatch) => {
        try {
            dispatch({ type: "BTN_LOADER" });
            const { data } = await api.put("/auth/user", sendData);
            dispatch({ type: "LOGIN_USER", payload: data });
            localStorage.setItem("auth", JSON.stringify(data));
            toast.success("Profile updated successfully");
            dispatch({ type: "IS_SUCCESS" });
            setOpenProfileModal(false);
        } catch (error) {
            console.log(error);
            dispatch({ type: "IS_ERROR", payload: error?.response?.data?.message || "Failed to update profile" });
            toast.error(error?.response?.data?.message || "Failed to update profile");
        } finally {
            dispatch({ type: "BTN_LOADER_DONE" });
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
        await dispatch(getUserCart());
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

export const placeCashOrder = (addressId, toast, navigate) => async (dispatch) => {
    try {
        dispatch({ type: "BTN_LOADER" });
        await api.post("/order/users/payments/Cash", {
            addressId,
            paymentMethod: "Cash",
            pgName: "Cash on delivery",
            pgPaymentId: "COD",
            pgStatus: "PENDING",
            pgResponseMessage: "Payment will be collected on delivery",
        });

        dispatch({ type: "CLEAR_CART" });
        localStorage.removeItem("cartItems");
        toast.success("Order placed successfully");
        navigate("/");
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Failed to place order");
    } finally {
        dispatch({ type: "BTN_LOADER_DONE" });
    }
};

export const fetchUserOrders = (queryString) => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.get(`/orders/user?${queryString}`);
        dispatch({
            type: "USER_ORDERS",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch your orders",
        });
    }
};

export const createUserCart = (sendCartItems, shouldSetLoading = true) => async (dispatch) => {
    try {
        if (shouldSetLoading) {
            dispatch({ type: "IS_FETCHING" });
        }
        await api.post('/cart/create', sendCartItems);
        await dispatch(getUserCart(shouldSetLoading));
        return true;
    } catch (error) {
        console.log(error);
        dispatch({
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to create cart items",
        });
        return false;
    }
};

export const getUserCart = (shouldSetLoading = true) => async (dispatch, getState) => {
    try {
        if (shouldSetLoading) {
            dispatch({ type: "IS_FETCHING" });
        }
        const { data } = await api.get('/carts/users/cart');

        dispatch({
            type: "GET_USER_CART_PRODUCTS",
            payload: data.products || [],
            totalPrice: data.totalPrice,
            cartId: data.cartId
        })
        localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
        if (shouldSetLoading) {
            dispatch({ type: "IS_SUCCESS" });
        }
    } catch (error) {
        console.log(error);
        dispatch({ type: "CLEAR_CART" });
        localStorage.removeItem("cartItems");
        dispatch({
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch cart items",
        });
    }
};

export const createStripePaymentSecret
    = (sendData) => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.post("/order/stripe-client-secret", sendData);
        dispatch({ type: "CLIENT_SECRET", payload: data });
        localStorage.setItem("client-secret", JSON.stringify(data));
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Failed to create client secret");
    }
};

export const analyticsAction = () => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING"});
        const { data } = await api.get('/admin/app/analytics');
        dispatch({
            type: "FETCH_ANALYTICS",
            payload: data,
        })
        dispatch({ type: "IS_SUCCESS"});
    } catch (error) {
        dispatch({
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch analytics data",
        });
    }
};

export const fetchAdminOrders = (queryString, scope = "admin") => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.get(`/${scope}/orders?${queryString}`);
        dispatch({
            type: "FETCH_ADMIN_ORDERS",
            payload: data.content,
            pagination: {
                pageNumber: data.pageNumber,
                pageSize: data.pageSize,
                totalElements: data.totalElements,
                totalPages: data.totalPages,
                lastPage: data.lastPage,
            },
        });
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        dispatch({
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch orders",
        });
    }
};

export const fetchAdminSellers = (pageNumber = 0) => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.get(`/auth/sellers?pageNumber=${pageNumber}`);

        dispatch({
            type: "FETCH_ADMIN_SELLERS",
            payload: data.content,
            pagination: {
                pageNumber: data.pageNumber,
                pageSize: data.pageSize,
                totalElements: data.totalElements,
                totalPages: data.totalPages,
                lastPage: data.lastPage,
            },
        });
        dispatch({ type: "IS_SUCCESS" });
        return true;
    } catch (error) {
        dispatch({
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch sellers",
        });
        return false;
    }
};

export const createAdminSeller = (seller) => async () => {
    try {
        await api.post("/auth/signup", {
            username: seller.username,
            email: seller.email,
            password: seller.password,
            roles: ["seller"],
        });
        toast.success("Seller created successfully");
        return true;
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Failed to create seller");
        return false;
    }
};

export const updateAdminOrderStatus = (orderId, status) => async (dispatch) => {
    try {
        const { data } = await api.put(`/admin/orders/${orderId}/status`, { status });
        dispatch({
            type: "UPDATE_ADMIN_ORDER_STATUS",
            payload: data,
        });
        toast.success(`Order #${orderId} status updated`);
        return true;
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Failed to update order status");
        return false;
    }
};

export const fetchAdminProducts = (queryString, scope = "admin") => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const path = scope === "seller" ? "/seller/products" : "/public/products";
        const { data } = await api.get(`${path}?${queryString}`);
        dispatch({
            type: "FETCH_ADMIN_PRODUCTS",
            payload: data.content,
            pagination: {
                pageNumber: data.pageNumber,
                pageSize: data.pageSize,
                totalElements: data.totalItems,
                totalPages: data.totalPages,
                lastPage: data.lastPage,
            },
        });
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        dispatch({
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch products",
        });
    }
};

export const createAdminProduct = (categoryId, product, image, scope = "admin") => async () => {
    try {
        const { data } = await api.post(
            `/${scope}/categories/${categoryId}/product`,
            product,
        );

        if (image) {
            const imageData = new FormData();
            imageData.append("image", image);

            try {
                const imagePath = scope === "seller"
                    ? `/seller/products/${data.productId}/image`
                    : `/products/${data.productId}/image`;
                await api.put(imagePath, imageData);
            } catch (imageError) {
                console.log(imageError);
                toast.error(
                    imageError?.response?.data?.message
                    || "Product created, but its image could not be uploaded",
                );
                return true;
            }
        }

        toast.success("Product created successfully");
        return true;
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Failed to create product");
        return false;
    }
};

export const updateAdminProduct = (productId, product, scope = "admin") => async (dispatch) => {
    try {
        const path = scope === "seller"
            ? `/seller/products/${productId}`
            : `/public/products/${productId}`;
        const { data } = await api.put(path, product);
        dispatch({
            type: "UPDATE_ADMIN_PRODUCT",
            payload: data,
        });
        toast.success(`Product #${productId} updated`);
        return true;
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Failed to update product");
        return false;
    }
};

export const deleteAdminProduct = (productId, scope = "admin") => async (dispatch) => {
    try {
        await api.delete(`/${scope}/products/${productId}`);
        dispatch({
            type: "DELETE_ADMIN_PRODUCT",
            payload: productId,
        });
        toast.success(`Product #${productId} deleted`);
        return true;
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Failed to delete product");
        return false;
    }
};

export const stripePaymentConfirmation
    = (sendData, setErrorMesssage, setLoadng, toast) => async (dispatch) => {
    try {
        const response  = await api.post("/order/users/payments/online", sendData);
        if (response.data) {
            localStorage.removeItem("CHECKOUT_ADDRESS");
            localStorage.removeItem("cartItems");
            localStorage.removeItem("client-secret");
            dispatch({ type: "REMOVE_CLIENT_SECRET_ADDRESS"});
            dispatch({ type: "CLEAR_CART"});
            toast.success("Order Accepted");
        } else {
            setErrorMesssage("Payment Failed. Please try again.");
        }
    } catch {
        setErrorMesssage("Payment Failed. Please try again.");
    }
};
