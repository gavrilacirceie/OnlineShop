import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineUserAdd } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../common/InputField";
import { useDispatch } from "react-redux";
import { authenticateSignUpUser } from "../../store/actions";
import toast from "react-hot-toast";
import Loader from "../common/loader.jsx";

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        mode: "onTouched",
    });

    const registerHandler = async (data) => {
        const sendData = {
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.username,
            email: data.email,
            password: data.password,
            roles: ["user"],
        };
        dispatch(authenticateSignUpUser(sendData, toast, reset, navigate, setLoader));
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex justify-center items-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-8">
            <div className="w-full max-w-md">
                {/* Card */}
                <form
                    onSubmit={handleSubmit(registerHandler)}
                    className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-8">
                        <div className="flex flex-col items-center space-y-3">
                            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                <AiOutlineUserAdd className="text-white text-3xl" />
                            </div>
                            <h1 className="text-white text-2xl font-bold tracking-tight">
                                Create Account
                            </h1>
                            <p className="text-slate-300 text-sm">
                                Sign up to start shopping
                            </p>
                        </div>
                    </div>

                    {/* Form Body */}
                    <div className="px-8 py-8">
                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <InputField
                                    label="First Name"
                                    required
                                    id="firstName"
                                    type="text"
                                    message="*First name is required"
                                    placeholder="Enter your first name"
                                    register={register}
                                    errors={errors}
                                    min={3}
                                />

                                <InputField
                                    label="Last Name"
                                    required
                                    id="lastName"
                                    type="text"
                                    message="*Last name is required"
                                    placeholder="Enter your last name"
                                    register={register}
                                    errors={errors}
                                    min={3}
                                />
                            </div>

                            <InputField
                                label="Username"
                                required
                                id="username"
                                type="text"
                                message="*Username is required"
                                placeholder="Choose a username"
                                register={register}
                                errors={errors}
                                min={3}
                            />

                            <InputField
                                label="Email"
                                required
                                id="email"
                                type="email"
                                message="*Email is required"
                                placeholder="Enter your email"
                                register={register}
                                errors={errors}
                            />

                            <InputField
                                label="Password"
                                required
                                id="password"
                                type="password"
                                message="*Password is required"
                                placeholder="Create a password"
                                register={register}
                                errors={errors}
                                min={3}
                            />
                        </div>

                        <button
                            disabled={loader}
                            className="mt-6 w-full py-3 rounded-xl bg-slate-800 text-white font-semibold shadow-lg shadow-slate-800/25 hover:bg-slate-900 hover:shadow-slate-800/40 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                            type="submit"
                        >
                            {loader ? (
                                <>
                                    <Loader /> Loading...
                                </>
                            ) : (
                                <>Create Account</>
                            )}
                        </button>

                        <p className="text-center text-sm text-gray-500 mt-6">
                            Already have an account?{" "}
                            <Link
                                className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                                to="/login"
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
