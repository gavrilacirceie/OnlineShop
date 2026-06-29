import { useEffect, useState } from "react";
import {
    FiArrowDown,
    FiArrowUp,
    FiRefreshCw,
    FiSearch,
    FiSliders,
} from "react-icons/fi";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const Filter = ({ categories = [], totalProducts = 0 }) => {
    const [searchParams] = useSearchParams();
    const pathName = useLocation().pathname;
    const navigate = useNavigate();

    const category = searchParams.get("category") || "all";
    const sortOrder = searchParams.get("sortBy") || "asc";
    const [searchTerm, setSearchTerm] = useState(searchParams.get("keyword") || "");

    useEffect(() => {
        const handler = setTimeout(() => {
            const currentParams = new URLSearchParams(window.location.search);

            if (searchTerm.trim()) {
                currentParams.set("keyword", searchTerm.trim());
            } else {
                currentParams.delete("keyword");
            }

            currentParams.delete("page");
            navigate(`${pathName}?${currentParams.toString()}`);
        }, 700);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, navigate, pathName]);

    const handleCategoryChange = (selectedCategory) => {
        const nextParams = new URLSearchParams(searchParams);

        if (selectedCategory === "all") {
            nextParams.delete("category");
        } else {
            nextParams.set("category", selectedCategory);
        }

        nextParams.delete("page");
        navigate(`${pathName}?${nextParams.toString()}`);
    };

    const toggleSortOrder = () => {
        const nextParams = new URLSearchParams(searchParams);
        const newOrder = sortOrder === "asc" ? "desc" : "asc";

        nextParams.set("sortBy", newOrder);
        nextParams.delete("page");
        navigate(`${pathName}?${nextParams.toString()}`);
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        navigate(pathName);
    };

    const categoryCount = categories.length + 1;

    return (
        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                    <FiSliders className="text-lg" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Filters</h2>
                    <p className="text-sm text-slate-500">
                        {totalProducts} product{Number(totalProducts) === 1 ? "" : "s"} found
                    </p>
                </div>
            </div>

            <div className="mt-6 space-y-6">
                <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Search
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    </div>
                </div>

                <div>
                    <div className="mb-3 flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Categories
                        </label>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                            {categoryCount}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <button
                            type="button"
                            onClick={() => handleCategoryChange("all")}
                            className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                                category === "all"
                                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10"
                                    : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                            }`}
                        >
                            All Products
                        </button>

                        {categories.map((item) => (
                            <button
                                key={item.categoryId}
                                type="button"
                                onClick={() => handleCategoryChange(item.categoryName)}
                                className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                                    category === item.categoryName
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15"
                                        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                                }`}
                            >
                                {item.categoryName}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Sort by Price
                    </label>
                    <button
                        type="button"
                        onClick={toggleSortOrder}
                        className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-blue-400 hover:bg-blue-50"
                    >
                        <span>{sortOrder === "asc" ? "Lowest to highest" : "Highest to lowest"}</span>
                        {sortOrder === "asc" ? <FiArrowUp size={18} /> : <FiArrowDown size={18} />}
                    </button>
                </div>

                <button
                    type="button"
                    onClick={handleClearFilters}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-700 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-rose-800"
                >
                    <FiRefreshCw size={16} />
                    Clear Filters
                </button>
            </div>
        </aside>
    );
};

export default Filter;
