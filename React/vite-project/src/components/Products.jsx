import ProductCard from "./ProductCard";
import {FaExclamationCircle} from "react-icons/fa";

const Products = () => {
    const isLoading = false;
    const errorMessage = "";
    const products =[
        {
            productId: 652,
            productName: "Iphone Xs max",
            image: "https://placehold.co/600x400",
            productDescription: "Experience the latest in mobile technology with advanced cameras, powerful processing, and an all-day battery.",
            quantity: 1,
            productPrice: 1450.0,
            discountPrice: 10.0,
            specialPrice: 1305.0,
        },
        {
            productId: 654,
            productName: "MacBook Air M2s",
            image: "https://placehold.co/600x400",
            productDescription: "Ultra-thin laptop with Apple's M2 chip, providing fast performance in a lightweight, portable design.",
            quantity: 0,
            productPrice: 2550.0,
            discountPrice: 20.0,
            specialPrice: 2040.0,
        }
    ]
    return (
        <div className="lg:px-14 sm:px-8 px-4 py-14 2xl:w-[90%] 2xl:mx-auto">
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