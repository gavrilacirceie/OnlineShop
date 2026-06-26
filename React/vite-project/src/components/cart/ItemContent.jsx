import {useState} from "react";
import truncateText from "../../utils/truncate.js";
import {HiOutlineTrash} from "react-icons/hi";
import {formatPrice} from "../../utils/formatPrice.js";
import SetQuantity from "./SetQuantity.jsx";
import {useDispatch} from "react-redux";
import {incrementCartQuantity, decrementCartQuantity, removeFromCart} from "../../store/actions/index.js";
import toast from "react-hot-toast";
import {getProductImageUrl} from "../../utils/imageUrl.js";

const ItemContent = ({productId, productName, image, productDescription, quantity, price, specialPrice}) =>{
    const [currentQuantity, setCurrentQuantity] = useState(quantity);

    const dispatch = useDispatch();
    const handleQtyIncrement = (cartItems) => {
      dispatch(incrementCartQuantity(cartItems, toast, currentQuantity, setCurrentQuantity));
    };
    const handleQtyDecrement = (cartItems) => {
      dispatch(decrementCartQuantity(cartItems, toast, currentQuantity, setCurrentQuantity));
    };
    const removeItemFromCart = (item) => {
      dispatch(removeFromCart(item, toast));
    };
    return (
        <div className="grid md:grid-cols-5 grid-cols-4 md:text-md text-sm gap-4 items-center bg-white border border-gray-100 rounded-xl lg:px-6 py-5 p-3 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="md:col-span-2 justify-self-start flex flex-col gap-3">
                <div className="flex md:flex-row flex-col lg:gap-4 sm:gap-3 gap-0 items-start">
                    <h3 className="lg:text-[17px] text-sm font-semibold text-slate-700">
                        {truncateText(productName)}
                    </h3>
                </div>
                <div>
                    <img
                        src={getProductImageUrl(image)}
                        alt={productName}
                        className="md:h-36 sm:h-24 h-16 w-full object-cover rounded-lg border border-gray-100"/>

                <div className="flex items-start gap-5 mt-3">
                    <button
                        onClick={() => removeItemFromCart({
                            productName,
                            productId,
                        })}
                        className="flex items-center font-medium space-x-1.5 px-3 py-1.5 text-xs border border-rose-300 text-rose-500 rounded-lg hover:bg-rose-50 hover:border-rose-400 hover:text-rose-600 transition-all duration-200">
                        <HiOutlineTrash size={14} className="text-rose-500"/>
                        <span>Remove</span>
                    </button>
                </div>

                </div>
            </div>

            <div className="justify-self-center lg:text-[17px] text-sm text-slate-700 font-semibold">
                {formatPrice(Number(specialPrice))}
            </div>

            <div className="justify-self-center lg:text-[17px] text-sm text-slate-600 font-semibold">
                <SetQuantity  quantity={currentQuantity} cardCounter={true} handleQtyIncrement={() => handleQtyIncrement({image, productName, productDescription, specialPrice, price, productId, quantity})} handleQtyDecrement={() => handleQtyDecrement({image, productName, productDescription, specialPrice, price, productId, quantity})} />
            </div>

            <div className="justify-self-center lg:text-[17px] text-sm font-bold text-slate-800">
                {formatPrice(Number(currentQuantity) * Number(specialPrice))}
            </div>
        </div>
    )
};

export default ItemContent;
