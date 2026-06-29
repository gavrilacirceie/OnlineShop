import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { FaPlus, FaStore, FaTimes } from "react-icons/fa";
import {
    createAdminSeller,
    fetchAdminSellers,
} from "../../../store/actions";
import Loader from "../../shared/Loader";
import ErrorPage from "../../shared/ErrorPage";
import Paginations from "../../common/Pagination";

const SellerFormModal = ({ onClose, onSave }) => {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [isSaving, setIsSaving] = useState(false);

    const updateField = (event) => {
        setForm((current) => ({
            ...current,
            [event.target.name]: event.target.value,
        }));
    };

    const submit = async (event) => {
        event.preventDefault();
        setIsSaving(true);
        const wasSaved = await onSave(form);
        if (!wasSaved) setIsSaving(false);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="seller-form-title"
            onClick={onClose}
        >
            <form
                onSubmit={submit}
                onClick={(event) => event.stopPropagation()}
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
                <div className="flex items-start justify-between">
                    <div>
                        <h2 id="seller-form-title" className="text-xl font-bold text-slate-900">
                            Add seller
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Create an account with seller access.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                        aria-label="Close seller form"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="mt-6 space-y-4">
                    <label className="block text-sm font-medium text-slate-700">
                        Username
                        <input
                            autoFocus
                            name="username"
                            value={form.username}
                            onChange={updateField}
                            minLength={3}
                            maxLength={20}
                            required
                            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                        Email
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={updateField}
                            maxLength={20}
                            required
                            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                        Password
                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={updateField}
                            minLength={3}
                            maxLength={30}
                            required
                            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </label>
                </div>

                <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                        {isSaving ? "Creating..." : "Create seller"}
                    </button>
                </div>
            </form>
        </div>
    );
};

const Sellers = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const [showForm, setShowForm] = useState(false);
    const { isLoading, errorMessage } = useSelector((state) => state.errors);
    const { sellers, sellerPagination } = useSelector((state) => state.admin);
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);

    useEffect(() => {
        dispatch(fetchAdminSellers(page - 1));
    }, [dispatch, page]);

    const saveSeller = async (seller) => {
        const wasSaved = await dispatch(createAdminSeller(seller));
        if (wasSaved) {
            setShowForm(false);
            dispatch(fetchAdminSellers(page - 1));
        }
        return wasSaved;
    };

    if (isLoading) return <Loader text="Loading sellers..." />;
    if (errorMessage) return <ErrorPage message={errorMessage} />;

    return (
        <section className="mx-auto max-w-6xl space-y-6">
            <header className="flex flex-col gap-4 rounded-3xl bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-8 text-white shadow-xl sm:flex-row sm:items-end sm:justify-between sm:px-9">
                <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">
                        <FaStore /> Seller management
                    </span>
                    <h1 className="mt-4 text-3xl font-bold">Sellers</h1>
                    <p className="mt-2 text-sm text-slate-300">
                        Manage accounts that can sell products.
                    </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3">
                    <p className="text-xs font-semibold uppercase text-slate-300">Total sellers</p>
                    <p className="mt-1 text-2xl font-bold">{sellerPagination.totalElements}</p>
                </div>
            </header>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                    <button
                        type="button"
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                        <FaPlus /> Add seller
                    </button>
                </div>

                {sellers.length === 0 ? (
                    <div className="px-6 py-16 text-center text-slate-500">
                        No sellers found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    <th className="px-5 py-3.5">ID</th>
                                    <th className="px-5 py-3.5">Username</th>
                                    <th className="px-5 py-3.5">Email</th>
                                    <th className="px-5 py-3.5">Role</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {sellers.map((seller) => (
                                    <tr key={seller.userId} className="hover:bg-slate-50/80">
                                        <td className="px-5 py-4 text-sm text-slate-500">
                                            #{seller.userId}
                                        </td>
                                        <td className="px-5 py-4 font-semibold text-slate-900">
                                            {seller.username}
                                        </td>
                                        <td className="px-5 py-4 text-sm text-slate-600">
                                            {seller.email}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                                Seller
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {sellerPagination.totalPages > 1 && (
                    <div className="flex justify-center border-t border-slate-200 px-5 py-4">
                        <Paginations numberOfPage={sellerPagination.totalPages} />
                    </div>
                )}
            </div>

            {showForm && (
                <SellerFormModal
                    onClose={() => setShowForm(false)}
                    onSave={saveSeller}
                />
            )}
        </section>
    );
};

export default Sellers;
