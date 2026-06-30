import {useState} from "react";
import {FaShoppingCart} from "react-icons/fa";
import ProductViewModal from "./ProductViewModal.jsx";
import truncateText from "../../utils/truncate.js";
import {useDispatch} from "react-redux";
import {addToCart} from "../../store/actions/index.js";
import toast from "react-hot-toast";

const ProductCard = ({productId, productName, image, productDescription, quantity, productPrice, discountPrice, specialPrice, sellerName,
}) => {
    const[openProductViewModal, setOpenProductViewModal] = useState(false);
    const btnLoader = false;
    const [selectedProduct, setSelectedProduct] = useState("");
    const isAvailable = quantity && Number(quantity) > 0;
    const hasDiscount =
        Number(discountPrice) > 0
        && Number(specialPrice) < Number(productPrice);
    const dispatch = useDispatch();

    const handleProductView = (product) => {
      setSelectedProduct(product);
      setOpenProductViewModal(true);
    };

    const addToCartHandler = (cartItems) => {
        dispatch(addToCart(cartItems, 1, toast));
    }
    return (
        <div className="border rounded-lg shadow-md hover:shadow-xl overflow-hidden transition-shadow duration-300 bg-white">
            <div onClick={() => {
                handleProductView({id : productId, productName, image, productDescription, quantity, productPrice, discountPrice, specialPrice, sellerName,});
            }} className="w-full overflow-hidden aspect-3/2">
                <img
                    className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                    src={image}
                    alt={productName}
                />
            </div>
            <div className="p-4 flex flex-col gap-1">
                <h2 onClick={() => {
                    handleProductView({id : productId, productName, image, productDescription, quantity, productPrice, discountPrice, specialPrice, sellerName,});
                }} className="text-base font-semibold text-gray-800 cursor-pointer hover:text-blue-600 truncate">
                    {productName}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-2">{truncateText(productDescription, 30)}</p>
                <p className="text-xs font-medium text-gray-500">
                    Sold by <span className="text-slate-700">{sellerName || "Online Shop"}</span>
                </p>

                <div className="mt-2 flex items-center justify-between">
                    {hasDiscount ? (
                        <div className="flex flex-col">
                            <span className="text-gray-400 line-through text-sm">
                                {Number(productPrice).toFixed(2)} RON
                            </span>
                            <span className="text-xl font-bold text-slate-700">
                                {Number(specialPrice).toFixed(2)} RON
                            </span>
                        </div>
                    ) : (
                        <span className="text-xl font-bold text-slate-700">
                            {Number(productPrice).toFixed(2)} RON
                        </span>
                    )}
                    <button
                        disabled={!isAvailable || btnLoader}
                        onClick={() => addToCartHandler({
                            image,
                            productName,
                            productDescription,
                            quantity,
                            productPrice,
                            discountPrice,
                            specialPrice,
                            productId,

                        })}
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
            <ProductViewModal
            open={openProductViewModal}
            setOpen={setOpenProductViewModal}
            product={selectedProduct}
            isAvailable={isAvailable}
            />
        </div>
    )
}

export default ProductCard;
