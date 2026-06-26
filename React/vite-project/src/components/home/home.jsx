import { useDispatch, useSelector } from "react-redux";
import HeroBanner from "./HeroBanner";
import { useEffect } from "react";
import { fetchProducts } from "../../store/actions";
import ProductCard from "../common/ProductCard";
import Loader from "../common/loader";
import { FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Home = () => {
    const dispatch = useDispatch();
    const {products} = useSelector((state) => state.products);
    const { isLoading, errorMessage } = useSelector(
        (state) => state.errors
    );
    useEffect(() => {
        dispatch(fetchProducts(""));
    }, [dispatch]);
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section - Full Width */}
            <div className="w-full">
                <HeroBanner />
            </div>

            {/* Featured Products Section */}
            <div className="lg:px-14 sm:px-8 px-4 py-12 2xl:w-[90%] 2xl:mx-auto">
                <div className="flex flex-col justify-center items-center space-y-3 mb-10">
                    <span className="text-sm font-semibold tracking-widest text-amber-600 uppercase">
                        Our Collection
                    </span>
                    <h1 className="text-slate-800 text-4xl sm:text-5xl font-extrabold tracking-tight">
                        Featured Products
                    </h1>
                    <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full" />
                    <p className="text-slate-500 text-center max-w-lg text-lg">
                        Discover our handpicked selection of top-rated items just for you!
                    </p>
                </div>

                {isLoading ? (
                    <Loader />
                ) : errorMessage ? (
                    <div className="flex justify-center items-center h-52 bg-red-50 rounded-2xl border border-red-100">
                        <FaExclamationTriangle className="text-red-400 text-3xl mr-3"/>
                        <span className="text-red-600 text-lg font-medium">
                            {errorMessage}
                        </span>
                    </div>
                ) : (
                    <>
                        <div className="pb-6 grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-y-8 gap-x-6">
                            {products &&
                                products?.slice(0,4)
                                    .map((item, i) => <ProductCard key={i} {...item} />
                                    )}
                        </div>
                        <div className="flex justify-center pt-8">
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 bg-slate-800 text-white font-semibold py-3 px-8 rounded-full shadow-md hover:bg-slate-700 hover:shadow-lg hover:scale-105 transition-all duration-300"
                            >
                                View All Products
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Home;