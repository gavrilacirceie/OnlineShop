import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
    FaBoxOpen,
    FaEdit,
    FaPlus,
    FaSearch,
    FaTrash,
    FaTimes,
} from "react-icons/fa";
import {
    createAdminProduct,
    deleteAdminProduct,
    fetchCategories,
    fetchAdminProducts,
    updateAdminProduct,
} from "../../../store/actions";
import { formatPrice } from "../../../utils/formatPrice";
import Loader from "../../shared/Loader";
import ErrorPage from "../../shared/ErrorPage";
import Paginations from "../../common/Pagination";

const emptyEdit = {
    productName: "",
    productDescription: "",
    quantity: 0,
    productPrice: 0,
    discountPrice: 0,
};

const emptyProduct = {
    categoryId: "",
    productName: "",
    productDescription: "",
    quantity: 0,
    productPrice: "",
    discountPrice: 0,
};

const AdminProducts = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("keyword") || "");
    const [editingProductId, setEditingProductId] = useState(null);
    const [editValues, setEditValues] = useState(emptyEdit);
    const [savingProductId, setSavingProductId] = useState(null);
    const [deletingProductId, setDeletingProductId] = useState(null);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [newProduct, setNewProduct] = useState(emptyProduct);
    const [newProductImage, setNewProductImage] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { isLoading, errorMessage } = useSelector((state) => state.errors);
    const { products, productPagination } = useSelector((state) => state.admin);
    const { categories } = useSelector((state) => state.products);

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const sortBy = searchParams.get("sortBy") || "productId";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const keyword = searchParams.get("keyword") || "";

    useEffect(() => {
        const query = new URLSearchParams({
            pageNumber: String(page - 1),
            pageSize: "10",
            sortBy,
            sortOrder,
        });

        if (keyword) query.set("keyword", keyword);
        dispatch(fetchAdminProducts(query.toString()));
    }, [dispatch, keyword, page, sortBy, sortOrder]);

    useEffect(() => {
        dispatch(fetchCategories("pageNumber=0&pageSize=100&sortBy=categoryName&sortOrder=asc"));
    }, [dispatch]);

    const updateSort = (event) => {
        const [nextSortBy, nextSortOrder] = event.target.value.split(":");
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set("sortBy", nextSortBy);
        nextParams.set("sortOrder", nextSortOrder);
        nextParams.set("page", "1");
        setSearchParams(nextParams);
    };

    const submitSearch = (event) => {
        event.preventDefault();
        const nextParams = new URLSearchParams(searchParams);
        const trimmedSearch = search.trim();

        if (trimmedSearch) {
            nextParams.set("keyword", trimmedSearch);
        } else {
            nextParams.delete("keyword");
        }

        nextParams.set("page", "1");
        setSearchParams(nextParams);
    };

    const beginEdit = (product) => {
        setEditingProductId(product.productId);
        setEditValues({
            productName: product.productName,
            productDescription: product.productDescription,
            quantity: product.quantity,
            productPrice: product.productPrice,
            discountPrice: product.discountPrice,
        });
    };

    const updateEditValue = (event) => {
        const { name, value } = event.target;
        setEditValues((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const updateNewProductValue = (event) => {
        const { name, value } = event.target;
        setNewProduct((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const closeAddProduct = () => {
        if (isCreating) return;
        setShowAddProduct(false);
        setNewProduct(emptyProduct);
        setNewProductImage(null);
    };

    const addProduct = async (event) => {
        event.preventDefault();
        const productPrice = Number(newProduct.productPrice);
        const discountPrice = Number(newProduct.discountPrice);
        const payload = {
            productName: newProduct.productName.trim(),
            productDescription: newProduct.productDescription.trim(),
            quantity: Number(newProduct.quantity),
            productPrice,
            discountPrice,
            specialPrice: productPrice - (discountPrice / 100) * productPrice,
        };

        setIsCreating(true);
        const wasCreated = await dispatch(
            createAdminProduct(newProduct.categoryId, payload, newProductImage),
        );
        setIsCreating(false);

        if (wasCreated) {
            closeAddProduct();
            const query = new URLSearchParams({
                pageNumber: String(page - 1),
                pageSize: "10",
                sortBy,
                sortOrder,
            });
            if (keyword) query.set("keyword", keyword);
            dispatch(fetchAdminProducts(query.toString()));
        }
    };

    const saveProduct = async (product) => {
        const confirmed = window.confirm(
            `Save changes to product #${product.productId} (${product.productName})?`,
        );
        if (!confirmed) return;

        const productPrice = Number(editValues.productPrice);
        const discountPrice = Number(editValues.discountPrice);
        const payload = {
            ...product,
            ...editValues,
            quantity: Number(editValues.quantity),
            productPrice,
            discountPrice,
            specialPrice: productPrice - (discountPrice / 100) * productPrice,
        };

        setSavingProductId(product.productId);
        const wasUpdated = await dispatch(
            updateAdminProduct(product.productId, payload),
        );
        setSavingProductId(null);

        if (wasUpdated) setEditingProductId(null);
    };

    const removeProduct = async (product) => {
        const confirmed = window.confirm(
            `Delete product #${product.productId} (${product.productName})? This cannot be undone.`,
        );
        if (!confirmed) return;

        setDeletingProductId(product.productId);
        const wasDeleted = await dispatch(deleteAdminProduct(product.productId));
        setDeletingProductId(null);

        if (wasDeleted && products.length === 1 && page > 1) {
            const nextParams = new URLSearchParams(searchParams);
            nextParams.set("page", String(page - 1));
            setSearchParams(nextParams);
        }
    };

    if (isLoading) return <Loader text="Loading products..." />;
    if (errorMessage) return <ErrorPage message={errorMessage} />;

    return (
        <section className="mx-auto max-w-7xl space-y-6">
            <header className="rounded-3xl bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-8 text-white shadow-xl sm:px-9">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">
                            <FaBoxOpen aria-hidden="true" />
                            Product management
                        </span>
                        <h1 className="mt-4 text-3xl font-bold tracking-tight">Products</h1>
                        <p className="mt-2 text-sm text-slate-300">
                            Review inventory, pricing, and product details.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                            Total products
                        </p>
                        <p className="mt-1 text-2xl font-bold">
                            {Number(productPagination.totalElements || 0).toLocaleString()}
                        </p>
                    </div>
                </div>
            </header>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-1 flex-col gap-2 sm:flex-row">
                        <form onSubmit={submitSearch} className="flex max-w-md flex-1">
                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search products..."
                                className="min-w-0 flex-1 rounded-l-lg border border-r-0 border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                            />
                            <button
                                type="submit"
                                className="rounded-r-lg bg-blue-600 px-4 text-white transition hover:bg-blue-700"
                                aria-label="Search products"
                            >
                                <FaSearch />
                            </button>
                        </form>
                        <button
                            type="button"
                            onClick={() => setShowAddProduct(true)}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                        >
                            <FaPlus aria-hidden="true" />
                            Add product
                        </button>
                    </div>

                    <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                        Sort by
                        <select
                            value={`${sortBy}:${sortOrder}`}
                            onChange={updateSort}
                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500"
                        >
                            <option value="productId:desc">Newest first</option>
                            <option value="productId:asc">Oldest first</option>
                            <option value="productName:asc">Name A–Z</option>
                            <option value="productPrice:desc">Highest price</option>
                            <option value="productPrice:asc">Lowest price</option>
                            <option value="quantity:asc">Lowest stock</option>
                        </select>
                    </label>
                </div>

                {products.length === 0 ? (
                    <div className="px-6 py-16 text-center text-slate-500">
                        No products found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    <th className="px-5 py-3.5">Product</th>
                                    <th className="px-5 py-3.5">Description</th>
                                    <th className="px-5 py-3.5">Stock</th>
                                    <th className="px-5 py-3.5">Price</th>
                                    <th className="px-5 py-3.5">Discount</th>
                                    <th className="px-5 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {products.map((product) => {
                                    const isEditing = editingProductId === product.productId;
                                    return (
                                        <tr key={product.productId} className="align-top hover:bg-slate-50/80">
                                            <td className="px-5 py-4">
                                                {isEditing ? (
                                                    <div className="flex min-w-56 items-center gap-3">
                                                        <img
                                                            src={product.image}
                                                            alt={product.productName}
                                                            className="h-12 w-12 rounded-lg border border-slate-200 object-cover"
                                                        />
                                                        <div className="min-w-0">
                                                            <input
                                                                name="productName"
                                                                value={editValues.productName}
                                                                onChange={updateEditValue}
                                                                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                                                            />
                                                            <p className="text-xs text-slate-500">#{product.productId}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedProduct(product)}
                                                        className="flex min-w-56 items-center gap-3 rounded-lg text-left outline-none transition hover:text-blue-700 focus:ring-2 focus:ring-blue-500"
                                                        aria-label={`View details for ${product.productName}`}
                                                    >
                                                        <img
                                                            src={product.image}
                                                            alt={product.productName}
                                                            className="h-12 w-12 rounded-lg border border-slate-200 object-cover"
                                                        />
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-slate-900">
                                                                {product.productName}
                                                            </p>
                                                            <p className="text-xs text-slate-500">#{product.productId}</p>
                                                        </div>
                                                    </button>
                                                )}
                                            </td>
                                            <td className="max-w-xs px-5 py-4 text-sm text-slate-600">
                                                {isEditing ? (
                                                    <textarea
                                                        name="productDescription"
                                                        value={editValues.productDescription}
                                                        onChange={updateEditValue}
                                                        rows="2"
                                                        className="w-full min-w-56 rounded-lg border border-slate-300 px-2 py-1.5"
                                                    />
                                                ) : (
                                                    <p className="line-clamp-2">{product.productDescription}</p>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        name="quantity"
                                                        min="0"
                                                        value={editValues.quantity}
                                                        onChange={updateEditValue}
                                                        className="w-20 rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                                                    />
                                                ) : (
                                                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${product.quantity > 5 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                                                        {product.quantity} in stock
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        name="productPrice"
                                                        min="0"
                                                        step="0.01"
                                                        value={editValues.productPrice}
                                                        onChange={updateEditValue}
                                                        className="w-24 rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                                                    />
                                                ) : (
                                                    <div>
                                                        <p className="font-semibold text-slate-900">
                                                            {formatPrice(product.specialPrice)}
                                                        </p>
                                                        {product.discountPrice > 0 && (
                                                            <p className="text-xs text-slate-400 line-through">
                                                                {formatPrice(product.productPrice)}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                {isEditing ? (
                                                    <div className="flex items-center">
                                                        <input
                                                            type="number"
                                                            name="discountPrice"
                                                            min="0"
                                                            max="100"
                                                            step="0.01"
                                                            value={editValues.discountPrice}
                                                            onChange={updateEditValue}
                                                            className="w-20 rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                                                        />
                                                        <span className="ml-1 text-sm text-slate-500">%</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-slate-600">
                                                        {product.discountPrice || 0}%
                                                    </span>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-right">
                                                {isEditing ? (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => saveProduct(product)}
                                                            disabled={savingProductId === product.productId}
                                                            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                                                        >
                                                            {savingProductId === product.productId ? "Saving..." : "Save"}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setEditingProductId(null)}
                                                            disabled={savingProductId === product.productId}
                                                            className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-end gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => beginEdit(product)}
                                                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                                                            aria-label={`Edit ${product.productName}`}
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeProduct(product)}
                                                            disabled={deletingProductId === product.productId}
                                                            className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-60"
                                                            aria-label={`Delete ${product.productName}`}
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {productPagination.totalPages > 1 && (
                    <div className="flex justify-center border-t border-slate-200 px-5 py-4">
                        <Paginations
                            numberOfPage={productPagination.totalPages}
                            totalProducts={productPagination.totalElements}
                        />
                    </div>
                )}
            </div>

            {showAddProduct && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="add-product-title"
                >
                    <form
                        onSubmit={addProduct}
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 id="add-product-title" className="text-xl font-bold text-slate-900">
                                    Add product
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Create a new product in the selected category.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeAddProduct}
                                disabled={isCreating}
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                                aria-label="Close add product form"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                                Category
                                <select
                                    name="categoryId"
                                    value={newProduct.categoryId}
                                    onChange={updateNewProductValue}
                                    required
                                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                                >
                                    <option value="">Select a category</option>
                                    {(categories || []).map((category) => (
                                        <option key={category.categoryId} value={category.categoryId}>
                                            {category.categoryName}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                                Product name
                                <input
                                    name="productName"
                                    value={newProduct.productName}
                                    onChange={updateNewProductValue}
                                    required
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                                />
                            </label>

                            <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                                Description
                                <textarea
                                    name="productDescription"
                                    value={newProduct.productDescription}
                                    onChange={updateNewProductValue}
                                    required
                                    rows="3"
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                                />
                            </label>

                            <label className="text-sm font-medium text-slate-700">
                                Quantity
                                <input
                                    type="number"
                                    name="quantity"
                                    min="0"
                                    value={newProduct.quantity}
                                    onChange={updateNewProductValue}
                                    required
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                                />
                            </label>

                            <label className="text-sm font-medium text-slate-700">
                                Price
                                <input
                                    type="number"
                                    name="productPrice"
                                    min="0.01"
                                    step="0.01"
                                    value={newProduct.productPrice}
                                    onChange={updateNewProductValue}
                                    required
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                                />
                            </label>

                            <label className="text-sm font-medium text-slate-700">
                                Discount (%)
                                <input
                                    type="number"
                                    name="discountPrice"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={newProduct.discountPrice}
                                    onChange={updateNewProductValue}
                                    required
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                                />
                            </label>

                            <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                                Product image
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp,image/gif"
                                    onChange={(event) =>
                                        setNewProductImage(event.target.files?.[0] || null)
                                    }
                                    className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                                />
                                <span className="mt-1 block text-xs text-slate-500">
                                    Optional. PNG, JPEG, WebP, or GIF.
                                </span>
                            </label>
                        </div>

                        <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4">
                            <button
                                type="button"
                                onClick={closeAddProduct}
                                disabled={isCreating}
                                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-60"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isCreating || !categories?.length}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isCreating ? "Creating..." : "Create product"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {selectedProduct && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="product-details-title"
                    onClick={() => setSelectedProduct(null)}
                >
                    <article
                        className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                                    Product #{selectedProduct.productId}
                                </p>
                                <h2 id="product-details-title" className="mt-1 text-xl font-bold text-slate-900">
                                    {selectedProduct.productName}
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedProduct(null)}
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                                aria-label="Close product details"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="grid gap-6 p-6 md:grid-cols-[minmax(0,280px)_1fr]">
                            <img
                                src={selectedProduct.image}
                                alt={selectedProduct.productName}
                                className="h-72 w-full rounded-xl border border-slate-200 object-contain"
                            />

                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                                    Description
                                </h3>
                                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                                    {selectedProduct.productDescription}
                                </p>

                                <dl className="mt-6 grid grid-cols-2 gap-4">
                                    <div className="rounded-xl bg-slate-50 p-4">
                                        <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Stock
                                        </dt>
                                        <dd className="mt-1 text-lg font-bold text-slate-900">
                                            {selectedProduct.quantity} units
                                        </dd>
                                    </div>
                                    <div className="rounded-xl bg-slate-50 p-4">
                                        <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Price
                                        </dt>
                                        <dd className="mt-1 text-lg font-bold text-slate-900">
                                            {formatPrice(selectedProduct.specialPrice)}
                                        </dd>
                                        {selectedProduct.discountPrice > 0 && (
                                            <p className="text-xs text-slate-500">
                                                {formatPrice(selectedProduct.productPrice)} before{" "}
                                                {selectedProduct.discountPrice}% discount
                                            </p>
                                        )}
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </article>
                </div>
            )}
        </section>
    );
};

export default AdminProducts;
