import {useEffect} from "react";
import {FaMinus, FaPlus, FaShoppingBag, FaTrash} from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {fetchUserCart, removeCartItem, updateCartQuantity} from "../../store/actions/index.js";
import Loader from "../common/loader.jsx";

const formatPrice = (price) => `$${Number(price || 0).toFixed(2)}`;

const getProductPrice = (item) => item.specialPrice || item.productPrice || 0;

const Cart = () => {
    const dispatch = useDispatch();
    const {cartId, cart, totalPrice, isCartLoading} = useSelector((state) => state.carts);

    useEffect(() => {
        dispatch(fetchUserCart());
    }, [dispatch]);

    if (isCartLoading && cart.length === 0) {
        return (
            <div className="min-h-[calc(100vh-70px)] flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    return (
        <main className="lg:px-14 sm:px-8 px-4 py-12 2xl:w-[90%] 2xl:mx-auto">
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Shopping Cart</h1>
                <p className="text-gray-500">Review your selected products before checkout.</p>
            </div>

            {cart.length === 0 ? (
                <section className="min-h-[420px] flex flex-col items-center justify-center text-center border border-dashed rounded-lg bg-white px-6">
                    <FaShoppingBag className="text-5xl text-slate-300 mb-4" />
                    <h2 className="text-2xl font-semibold text-slate-800">Your cart is empty</h2>
                    <p className="text-gray-500 mt-2 mb-6 max-w-md">
                        Add products you like and they will appear here.
                    </p>
                    <Link
                        to="/products"
                        className="px-5 py-3 rounded-md bg-slate-800 text-white font-semibold hover:bg-slate-950 transition-colors">
                        Browse Products
                    </Link>
                </section>
            ) : (
                <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
                    <section className="bg-white border rounded-lg overflow-hidden">
                        {cart.map((item) => {
                            const price = getProductPrice(item);
                            const lineTotal = price * Number(item.quantity || 0);

                            return (
                                <article
                                    key={item.productId}
                                    className="grid sm:grid-cols-[120px_1fr_auto] gap-4 p-4 border-b last:border-b-0 items-center">
                                    <div className="w-full aspect-square rounded-md overflow-hidden bg-gray-100">
                                        <img
                                            src={item.image}
                                            alt={item.productName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <h2 className="font-semibold text-slate-800 truncate">
                                            {item.productName}
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                            {item.productDescription}
                                        </p>
                                        <div className="flex items-center gap-2 mt-3">
                                            {item.productPrice && item.specialPrice ? (
                                                <span className="text-sm text-gray-400 line-through">
                                                    {formatPrice(item.productPrice)}
                                                </span>
                                            ) : null}
                                            <span className="font-semibold text-slate-700">
                                                {formatPrice(price)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-4">
                                        <div className="flex items-center border rounded-md overflow-hidden">
                                            <button
                                                type="button"
                                                disabled={isCartLoading}
                                                onClick={() => dispatch(updateCartQuantity(item.productId, "delete"))}
                                                className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50">
                                                <FaMinus className="text-xs" />
                                            </button>
                                            <span className="w-10 h-9 flex items-center justify-center font-semibold">
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                disabled={isCartLoading}
                                                onClick={() => dispatch(updateCartQuantity(item.productId, "add"))}
                                                className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50">
                                                <FaPlus className="text-xs" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className="font-bold text-slate-800">
                                                {formatPrice(lineTotal)}
                                            </span>
                                            <button
                                                type="button"
                                                disabled={isCartLoading}
                                                onClick={() => dispatch(removeCartItem(cartId, item.productId))}
                                                className="w-9 h-9 flex items-center justify-center rounded-md text-rose-600 hover:bg-rose-50 disabled:opacity-50">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </section>

                    <aside className="bg-white border rounded-lg p-5 sticky top-[90px]">
                        <h2 className="text-xl font-bold text-slate-800 mb-5">Order Summary</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Items</span>
                                <span>{cart.reduce((count, item) => count + Number(item.quantity || 0), 0)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>{formatPrice(totalPrice)}</span>
                            </div>
                            <div className="border-t pt-4 flex justify-between text-lg font-bold text-slate-800">
                                <span>Total</span>
                                <span>{formatPrice(totalPrice)}</span>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="mt-6 w-full py-3 rounded-md bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors">
                            Checkout
                        </button>
                        <Link
                            to="/products"
                            className="mt-3 w-full py-3 rounded-md border border-slate-700 text-slate-700 font-semibold hover:bg-slate-50 transition-colors flex justify-center">
                            Continue Shopping
                        </Link>
                    </aside>
                </div>
            )}
        </main>
    );
};

export default Cart;
