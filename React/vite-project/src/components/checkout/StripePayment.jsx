import PaymentForm from "./PaymentForm.jsx";
import {Elements} from "@stripe/react-stripe-js";
import {useDispatch, useSelector} from "react-redux";
import {loadStripe} from "@stripe/stripe-js";
import {useEffect} from "react";
import {createStripePaymentSecret} from "../../store/actions/index.js";
import Skeleton from "../shared/Skeleton.jsx";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripePayment = () =>{
    const { clientSecret } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const {totalPrice} = useSelector((state) => state.carts);
    const {isLoading, errorMessage} = useSelector((state) => state.errors);

    useEffect(() => {
        if(!clientSecret){
            dispatch(createStripePaymentSecret({
                amount: Math.round(Number(totalPrice) * 100), // Stripe uses cents
                currency: "usd",
            }));
        }
    }, [clientSecret]);

    if (isLoading) {
        return (
            <div className='max-w-lg mx-auto'>
                <Skeleton />
            </div>
        )
    }

    return (
        <>
            {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm clientSecret={clientSecret} totalPrice={totalPrice} />
                </Elements>
            )}
        </>
    )
}

export default StripePayment;