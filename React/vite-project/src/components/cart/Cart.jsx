import {MdArrowBack, MdShoppingCart} from "react-icons/md";
import {Link} from "react-router-dom";
import {formatPrice} from "../../utils/formatPrice.js";
import {useDispatch, useSelector} from "react-redux";
import ItemContent from "./ItemContent.jsx";

const Cart = () => {
    const { cart } = useSelector((state) => state.carts);
    const newCart = { ...cart };
    const dispatch = useDispatch();

    newCart.totalPrice = cart?.reduce(
        (acc, cur) => acc + Number(cur?.specialPrice) * Number(cur?.quantity), 0
    );

    if(!cart || cart.length === 0){
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <MdShoppingCart size={48} className="text-gray-300" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
                <p className="text-gray-400 mb-8 text-center max-w-sm">
                    Looks like you haven't added anything to your cart yet. Start exploring our products!
                </p>
                <Link
                    to="/products"
                    className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] transition-all duration-300"
                >
                    Browse Products
                </Link>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="lg:px-14 sm:px-8 px-4 py-12 2xl:w-[90%] 2xl:mx-auto">
                {/* Header */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25 mb-4">
                        <MdShoppingCart size={30} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
                        Your Cart
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg">All your selected items</p>
                </div>

                {/* Table Header */}
                <div className="bg-white rounded-t-2xl border border-gray-100 shadow-sm">
                    <div className="grid md:grid-cols-5 grid-cols-4 gap-4 px-6 py-4 border-b border-gray-100">
                        <div className="md:col-span-2 justify-self-start text-sm font-semibold text-gray-500 uppercase tracking-wide">
                            Product
                        </div>
                        <div className="justify-self-center text-sm font-semibold text-gray-500 uppercase tracking-wide">
                            Price
                        </div>
                        <div className="justify-self-center text-sm font-semibold text-gray-500 uppercase tracking-wide">
                            Quantity
                        </div>
                        <div className="justify-self-center text-sm font-semibold text-gray-500 uppercase tracking-wide">
                            Total
                        </div>
                    </div>
                </div>

                <div className="space-y-3 py-3">
                    {cart && cart.length > 0 && cart.map((item, index) => <ItemContent key={index} {...item} />)}
                </div>

                {/* Summary Section */}
                <div className="bg-white rounded-b-2xl border border-t-0 border-gray-100 shadow-sm px-6 py-8">
                    <div className="flex sm:flex-row flex-col sm:justify-end gap-4">
                        <div className="flex flex-col gap-3 sm:w-96 w-full">
                            <div className="flex justify-between items-center text-lg font-bold text-slate-800 border-t border-gray-100 pt-4">
                                <span>Subtotal</span>
                                <span className="text-xl">{formatPrice(newCart?.totalPrice)}</span>
                            </div>

                            <p className="text-sm text-gray-400">
                                Taxes and shipping calculated at checkout
                            </p>

                            <Link className="w-full" to="/checkout">
                                <button
                                    onClick={() => {}}
                                    className="w-full py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2">
                                    <MdShoppingCart size={20} />
                                    Checkout
                                </button>
                            </Link>

                            <Link className="flex gap-2 items-center justify-center mt-1 text-gray-500 hover:text-slate-800 font-medium transition-colors duration-200" to="/products">
                                <MdArrowBack size={18} />
                                <span>Continue Shopping</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;