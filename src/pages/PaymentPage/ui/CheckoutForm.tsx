import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useDispatch, useSelector } from 'react-redux';
import { paymentStart, paymentSuccess, paymentFailed } from '../slice/paymentSlice';
import { $api } from '@/shared/api/api';

const CheckoutForm = ({ amount }) => {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();
    const [clientSecret, setClientSecret] = useState('');
    const [error, setError] = useState(null);
    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const fetchClientSecret = async () => {
            const response = await $api.post('/payments/create-payment-intent', {
                amount:50*100
            });
            const data = response.data
            setClientSecret(data.clientSecret);
        };

        fetchClientSecret();
    }, [amount]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);
        dispatch(paymentStart());

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                // @ts-ignore
                card: elements.getElement(CardElement),
            },
        });
        console.log(result);

        if (result.error) {
            // @ts-ignore
            setError(result.error.message);
            dispatch(paymentFailed(result.error.message));
        } else if (result.paymentIntent.status === 'succeeded') {
            setSucceeded(true);
            dispatch(paymentSuccess({
                id: result.paymentIntent.id,
                amount: result.paymentIntent.amount / 100,
                status: result.paymentIntent.status,
            }));
        }

        setProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button disabled={processing || !stripe}>
                {processing ? 'Обробка...' : `Оплатити ${amount} грн`}
            </button>
            {error && <div className="error">{error}</div>}
            {succeeded && <div className="success">Платіж успішно виконано!</div>}
        </form>
    );
};

export default CheckoutForm;
