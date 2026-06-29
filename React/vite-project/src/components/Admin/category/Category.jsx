import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { FaPlus, FaTags } from "react-icons/fa";
import {
    createAdminCategory,
    deleteAdminCategory,
    fetchAdminCategories,
    updateAdminCategory,
} from "../../../store/actions/categoryActions";
import Loader from "../../shared/Loader";
import ErrorPage from "../../shared/ErrorPage";
import Paginations from "../../common/Pagination";
import CategoryFormModal from "./CategoryFormModal";
import CategoryTable from "./CategoryTable";

const Category = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const [modal, setModal] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const { isLoading, errorMessage } = useSelector((state) => state.errors);
    const { categories, categoryPagination } = useSelector((state) => state.admin);

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const sortBy = searchParams.get("sortBy") || "categoryId";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const loadCategories = () => {
        const query = new URLSearchParams({
            pageNumber: String(page - 1),
            pageSize: "10",
            sortBy,
            sortOrder,
        });
        return dispatch(fetchAdminCategories(query.toString()));
    };

    useEffect(() => {
        loadCategories();
    }, [dispatch, page, sortBy, sortOrder]);

    const updateSort = (event) => {
        const [nextSortBy, nextSortOrder] = event.target.value.split(":");
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set("sortBy", nextSortBy);
        nextParams.set("sortOrder", nextSortOrder);
        nextParams.set("page", "1");
        setSearchParams(nextParams);
    };

    const saveCategory = async (categoryName) => {
        const wasSaved = modal?.category
            ? await dispatch(updateAdminCategory(modal.category.categoryId, categoryName))
            : await dispatch(createAdminCategory(categoryName));

        if (wasSaved) {
            setModal(null);
            if (!modal?.category) loadCategories();
        }
        return wasSaved;
    };

    const removeCategory = async (category) => {
        const confirmed = window.confirm(
            `Delete category #${category.categoryId} (${category.categoryName})? Products in this category may also be deleted. This cannot be undone.`,
        );
        if (!confirmed) return;

        setDeletingId(category.categoryId);
        const wasDeleted = await dispatch(deleteAdminCategory(category.categoryId));
        setDeletingId(null);

        if (wasDeleted && categories.length === 1 && page > 1) {
            const nextParams = new URLSearchParams(searchParams);
            nextParams.set("page", String(page - 1));
            setSearchParams(nextParams);
        }
    };

    if (isLoading) return <Loader text="Loading categories..." />;
    if (errorMessage) return <ErrorPage message={errorMessage} />;

    return (
        <section className="mx-auto max-w-6xl space-y-6">
            <header className="flex flex-col gap-4 rounded-3xl bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-8 text-white shadow-xl sm:flex-row sm:items-end sm:justify-between sm:px-9">
                <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">
                        <FaTags /> Category management
                    </span>
                    <h1 className="mt-4 text-3xl font-bold">Categories</h1>
                    <p className="mt-2 text-sm text-slate-300">
                        Organize the product catalogue.
                    </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3">
                    <p className="text-xs font-semibold uppercase text-slate-300">Total categories</p>
                    <p className="mt-1 text-2xl font-bold">{categoryPagination.totalElements}</p>
                </div>
            </header>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        type="button"
                        onClick={() => setModal({ category: null })}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                        <FaPlus /> Add category
                    </button>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                        Sort by
                        <select
                            value={`${sortBy}:${sortOrder}`}
                            onChange={updateSort}
                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                        >
                            <option value="categoryId:desc">Newest first</option>
                            <option value="categoryId:asc">Oldest first</option>
                            <option value="categoryName:asc">Name A–Z</option>
                            <option value="categoryName:desc">Name Z–A</option>
                        </select>
                    </label>
                </div>

                <CategoryTable
                    categories={categories}
                    deletingId={deletingId}
                    onEdit={(category) => setModal({ category })}
                    onDelete={removeCategory}
                />

                {categoryPagination.totalPages > 1 && (
                    <div className="flex justify-center border-t border-slate-200 px-5 py-4">
                        <Paginations numberOfPage={categoryPagination.totalPages} />
                    </div>
                )}
            </div>

            {modal && (
                <CategoryFormModal
                    category={modal.category}
                    onClose={() => setModal(null)}
                    onSave={saveCategory}
                />
            )}
        </section>
    );
};

export default Category;
