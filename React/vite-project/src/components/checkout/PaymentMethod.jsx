import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import {addPaymentMethod, createUserCart} from '../../store/actions';
import {useEffect} from "react";

const PaymentMethod = () => {
    const dispatch = useDispatch();
    const { paymentMethod } = useSelector((state) => state.payment);

    const { cart, cartId } = useSelector((state) => state.carts);
    const { errorMessage } = useSelector((state) => state.errors);


    const paymentMethodHandler = (method) => {
        dispatch(addPaymentMethod(method));
    }

    useEffect(() => {
        if (cart.length > 0 && !cartId && !errorMessage) {
            const sendCartItems = cart
                .map((item) => {
                    const productId = Number(item.productId || item.id);
                    const quantity = Number(item.quantity) || 1;

                    return {
                        productId,
                        product: { productId },
                        quantity,
                    };
                })
                .filter((item) => Number.isFinite(item.productId) && item.productId > 0 && item.quantity > 0);

            if (sendCartItems.length > 0) {
                dispatch(createUserCart(sendCartItems));
            }
        }
    }, [cart, cartId, dispatch, errorMessage]);

    return (
        <div className='max-w-md mx-auto p-5 bg-white shadow-md rounded-lg mt-16 border'>
            <h1 className='text-2xl font-semibold mb-4'>Select Payment Method</h1>
            <FormControl>
                <RadioGroup
                    aria-label="payment method"
                    name="paymentMethod"
                    value={paymentMethod}
                    onChange={(e) => paymentMethodHandler(e.target.value)}
                >
                    <FormControlLabel
                        value="Stripe"
                        control={<Radio color='primary' />}
                        label="Stripe"
                        className='text-gray-700'/>

                    <FormControlLabel
                        value="Paypal"
                        control={<Radio color='primary' />}
                        label="Paypal"
                        className='text-gray-700'/>
                </RadioGroup>
            </FormControl>
        </div>
    )
}

export default PaymentMethod
