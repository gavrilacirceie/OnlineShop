import { Badge } from "@mui/material";
import { useState } from "react";
import { FaShoppingCart, FaSignInAlt, FaStore } from "react-icons/fa";
import { IoIosMenu } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import UserMenu from "../../UserMenu.jsx";


const Navbar = () => {
    const path = useLocation().pathname;
    const [navbarOpen, setNavbarOpen] = useState(false);
    const { cart } = useSelector((state) => state.carts);
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="h-[70px] bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 text-white z-50 flex items-center sticky top-0 shadow-lg border-b border-white/5">
            <div className="lg:px-14 sm:px-8 px-4 w-full flex justify-between items-center">
                <Link to="/" className="flex items-center text-2xl font-bold group">
                    <FaStore className="mr-2 text-3xl text-amber-400 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-[Poppins] bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Online Shop</span>
                </Link>

                <ul className={`flex sm:gap-8 gap-4 sm:items-center sm:static absolute left-0 top-[70px] sm:shadow-none shadow-xl ${
                    navbarOpen ? "h-fit sm:pb-0 pb-6" : "h-0 overflow-hidden"
                } transition-all duration-300 sm:h-fit sm:bg-transparent bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 text-white sm:w-fit w-full sm:flex-row flex-col px-6 sm:px-0`}>
                    <li>
                        <Link className={`relative py-1 px-1 font-medium transition-all duration-200 hover:text-amber-400 ${
                            path === "/" ? "text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-amber-400 after:rounded-full" : "text-gray-400"
                        }`}
                              to="/">
                            Home
                        </Link>
                    </li>

                    <li>
                        <Link className={`relative py-1 px-1 font-medium transition-all duration-200 hover:text-amber-400 ${
                            path === "/products" ? "text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-amber-400 after:rounded-full" : "text-gray-400"
                        }`}
                              to="/products">
                            Products
                        </Link>
                    </li>

                    <li>
                        <Link className={`relative py-1 px-1 font-medium transition-all duration-200 hover:text-amber-400 ${
                            path === "/about" ? "text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-amber-400 after:rounded-full" : "text-gray-400"
                        }`}
                              to="/about">
                            About
                        </Link>
                    </li>

                    <li>
                        <Link className={`relative py-1 px-1 font-medium transition-all duration-200 hover:text-amber-400 ${
                            path === "/contact" ? "text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-amber-400 after:rounded-full" : "text-gray-400"
                        }`}
                              to="/contact">
                            Contact
                        </Link>
                    </li>

                    <li>
                        <Link className="relative text-gray-300 hover:text-white transition-colors duration-200"
                              to="/cart">
                            <Badge
                                showZero
                                badgeContent={cart?.length || 0}
                                color="error"
                                overlap="circular"
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                                <FaShoppingCart size={22} className="hover:scale-110 transition-transform duration-200" />
                            </Badge>
                        </Link>
                    </li>

                    {(user && user.id) ? (
                        <li>
                            <UserMenu />
                        </li>
                    ) : (
                        <li>
                            <Link className="flex items-center space-x-2 px-5 py-2
                            bg-gradient-to-r from-amber-500 to-orange-500
                            text-white font-semibold rounded-full shadow-lg shadow-amber-500/25
                            hover:from-amber-400 hover:to-orange-400 hover:shadow-amber-500/40 hover:scale-105
                            transition-all duration-300 ease-out text-sm"
                                  to="/login">
                                <FaSignInAlt />
                                <span>Login</span>
                            </Link>
                        </li>
                    )}
                </ul>

                <button
                    onClick={() => setNavbarOpen(!navbarOpen)}
                    className="sm:hidden flex items-center p-2 rounded-lg hover:bg-white/10 transition-colors duration-200">
                    {navbarOpen ? (
                        <RxCross2 className="text-white text-2xl" />
                    ) : (
                        <IoIosMenu className="text-white text-2xl" />
                    )}
                </button>
            </div>
        </div>
    )
}

export default Navbar;

