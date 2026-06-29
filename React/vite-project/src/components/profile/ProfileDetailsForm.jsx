import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { FaUserEdit } from "react-icons/fa";
import toast from "react-hot-toast";
import InputField from "../common/InputField.jsx";
import { updateCurrentUserProfile } from "../../store/actions/index.js";

const ProfileDetailsForm = ({ user, setOpenProfileModal }) => {
    const dispatch = useDispatch();
    const { btnLoader } = useSelector((state) => state.errors);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        mode: "onTouched",
    });

    useEffect(() => {
        setValue("firstName", user?.firstName || "");
        setValue("lastName", user?.lastName || "");
        setValue("username", user?.username || "");
        setValue("email", user?.email || "");
    }, [setValue, user]);

    const onSubmit = (data) => {
        dispatch(updateCurrentUserProfile(data, toast, setOpenProfileModal));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-5 flex items-center justify-center gap-2 px-4 py-2 text-2xl font-semibold text-slate-800">
                <FaUserEdit className="text-xl" />
                Edit Profile
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                    label="First Name"
                    required
                    id="firstName"
                    type="text"
                    message="*First name is required"
                    placeholder="Enter first name"
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
                    placeholder="Enter last name"
                    register={register}
                    errors={errors}
                    min={3}
                />

                <InputField
                    label="Username"
                    required
                    id="username"
                    type="text"
                    message="*Username is required"
                    placeholder="Enter username"
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
                    placeholder="Enter email"
                    register={register}
                    errors={errors}
                />
            </div>

            <button
                disabled={btnLoader}
                className="mt-5 rounded-md bg-slate-900 px-4 py-2 text-white transition-colors duration-200 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
            >
                {btnLoader ? "Saving..." : "Save Changes"}
            </button>
        </form>
    );
};

export default ProfileDetailsForm;
