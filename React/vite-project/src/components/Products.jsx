import ProductCard from "./ProductCard";
import {FaExclamationCircle} from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {fetchProducts} from "../store/actions/index.js";
import Filter from "./Filter.jsx";
import useProductFilter from "./useProductFilter.jsx";

const Products = () => {
    // const isLoading = false;
    // const errorMessage = "";

    const {isLoading, errorMessage} = useSelector(
        (state) => state.error
    );
    const {products} = useSelector(
        (state) => state.products
    )
    const dispatch = useDispatch();

    useProductFilter();

    return (
        <div className="lg:px-14 sm:px-8 px-4 py-14 2xl:w-[90%] 2xl:mx-auto">
            <Filter />
            {isLoading ? (
                <p>Loading...</p>
            ) : errorMessage ? (
                <div className="flex justify-center items-center w-full">
                    <FaExclamationCircle className="text-slate-800 text-4xl mr-2" />
                    <span className="text-slate-800 text-lg font-bold">
                        {errorMessage}
                    </span>
                </div>
            ) : (
                <div className="min-h-175">
                    <div className="pb-6 pt-14 grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-y-6 gap-x-6">
                        {products && products.map((item, i) => <ProductCard key={i} {...item} />)}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Products;