import toast from "react-hot-toast";
import api from "../../api/api";

export const fetchAdminCategories = (queryString) => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.get(`/public/categories?${queryString}`);
        dispatch({
            type: "FETCH_ADMIN_CATEGORIES",
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
            payload: error?.response?.data?.message || "Failed to fetch categories",
        });
    }
};

export const createAdminCategory = (categoryName) => async () => {
    try {
        await api.post("/public/categories", { categoryName });
        toast.success("Category created successfully");
        return true;
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Failed to create category");
        return false;
    }
};

export const updateAdminCategory = (categoryId, categoryName) => async (dispatch) => {
    try {
        const { data } = await api.put(`/public/categories/${categoryId}`, {
            categoryName,
        });
        dispatch({ type: "UPDATE_ADMIN_CATEGORY", payload: data });
        toast.success(`Category #${categoryId} updated`);
        return true;
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Failed to update category");
        return false;
    }
};

export const deleteAdminCategory = (categoryId) => async (dispatch) => {
    try {
        await api.delete(`/admin/categories/${categoryId}`);
        dispatch({ type: "DELETE_ADMIN_CATEGORY", payload: categoryId });
        toast.success(`Category #${categoryId} deleted`);
        return true;
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Failed to delete category");
        return false;
    }
};
