import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useDispatch } from 'react-redux';
import './StylishPaymentForm.scss';
import { $api } from '@/shared/api/api';

const StylishPaymentForm = ({ amount, onSuccess, rideId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();
    const [clientSecret, setClientSecret] = useState('');
    const [error, setError] = useState(null);
    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const fetchClientSecret = async () => {
            try {
                const response = await $api.post('payments/create-payment-intent', {
                    rideId: rideId,
                    amount: amount* 1000
                });
                const data = await response.data;
                setClientSecret(data.clientSecret);
            } catch (err) {
                console.error('Помилка при створенні PaymentIntent', err);
                setError('Не вдалося підготувати платіжну форму');
            }
        };

        fetchClientSecret();
    }, [amount]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: 'Клієнт',
                },
            },
        });

        if (result.error) {
            setError(result.error.message);
        } else if (result.paymentIntent.status === 'succeeded') {
            setSucceeded(true);
            if (onSuccess) onSuccess(result.paymentIntent);
        }

        setProcessing(false);
    };

    const cardElementOptions = {
        style: {
            base: {
                color: '#32325d',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4'
                }
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
            }
        },
        hidePostalCode: true
    };

    return (
        <div className="payment-form-container">
            <div className="payment-form-header">
                <h2 className="payment-title">Оплата</h2>
                <p className="payment-amount">Сума до сплати: {amount} грн</p>
            </div>

            {error && (
                <div className="payment-error">
                    {error}
                </div>
            )}

            {succeeded ? (
                <div className="payment-success">
                    <div className="payment-success-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 13L9 17L19 7" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <p className="payment-success-text">Оплата успішно здійснена!</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="payment-form">
                    <div className="form-group">
                        <label className="form-label">
                            Дані картки
                        </label>
                        <div className="card-element-container">
                            <CardElement options={cardElementOptions} />
                        </div>
                        <p className="form-hint">
                            Для тестування використовуйте карту 4242 4242 4242 4242
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={processing || !stripe || !clientSecret}
                        className={`payment-button ${processing ? 'processing' : ''}`}
                    >
                        {processing ? (
                            <span className="button-processing">
                <svg className="spinner" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
                Обробка...
              </span>
                        ) : (
                            `Оплатити ${amount} грн`
                        )}
                    </button>

                    <div className="payment-footer">

                        <p className="payment-security">
                            Ваші дані захищені шифруванням 256-біт
                        </p>
                    </div>
                </form>
            )}
        </div>
    );
};

export default StylishPaymentForm;
