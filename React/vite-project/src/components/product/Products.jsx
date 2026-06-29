import ProductCard from "../common/ProductCard.jsx";
import {FaExclamationCircle} from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {fetchCategories} from "../../store/actions/index.js";
import Filter from "./Filter.jsx";
import useProductFilter from "../../hooks/useProductFilter.js";
import Loader from "../common/loader.jsx";
import Paginations from "../common/Pagination.jsx";

const Products = () => {
    // const isLoading = false;
    // const errorMessage = "";

    const {isLoading, errorMessage} = useSelector(
        (state) => state.errors
    );
    const {products, categories, pagination} = useSelector(
        (state) => state.products
    )
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchCategories(""));
    }, [dispatch])
    useProductFilter();

    return (
        <div className="px-4 py-14 sm:px-8 lg:px-14 2xl:mx-auto 2xl:w-[90%]">
            {isLoading ? (
                <Loader/>
            ) : errorMessage ? (
                <div className="flex justify-center items-center w-full">
                    <FaExclamationCircle className="text-slate-800 text-4xl mr-2" />
                    <span className="text-slate-800 text-lg font-bold">
                        {errorMessage}
                    </span>
                </div>
            ) : (
                <div className="min-h-175 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
                    <Filter
                        categories={categories ? categories : []}
                        totalProducts={pagination?.totalElements || products?.length || 0}
                    />

                    <div>
                        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
                                        Product Catalog
                                    </p>
                                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                                        Browse Products
                                    </h1>
                                    <p className="mt-2 text-sm text-slate-500">
                                        Discover products by category, search by keyword, and sort results the way you want.
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                                    Showing{" "}
                                    <span className="font-bold text-slate-900">
                                        {products?.length || 0}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-bold text-slate-900">
                                        {pagination?.totalElements || 0}
                                    </span>{" "}
                                    products
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-x-6 gap-y-6 pb-6 pt-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                            {products && products.map((item, i) => <ProductCard key={i} {...item} />)}
                        </div>

                        <div className="flex justify-center pt-8">
                            <Paginations
                                numberOfPage={pagination?.totalPages}
                                totalProducts={pagination?.totalElements}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Products;
