import {useState} from "react";
import {FaShoppingCart} from "react-icons/fa";

const ProductCard = ({productId, productName, image, productDescription, quantity, productPrice, discountPrice, specialPrice,
}) => {
    const[openProductViewModal, setOpenProductViewModal] = useState(false);
    const btnLoader = false;
    const [selectedProduct, setSelectedProduct] = useState("");
    const isAvailable = quantity && Number(quantity) > 0;

    const handleProductView = (product) => {
      setSelectedProduct(product);
      setOpenProductViewModal(true);
    };
    return (
        <div className="border rounded-lg shadow-md hover:shadow-xl overflow-hidden transition-shadow duration-300 bg-white">
            <div onClick={() => {
                handleProductView({id : productId, productName, image, productDescription, quantity, productPrice, discountPrice, specialPrice,});
            }} className="w-full overflow-hidden aspect-3/2">
                <img
                    className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                    src={image}
                    alt={productName}
                />
            </div>
            <div className="p-4 flex flex-col gap-1">
                <h2 onClick={() => {
                    handleProductView({id : productId, productName, image, productDescription, quantity, productPrice, discountPrice, specialPrice,});
                }} className="text-base font-semibold text-gray-800 cursor-pointer hover:text-blue-600 truncate">
                    {productName}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-2">{productDescription}</p>

                <div className="mt-2 flex items-center justify-between">
                    {specialPrice ? (
                        <div className="flex flex-col">
                            <span className="text-gray-400 line-through text-sm">
                                ${Number(productPrice).toFixed(2)}
                            </span>
                            <span className="text-xl font-bold text-slate-700">
                                ${Number(specialPrice).toFixed(2)}
                            </span>
                        </div>
                    ) : (
                        <span className="text-xl font-bold text-slate-700">
                            ${Number(productPrice).toFixed(2)}
                        </span>
                    )}
                    <button
                        disabled={!isAvailable}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 
                            ${isAvailable
                                ? "bg-slate-700 text-white hover:bg-slate-900 cursor-pointer"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}>
                        <FaShoppingCart />
                        {isAvailable ? "Add to Cart" : "Out of stock"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard;