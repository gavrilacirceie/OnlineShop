import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaMapMarkerAlt, FaRegAddressBook, FaUserCircle } from "react-icons/fa";
import { getUserAddresses } from "../../store/actions";
import AddressInfoModal from "../checkout/AddressInfoModal.jsx";
import AddAddressForm from "../checkout/AddAddressForm.jsx";
import ProfileDetailsForm from "./ProfileDetailsForm.jsx";

const InfoRow = ({ label, value }) => (
    <div className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {label}
        </span>
        <span className="text-sm font-medium text-slate-800">
            {value || "Not provided"}
        </span>
    </div>
);

const Profile = () => {
    const dispatch = useDispatch();
    const { user, address } = useSelector((state) => state.auth);
    const [openAddress, setOpenAddress] = useState(false);
    const [openProfileModal, setOpenProfileModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const addresses = Array.isArray(address) ? address : [];

    useEffect(() => {
        dispatch(getUserAddresses());
    }, [dispatch]);

    const handleEditAddress = (item) => {
        setSelectedAddress(item);
        setOpenAddress(true);
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-white to-amber-50 px-4 py-10">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
                    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 px-8 py-10 text-white">
                        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                                    <FaUserCircle className="text-4xl text-amber-300" />
                                </div>
                                <div>
                                    <p className="text-sm uppercase tracking-[0.3em] text-slate-300">
                                        My Profile
                                    </p>
                                    <h1 className="text-3xl font-bold tracking-tight">
                                        {user?.firstName || user?.lastName
                                            ? `${user?.firstName || ""} ${user?.lastName || ""}`.trim()
                                            : user?.username}
                                    </h1>
                                    <p className="mt-1 text-sm text-slate-300">
                                        Your account details and saved delivery addresses
                                    </p>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-200">
                                <p className="font-semibold text-white">Saved addresses</p>
                                <p className="mt-1 text-2xl font-bold text-amber-300">
                                    {addresses.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 px-8 py-8 md:grid-cols-2 xl:grid-cols-4">
                        <InfoRow label="First Name" value={user?.firstName} />
                        <InfoRow label="Last Name" value={user?.lastName} />
                        <InfoRow label="Username" value={user?.username} />
                        <InfoRow label="Email" value={user?.email} />
                    </div>

                    <div className="px-8 pb-8">
                        <button
                            type="button"
                            onClick={() => setOpenProfileModal(true)}
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-slate-700"
                        >
                            <FaEdit className="text-xs" />
                            Edit Profile Details
                        </button>
                    </div>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                            <FaRegAddressBook className="text-xl" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Saved Addresses</h2>
                            <p className="text-sm text-slate-500">
                                These are the addresses defined for this account.
                            </p>
                        </div>
                    </div>

                    {addresses.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                                <FaMapMarkerAlt className="text-xl" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800">
                                No addresses added yet
                            </h3>
                            <p className="mt-2 text-sm text-slate-500">
                                When the user saves an address during checkout, it will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {addresses.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
                                >
                                    <div className="mb-4 flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-900">
                                                {item.buildingName}
                                            </h3>
                                            <p className="text-sm text-slate-500">Address #{item.id}</p>
                                        </div>
                                        <div className="rounded-xl bg-white p-3 text-amber-600 shadow-sm">
                                            <FaMapMarkerAlt />
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm text-slate-700">
                                        <p>{item.street}</p>
                                        <p>
                                            {item.city}, {item.state}
                                        </p>
                                        <p>
                                            {item.pincode}, {item.country}
                                        </p>
                                    </div>

                                    <div className="mt-5">
                                        <button
                                            type="button"
                                            onClick={() => handleEditAddress(item)}
                                            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-slate-700"
                                        >
                                            <FaEdit className="text-xs" />
                                            Edit Address
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <AddressInfoModal open={openAddress} setOpen={setOpenAddress}>
                <AddAddressForm
                    address={selectedAddress}
                    setOpenAddress={setOpenAddress}
                />
            </AddressInfoModal>

            <AddressInfoModal open={openProfileModal} setOpen={setOpenProfileModal}>
                <ProfileDetailsForm
                    user={user}
                    setOpenProfileModal={setOpenProfileModal}
                />
            </AddressInfoModal>
        </div>
    );
};

export default Profile;
