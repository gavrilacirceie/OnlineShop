package org.platforma.onlineshop.service;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.platforma.onlineshop.payload.StripePaymentDTO;

public interface StripeService {

    PaymentIntent paymentIntent(StripePaymentDTO stripePaymentDTO) throws StripeException;
}
