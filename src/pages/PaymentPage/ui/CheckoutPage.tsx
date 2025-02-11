import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StylishPaymentForm from './StylishPaymentForm';
import './CheckoutPage.scss';
import { useLocation, useNavigate } from 'react-router-dom';

const stripePromise = loadStripe('pk_test_51R0O35ADcJinMXn0B5DrOo6VA9ivmBYgj8TnANSWAraLFniHqmLyTeMiWu98iB1pF55kWe8Ju9V7P4jg7PYNTlyJ00oWTg64qV');

const CheckoutPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const amount = queryParams.get('amount');
    const price = queryParams.get('price');
    const rideId = queryParams.get('rideId');
    const [step, setStep] = useState(1);
    const [orderInfo, setOrderInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        total: price
    });
    const navigator = useNavigate();

    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const handleChange = (e) => {
        setOrderInfo({
            ...orderInfo,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmitInfo = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handlePaymentSuccess = (paymentIntent) => {
        setPaymentSuccess(true);
        console.log('Успішний платіж', paymentIntent);
    };

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <div className="steps-container">
                    <ol className="steps-list">
                        <li className={`step-item ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>
                            <span className="step-number">1</span>
                            <span className="step-text">Інформація</span>
                            <span className="step-divider"></span>
                        </li>
                        <li className={`step-item ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>
                            <span className="step-number">2</span>
                            <span className="step-text">Оплата</span>
                            <span className="step-divider"></span>
                        </li>
                        <li className={`step-item ${step === 3 ? 'active' : ''}`}>
                            <span className="step-number">3</span>
                            <span className="step-text">Підтвердження</span>
                        </li>
                    </ol>
                </div>

                {/* Основний контент */}
                <div className="checkout-content">
                    <div className="checkout-inner">
                        <h1 className="checkout-title">Оформлення замовлення</h1>

                        {step === 1 && (
                            <form onSubmit={handleSubmitInfo} className="checkout-form">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">Ім'я та прізвище</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={orderInfo.name}
                                            onChange={handleChange}
                                            required
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={orderInfo.email}
                                            onChange={handleChange}
                                            required
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Телефон</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={orderInfo.phone}
                                            onChange={handleChange}
                                            required
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Місто</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={orderInfo.city}
                                            onChange={handleChange}
                                            required
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group form-group-full">
                                        <label className="form-label">Адреса</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={orderInfo.address}
                                            onChange={handleChange}
                                            required
                                            className="form-input"
                                        />
                                    </div>
                                </div>

                                <div className="form-footer">
                                    <button
                                        type="submit"
                                        className="submit-button"
                                    >
                                        Перейти до оплати
                                    </button>
                                </div>
                            </form>
                        )}

                        {step === 2 && (
                            <div className="payment-step">
                                <div className="payment-total">
                                    <h3 className="payment-total-title">Сума до сплати</h3>
                                    <div className="payment-total-amount">{price} грн</div>
                                    <p className="payment-total-tax">Включно з ПДВ</p>
                                </div>

                                <Elements stripe={stripePromise}>
                                    <StylishPaymentForm
                                        amount={price}
                                        rideId={rideId}
                                        onSuccess={(paymentIntent) => {
                                            handlePaymentSuccess(paymentIntent);
                                            setStep(3);
                                        }}
                                    />
                                </Elements>

                                <div className="back-link-container">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="back-link"
                                    >
                                        ← Повернутися до даних замовлення
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="success-step">
                                <div className="success-icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 13L9 17L19 7" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <h2 className="success-title">Дякуємо за замовлення!</h2>
                                <p className="success-message">
                                    Ваше замовлення успішно оформлено і оплачено. Деталі замовлення відправлено на ваш email.
                                </p>
                                <div className="order-details">
                                    <h3 className="order-details-title">Інформація про замовлення:</h3>
                                    <div className="order-details-info">
                                        <p><span className="info-label">Ім'я:</span> {orderInfo.name}</p>
                                        <p><span className="info-label">Email:</span> {orderInfo.email}</p>
                                        <p><span className="info-label">Адреса:</span> {orderInfo.city}, {orderInfo.address}</p>
                                        <p><span className="info-label">Сума:</span> {orderInfo.total} грн</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigator('/ride-details/'+rideId)}
                                    className="home-button"
                                >
                                    Повернутися до поїздки
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {step === 2 && (
                    <div className="test-cards-container">
                        <h3 className="test-cards-title">Для тестування платежів:</h3>
                        <ul className="test-cards-list">
                            <li>• Успішний платіж: <span className="card-number">4242 4242 4242 4242</span></li>
                            <li>• 3D Secure: <span className="card-number">4000 0025 0000 3155</span></li>
                            <li>• Відхилено: <span className="card-number">4000 0000 0000 9995</span></li>
                            <li>• Для всіх карт: будь-яка дата в майбутньому, будь-які 3 цифри CVC</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutPage;
