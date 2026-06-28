package org.platforma.onlineshop.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.CustomerSearchResult;
import com.stripe.model.PaymentIntent;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.CustomerSearchParams;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.platforma.onlineshop.payload.StripePaymentDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class StripeServiceImpl implements StripeService {

    @Value("${stripe.secret.key}")
    private String apiKey;

    @PostConstruct
    public void init(){
        Stripe.apiKey = apiKey;
    }
    @Override
    public PaymentIntent paymentIntent(StripePaymentDTO stripePaymentDto) throws StripeException {
       PaymentIntentCreateParams params =
               PaymentIntentCreateParams.builder()
                       .setAmount(stripePaymentDto.getAmount())
                       .setCurrency(stripePaymentDto.getCurrency())
                       .setAutomaticPaymentMethods(
                               PaymentIntentCreateParams.AutomaticPaymentMethods.builder().setEnabled(true).build()
                       )
                       .build();

        return PaymentIntent.create(params);
    }
}
