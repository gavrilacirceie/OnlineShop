import {Step, StepLabel, Stepper} from "@mui/material";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
// import {fetchUserAddress} from "../../store/actions";
import AddressInfo from "./AddressInfo.jsx";
import {getUserAddresses} from "../../store/actions/index.js";

const Checkout = () => {
    const activeStep = 0;
    const dispatch = useDispatch();
    const { address } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getUserAddresses());
    }, [dispatch]);

    const steps =[
        "Address",
        "Payment Method",
        "Order Summary",
        "Payment",
    ]
    return(
        <div className='py-14 min-h-[calc(100vh-100px)]'>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => (
                    <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <div className='mt-5'>
                {activeStep === 0 && <AddressInfo address={address} />}
            </div>
        </div>
    );
}

export default Checkout;
