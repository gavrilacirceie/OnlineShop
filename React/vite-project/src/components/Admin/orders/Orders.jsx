import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
    FaBoxOpen,
    FaChevronDown,
    FaChevronUp,
    FaClipboardList,
} from "react-icons/fa";
import {
    fetchAdminOrders,
    updateAdminOrderStatus,
} from "../../../store/actions";
import { formatPrice } from "../../../utils/formatPrice";
import Loader from "../../shared/Loader";
import ErrorPage from "../../shared/ErrorPage";
import Paginations from "../../common/Pagination";

const statusClasses = {
    accepted: "bg-blue-50 text-blue-700 ring-blue-600/20",
    pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
    processing: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
    shipped: "bg-violet-50 text-violet-700 ring-violet-600/20",
    delivered: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    cancelled: "bg-red-50 text-red-700 ring-red-600/20",
};

const orderStatuses = [
    "Pending",
    "Processing",
    "Accepted",
    "Shipped",
    "Delivered",
    "Cancelled",
];

const getOrderStatusValue = (status) => {
    if (!status) return "Pending";
    if (status.toLowerCase() === "order accepted") return "Accepted";
    return orderStatuses.find(
        (option) => option.toLowerCase() === status.toLowerCase(),
    ) || "Pending";
};

const formatDate = (date) => {
    if (!date) return "—";

    return new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
};

