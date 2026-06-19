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
