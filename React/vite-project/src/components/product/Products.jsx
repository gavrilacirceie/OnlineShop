import ProductCard from "../common/ProductCard.jsx";
import {FaExclamationCircle} from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {fetchCategories, fetchProducts} from "../../store/actions/index.js";
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
        <div className="lg:px-14 sm:px-8 px-4 py-14 2xl:w-[90%] 2xl:mx-auto">
            <Filter categories={categories ? categories : []}/>
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
                <div className="min-h-175">
                    <div className="pb-6 pt-14 grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-y-6 gap-x-6">
                        {products && products.map((item, i) => <ProductCard key={i} {...item} />)}
                    </div>
                    <div className="flex justify-center pt-10" >
                        <Paginations numberOfPage={pagination?.totalPages}
                        totalProducts={pagination?.totalElements}/>
                    </div>

                </div>
            )}
        </div>
    )
}

export default Products;