const Orders = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);
    const [draftStatuses, setDraftStatuses] = useState({});
    const { isLoading, errorMessage } = useSelector((state) => state.errors);
    const { orders, orderPagination } = useSelector((state) => state.admin);

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

        dispatch(fetchAdminOrders(query.toString()));
    }, [dispatch, page, sortBy, sortOrder]);

    const updateSort = (event) => {
        const [nextSortBy, nextSortOrder] = event.target.value.split(":");
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set("sortBy", nextSortBy);
        nextParams.set("sortOrder", nextSortOrder);
        nextParams.set("page", "1");
        setSearchParams(nextParams);
    };

    const handleStatusChange = (orderId, status) => {
        setDraftStatuses((current) => ({
            ...current,
            [orderId]: status,
        }));
    };

    const cancelStatusChange = (orderId) => {
        setDraftStatuses((current) => {
            const nextStatuses = { ...current };
            delete nextStatuses[orderId];
            return nextStatuses;
        });
    };

    const confirmStatusChange = async (orderId, currentStatus, nextStatus) => {
        const confirmed = window.confirm(
            `Update order #${orderId} from "${currentStatus}" to "${nextStatus}"?`,
        );

        if (!confirmed) return;

        setUpdatingOrderId(orderId);
        const wasUpdated = await dispatch(updateAdminOrderStatus(orderId, nextStatus));
        setUpdatingOrderId(null);

        if (wasUpdated) {
            cancelStatusChange(orderId);
        }
    };

    if (isLoading) {
        return <Loader text="Loading orders..." />;
    }

    if (errorMessage) {
        return <ErrorPage message={errorMessage} />;
    }

    return (
        <section className="mx-auto max-w-7xl space-y-6">
            <header className="flex flex-col gap-4 rounded-3xl bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-8 text-white shadow-xl sm:flex-row sm:items-end sm:justify-between sm:px-9">
                <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">
                        <FaClipboardList aria-hidden="true" />
                        Order management
                    </span>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight">
                        Customer orders
                    </h1>
                    <p className="mt-2 text-sm text-slate-300">
                        Review payments, totals, and the products included in every order.
                    </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Total orders
                    </p>
                    <p className="mt-1 text-2xl font-bold">
                        {Number(orderPagination.totalElements || 0).toLocaleString()}
                    </p>
                </div>
            </header>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="font-bold text-slate-900">All orders</h2>
                        <p className="text-sm text-slate-500">
                            Select an order to view its products.
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

                {orders.length === 0 ? (
                    <div className="flex flex-col items-center px-6 py-16 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                            <FaBoxOpen className="text-2xl" aria-hidden="true" />
                        </div>
                        <h3 className="mt-4 font-bold text-slate-900">No orders found</h3>
                        <p className="mt-1 text-sm text-slate-500">
                            New customer orders will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    <th className="px-5 py-3.5">Order</th>
                                    <th className="px-5 py-3.5">Customer</th>
                                    <th className="px-5 py-3.5">Date</th>
                                    <th className="px-5 py-3.5">Payment</th>
                                    <th className="px-5 py-3.5">Status</th>
                                    <th className="px-5 py-3.5 text-right">Total</th>
                                    <th className="w-14 px-5 py-3.5">
                                        <span className="sr-only">Details</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {orders.map((order) => {
                                    const isExpanded = expandedOrderId === order.id;
                                    const orderStatus = getOrderStatusValue(order.orderStatus);
                                    const selectedStatus = draftStatuses[order.id] || orderStatus;
                                    const hasStatusChange = selectedStatus !== orderStatus;
                                    const statusKey = selectedStatus.toLowerCase();
                                    const itemCount = order.orderItems?.reduce(
                                        (total, item) => total + Number(item.quantity || 0),
                                        0,
                                    ) || 0;

                                    return (
                                        <Fragment key={order.id}>
                                            <tr className="transition hover:bg-slate-50/80">
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <p className="font-bold text-slate-900">#{order.id}</p>
                                                    <p className="text-xs text-slate-500">
                                                        {itemCount} {itemCount === 1 ? "item" : "items"}
                                                    </p>
                                                </td>
                                                <td className="px-5 py-4 text-sm text-slate-700">
                                                    {order.email}
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                                                    {formatDate(order.date)}
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <p className="text-sm font-medium text-slate-700">
                                                        {order.payment?.paymentMethod || "—"}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {order.payment?.pgName || "No provider"}
                                                    </p>
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <select
                                                            value={selectedStatus}
                                                            onChange={(event) =>
                                                                handleStatusChange(order.id, event.target.value)
                                                            }
                                                            disabled={updatingOrderId === order.id}
                                                            aria-label={`Status for order ${order.id}`}
                                                            className={`rounded-lg border-0 px-2.5 py-1.5 text-xs font-semibold ring-1 ring-inset outline-none transition focus:ring-2 focus:ring-blue-500 disabled:cursor-wait disabled:opacity-60 ${statusClasses[statusKey] || "bg-slate-100 text-slate-700 ring-slate-500/20"}`}
                                                        >
                                                            {orderStatuses.map((status) => (
                                                                <option key={status} value={status}>
                                                                    {status}
                                                                </option>
                                                            ))}
                                                        </select>

                                                        {hasStatusChange && (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        confirmStatusChange(
                                                                            order.id,
                                                                            orderStatus,
                                                                            selectedStatus,
                                                                        )
                                                                    }
                                                                    disabled={updatingOrderId === order.id}
                                                                    className="rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
                                                                >
                                                                    {updatingOrderId === order.id ? "Saving..." : "Confirm"}
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => cancelStatusChange(order.id)}
                                                                    disabled={updatingOrderId === order.id}
                                                                    className="rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-60"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-right font-bold text-slate-900">
                                                    {formatPrice(Number(order.totalAmount) || 0)}
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                                                        aria-label={`${isExpanded ? "Hide" : "Show"} order ${order.id} details`}
                                                        aria-expanded={isExpanded}
                                                    >
                                                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                                    </button>
                                                </td>
                                            </tr>

                                            {isExpanded && (
                                                <tr>
                                                    <td colSpan="7" className="bg-slate-50/80 px-5 py-5">
                                                        <div className="grid gap-3 lg:grid-cols-2">
                                                            {order.orderItems?.map((item) => (
                                                                <div
                                                                    key={item.id}
                                                                    className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4"
                                                                >
                                                                    <div className="min-w-0">
                                                                        <p className="truncate font-semibold text-slate-900">
                                                                            {item.product?.productName || "Product unavailable"}
                                                                        </p>
                                                                        <p className="mt-1 text-xs text-slate-500">
                                                                            Quantity: {item.quantity}
                                                                            {item.product?.productId && ` · Product #${item.product.productId}`}
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
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {orderPagination.totalPages > 1 && (
                    <div className="flex justify-center border-t border-slate-200 px-5 py-4">
                        <Paginations
                            numberOfPage={orderPagination.totalPages}
                            totalProducts={orderPagination.totalElements}
                        />
                    </div>
                )}
            </div>
        </section>
    );
};

export default Orders;
