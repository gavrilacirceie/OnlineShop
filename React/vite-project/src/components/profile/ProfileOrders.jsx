import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
    FaBoxOpen,
    FaClipboardList,
    FaCreditCard,
    FaMapMarkerAlt,
} from "react-icons/fa";
import { fetchUserOrders } from "../../store/actions";
import { formatPrice } from "../../utils/formatPrice";
import Loader from "../shared/Loader";
import ErrorPage from "../shared/ErrorPage";
import Paginations from "../common/Pagination";

const statusClasses = {
    accepted: "bg-blue-50 text-blue-700 ring-blue-600/20",
    pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
    processing: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
    shipped: "bg-violet-50 text-violet-700 ring-violet-600/20",
    delivered: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    cancelled: "bg-red-50 text-red-700 ring-red-600/20",
    "order accepted": "bg-blue-50 text-blue-700 ring-blue-600/20",
};

const formatDate = (date) => {
    if (!date) return "—";

    return new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
};

const ProfileOrders = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const { isLoading, errorMessage } = useSelector((state) => state.errors);
    const { orders, orderPagination, user } = useSelector((state) => state.auth);
    const safeOrderPagination = orderPagination || {
        pageNumber: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        lastPage: true,
    };

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const sortBy = searchParams.get("sortBy") || "id";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    useEffect(() => {
        const query = new URLSearchParams({
            pageNumber: String(page - 1),
            pageSize: "10",
            sortBy,
            sortOrder,
        });

        dispatch(fetchUserOrders(query.toString()));
    }, [dispatch, page, sortBy, sortOrder]);

    const updateSort = (event) => {
        const [nextSortBy, nextSortOrder] = event.target.value.split(":");
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set("sortBy", nextSortBy);
        nextParams.set("sortOrder", nextSortOrder);
        nextParams.set("page", "1");
        setSearchParams(nextParams);
    };

    if (isLoading) {
        return <Loader text="Loading your orders..." />;
    }

    if (errorMessage && errorMessage !== "No orders found") {
        return <ErrorPage message={errorMessage} />;
    }

    return (
        <section className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-white to-amber-50 px-4 py-10">
            <div className="mx-auto max-w-7xl space-y-6">
                <header className="flex flex-col gap-4 rounded-3xl bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-8 text-white shadow-xl sm:flex-row sm:items-end sm:justify-between sm:px-9">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">
                            <FaClipboardList aria-hidden="true" />
                            My Orders
                        </span>
                        <h1 className="mt-4 text-3xl font-bold tracking-tight">
                            {user?.firstName ? `${user.firstName}'s order history` : "Your order history"}
                        </h1>
                        <p className="mt-2 text-sm text-slate-300">
                            Track every order, review purchased items, and check payment and delivery status.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 backdrop-blur">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                            Total orders
                        </p>
                        <p className="mt-1 text-2xl font-bold">
                            {Number(safeOrderPagination.totalElements || 0).toLocaleString()}
                        </p>
                    </div>
                </header>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="font-bold text-slate-900">Recent purchases</h2>
                            <p className="text-sm text-slate-500">
                                Every order shows its products, quantities, and pricing.
                            </p>
                        </div>

                        <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                            Sort by
                            <select
                                value={`${sortBy}:${sortOrder}`}
                                onChange={updateSort}
                                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="id:desc">Newest first</option>
                                <option value="id:asc">Oldest first</option>
                                <option value="totalAmount:desc">Highest total</option>
                                <option value="totalAmount:asc">Lowest total</option>
                                <option value="date:desc">Latest date</option>
                            </select>
                        </label>
                    </div>

                    {orders.length === 0 || errorMessage === "No orders found" ? (
                        <div className="flex flex-col items-center px-6 py-16 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                                <FaBoxOpen className="text-2xl" aria-hidden="true" />
                            </div>
                            <h3 className="mt-4 font-bold text-slate-900">No orders yet</h3>
                            <p className="mt-1 text-sm text-slate-500">
                                Once you place an order, it will appear here with all its details.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4 px-5 py-5">
                            {orders.map((order) => {
                                const statusKey = order.orderStatus?.toLowerCase() || "pending";
                                const itemCount = order.orderItems?.reduce(
                                    (total, item) => total + Number(item.quantity || 0),
                                    0,
                                ) || 0;

                                return (
                                    <div
                                        key={order.id}
                                        className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                                    >
                                        <div className="flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
                                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5 xl:gap-6">
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                                        Order
                                                    </p>
                                                    <p className="mt-1 text-lg font-bold text-slate-900">
                                                        #{order.id}
                                                    </p>
                                                    <p className="text-sm text-slate-500">
                                                        {itemCount} {itemCount === 1 ? "item" : "items"}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                                        Date
                                                    </p>
                                                    <p className="mt-1 font-semibold text-slate-800">
                                                        {formatDate(order.date)}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                                        Payment
                                                    </p>
                                                    <p className="mt-1 font-semibold text-slate-800">
                                                        {order.payment?.paymentMethod || "—"}
                                                    </p>
                                                    <p className="text-sm text-slate-500">
                                                        {order.payment?.pgName || "No provider"}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                                        Total
                                                    </p>
                                                    <p className="mt-1 text-lg font-bold text-slate-900">
                                                        {formatPrice(Number(order.totalAmount) || 0)}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                                        Status
                                                    </p>
                                                    <span
                                                        className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusClasses[statusKey] || "bg-slate-100 text-slate-700 ring-slate-500/20"}`}
                                                    >
                                                        {order.orderStatus || "Pending"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <div className="hidden rounded-2xl bg-white p-3 text-slate-600 shadow-sm sm:flex">
                                                    <FaCreditCard />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-slate-200 bg-white px-5 py-5">
                                            <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_320px]">
                                                <div>
                                                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                                                        Items in this order
                                                    </h3>
                                                    <div className="grid gap-3">
                                                        {order.orderItems?.map((item) => (
                                                            <div
                                                                key={item.id}
                                                                className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
                                                            >
                                                                <div className="min-w-0">
                                                                    <p className="truncate font-semibold text-slate-900">
                                                                        {item.product?.productName || "Product unavailable"}
                                                                    </p>
                                                                    <p className="mt-1 text-xs text-slate-500">
                                                                        Quantity: {item.quantity}
                                                                    </p>
                                                                </div>
                                                                <p className="shrink-0 font-bold text-slate-800">
                                                                    {formatPrice(
                                                                        Number(item.orderedProductPrice || 0) *
                                                                        Number(item.quantity || 0),
                                                                    )}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                                    <div className="mb-3 flex items-center gap-2 text-slate-900">
                                                        <FaMapMarkerAlt className="text-amber-600" />
                                                        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                                                            Delivery Address
                                                        </h3>
                                                    </div>

                                                    {order.address ? (
                                                        <div className="space-y-2 text-sm text-slate-700">
                                                            <p className="font-semibold text-slate-900">
                                                                {order.address.buildingName}
                                                            </p>
                                                            <p>{order.address.street}</p>
                                                            <p>
                                                                {order.address.city}, {order.address.state}
                                                            </p>
                                                            <p>
                                                                {order.address.pincode}, {order.address.country}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-slate-500">
                                                            Empty
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {safeOrderPagination.totalPages > 1 && (
                        <div className="flex justify-center border-t border-slate-200 px-5 py-4">
                            <Paginations
                                numberOfPage={safeOrderPagination.totalPages}
                                totalProducts={safeOrderPagination.totalElements}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProfileOrders;
