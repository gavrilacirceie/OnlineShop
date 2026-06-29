import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import {addPaymentMethod, createUserCart} from '../../store/actions';
import {useEffect, useMemo, useRef} from "react";

const PaymentMethod = () => {
    const dispatch = useDispatch();
    const { paymentMethod } = useSelector((state) => state.payment);

    const { cart } = useSelector((state) => state.carts);
    const { errorMessage } = useSelector((state) => state.errors);
    const lastSyncedCartSignatureRef = useRef("");
    const syncingCartSignatureRef = useRef("");

    const sendCartItems = useMemo(() => {
        return cart
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
    }, [cart]);

    const cartSignature = useMemo(() => {
        return JSON.stringify(
            sendCartItems
                .map(({ productId, quantity }) => ({ productId, quantity }))
                .sort((firstItem, secondItem) => firstItem.productId - secondItem.productId)
        );
    }, [sendCartItems]);


    const paymentMethodHandler = (method) => {
        dispatch(addPaymentMethod(method));
    }

    useEffect(() => {
        if (
            sendCartItems.length === 0
            || errorMessage
            || cartSignature === lastSyncedCartSignatureRef.current
            || cartSignature === syncingCartSignatureRef.current
        ) {
            return;
        }

        const syncCart = async () => {
            syncingCartSignatureRef.current = cartSignature;
            const didSync = await dispatch(createUserCart(sendCartItems, false));
            if (didSync) {
                lastSyncedCartSignatureRef.current = cartSignature;
            } else if (syncingCartSignatureRef.current === cartSignature) {
                syncingCartSignatureRef.current = "";
            }

            if (syncingCartSignatureRef.current === cartSignature) {
                syncingCartSignatureRef.current = "";
            }
        };

        syncCart();
    }, [cartSignature, dispatch, errorMessage, sendCartItems]);

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
                        value="Cash"
                        control={<Radio color='primary' />}
                        label="Cash"
                        className='text-gray-700'/>
                </RadioGroup>
            </FormControl>
        </div>
    )
}

export default PaymentMethod
