import {useDispatch, useSelector} from "react-redux";
import {FaBuilding, FaCheckCircle, FaEdit, FaStreetView, FaTrash} from "react-icons/fa";
import {MdLocationCity, MdPinDrop, MdPublic} from "react-icons/md";
import {selectUserCheckoutAddress} from "../../store/actions/index.js";

const AddressList = ({address, setSelectedAddress, setOpenAddress, setOpenDeleteModal}) => {
    const { selectedUserCheckoutAddress } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const onEditButtonHandler = (selectedAddress) => {
        setSelectedAddress(selectedAddress);
        setOpenAddress(true);
    };

    const onDeleteButtonHandler = (addresses) => {
        setSelectedAddress(addresses);
        setOpenDeleteModal(true);
    };

    const handleAddressSelection = (addresses) => {
        dispatch(selectUserCheckoutAddress(addresses));
    };

    return (
        <div className='space-y-4'>
            {address.map((address) => (
                <div
                    key={address.id}
                    onClick={() => handleAddressSelection(address)}
                    className={`p-4 border rounded-md cursor-pointer relative ${
                        selectedUserCheckoutAddress?.id === address.id
                            ? "bg-green-100"
                            : "bg-white"
                    }`}>
                    <div className="flex items-start">
                        <div className="space-y-1">
                            <div className="flex items-center ">
                                <FaBuilding size={14} className='mr-2 text-gray-600' />
                                <p className='font-semibold'>{address.buildingName}</p>
                                {selectedUserCheckoutAddress?.id === address.id && (
                                    <FaCheckCircle className='text-green-500 ml-2' />
                                )}
                            </div>

                            <div className="flex items-center ">
                                <FaStreetView size={17} className='mr-2 text-gray-600' />
                                <p>{address.street}</p>
                            </div>

                            <div className="flex items-center ">
                                <MdLocationCity size={17} className='mr-2 text-gray-600' />
                                <p>{address.city}, {address.state}</p>
                            </div>

                            <div className="flex items-center ">
                                <MdPinDrop size={17} className='mr-2 text-gray-600' />
                                <p>{address.pincode}</p>
                            </div>

                            <div className="flex items-center ">
                                <MdPublic size={17} className='mr-2 text-gray-600' />
                                <p>{address.country}</p>
                            </div>
                        </div>
                    </div>


                    <div className="flex gap-3 absolute top-4 right-2">
                        <button type="button" onClick={(event) => {
                            event.stopPropagation();
                            onEditButtonHandler(address);
                        }}>
                            <FaEdit size={18} className="text-teal-700" />
                        </button>
                        <button type="button" onClick={(event) => {
                            event.stopPropagation();
                            onDeleteButtonHandler(address);
                        }}>
                            <FaTrash size={17} className="text-rose-600" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default AddressList;
