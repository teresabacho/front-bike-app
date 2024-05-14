import { createSlice } from '@reduxjs/toolkit';
import { MyRidesTypes } from '../types/MyRidesTypes';
import { fetchRides } from '../services/fetchRides';

const  initialState: MyRidesTypes = {
    rides:[],
    isLoading: false,
};

export const myRidesSlides = createSlice({
    name: 'CreateRide',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRides.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(fetchRides.fulfilled, (state, action) => {
                state.isLoading = false;
                state.rides = action.payload
            })
            .addCase(fetchRides.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
    },
});

export const { actions: myRidesActions } = myRidesSlides;
export const { reducer: myRidesReducer } = myRidesSlides;
