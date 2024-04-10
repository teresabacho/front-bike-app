import { createSlice } from '@reduxjs/toolkit';
import { userSlice } from '@/entities/User/model/slice/userSlice';

const initialState = {
    loading: false,
    error: null,
    paymentInfo: null,
    paymentHistory: [],
};

const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        paymentStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        paymentSuccess: (state, action) => {
            state.loading = false;
            state.paymentInfo = action.payload;
            // @ts-ignore
            state.paymentHistory.push(action.payload);
        },
        paymentFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        clearPaymentInfo: (state) => {
            state.paymentInfo = null;
            state.error = null;
        },
    },
});

export const { paymentStart, paymentSuccess, paymentFailed, clearPaymentInfo } = paymentSlice.actions;
export const { reducer: paymentReducer } = userSlice;
