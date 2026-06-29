const initialState = {
    analytics: {
        productCount: 0,
        totalRevenue: 0,
        totalOrders: 0,
    },
    orders: [],
    orderPagination: {
        pageNumber: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        lastPage: true,
    },
    products: [],
    productPagination: {
        pageNumber: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        lastPage: true,
    },
    categories: [],
    categoryPagination: {
        pageNumber: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        lastPage: true,
    },
};

export const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_ANALYTICS":
            return {
                ...state,
                analytics: action.payload,
            };
        case "FETCH_ADMIN_ORDERS":
            return {
                ...state,
                orders: action.payload,
                orderPagination: action.pagination,
            };
        case "UPDATE_ADMIN_ORDER_STATUS":
            return {
                ...state,
                orders: state.orders.map((order) =>
                    order.id === action.payload.id
                        ? {
                            ...order,
                            orderStatus: action.payload.orderStatus,
                        }
                        : order
                ),
            };
        case "FETCH_ADMIN_PRODUCTS":
            return {
                ...state,
                products: action.payload,
                productPagination: action.pagination,
            };
        case "UPDATE_ADMIN_PRODUCT":
            return {
                ...state,
                products: state.products.map((product) =>
                    product.productId === action.payload.productId
                        ? {
                            ...product,
                            ...action.payload,
                            image: product.image,
                        }
                        : product
                ),
            };
        case "DELETE_ADMIN_PRODUCT": {
            const totalElements = Math.max(
                state.productPagination.totalElements - 1,
                0
            );
            return {
                ...state,
                products: state.products.filter(
                    (product) => product.productId !== action.payload
                ),
                productPagination: {
                    ...state.productPagination,
                    totalElements,
                    totalPages: Math.ceil(
                        totalElements / state.productPagination.pageSize
                    ),
                },
            };
        }
        case "FETCH_ADMIN_CATEGORIES":
            return {
                ...state,
                categories: action.payload,
                categoryPagination: action.pagination,
            };
        case "UPDATE_ADMIN_CATEGORY":
            return {
                ...state,
                categories: state.categories.map((category) =>
                    category.categoryId === action.payload.categoryId
                        ? action.payload
                        : category
                ),
            };
        case "DELETE_ADMIN_CATEGORY": {
            const totalElements = Math.max(
                state.categoryPagination.totalElements - 1,
                0
            );
            return {
                ...state,
                categories: state.categories.filter(
                    (category) => category.categoryId !== action.payload
                ),
                categoryPagination: {
                    ...state.categoryPagination,
                    totalElements,
                    totalPages: Math.ceil(
                        totalElements / state.categoryPagination.pageSize
                    ),
                },
            };
        }
        default:
            return state;
    }
};
