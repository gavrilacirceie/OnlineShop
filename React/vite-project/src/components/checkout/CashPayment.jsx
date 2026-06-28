import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {placeCashOrder} from "../../store/actions/index.js";

const CashPayment = ({address}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {btnLoader} = useSelector((state) => state.errors);

    const placeOrderHandler = () => {
        const addressId = address?.id || address?.addressId;

        if (!addressId) {
            toast.error("Please select a checkout address before placing the order.");
            return;
        }

        dispatch(placeCashOrder(addressId, toast, navigate));
    };

    return (
        <div className="max-w-md mx-auto mt-16 p-5 bg-white shadow-md rounded-lg border">
            <h1 className="text-2xl font-semibold mb-4">Cash Payment</h1>
            <p className="text-gray-600 mb-5">
                Pay with cash when your order is delivered.
            </p>
            <button
                type="button"
                disabled={btnLoader}
                onClick={placeOrderHandler}
                className={`w-full bg-custom-blue font-semibold px-6 h-11 rounded-md text-white ${
                    btnLoader ? "opacity-60 cursor-not-allowed" : ""
                }`}
            >
                {btnLoader ? "Placing Order..." : "Place Order"}
            </button>
        </div>
    );
};

export default CashPayment;
