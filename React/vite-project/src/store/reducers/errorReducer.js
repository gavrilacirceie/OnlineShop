const initialState = {
    isLoading: false,
    errorMessage: null,
    categoryLoader: false,
    categoryError: null,
    btnLoader: false,
};

export const errorReducer = (state = initialState, action) => {
    switch (action.type) {
        case "IS_FETCHING":
            return {
                ...state,
                isLoading: true,
                errorMessage: null,
            };
        case "FETCH_PRODUCTS_SUCCESS":
        case "IS_SUCCESS":
            return {
                ...state,
                isLoading: false,
                errorMessage: null,
            };
        case "IS_ERROR":
            return {
                ...state,
                isLoading: false,
                errorMessage: action.payload,
            };
        case "CATEGORY_SUCCESS":
            return {
                ...state,
                categoryLoader: false,
                categoryError: null,
            };
        case "CATEGORY_LOADING":
            return {
                ...state,
                categoryLoader: true,
            };
        case "BTN_LOADER":
            return {
                ...state,
                btnLoader: true,
            };
        case "BTN_LOADER_DONE":
            return {
                ...state,
                btnLoader: false,
            };
        default:
            return state;
    }
}
