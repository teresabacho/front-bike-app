import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RideDetails } from '../types/rideDetails';
import { fetchRideData, fetchRoad } from '../services/fetchRideData';
import { applyToRide } from '../services/applyToRide';
import { unApplyToRide } from '../services/unApplyToRide';
import { Road } from '@/entities/Road';
import { deleteRide } from '../services/deleteRide/deleteRide';

const  initialState: RideDetails
    = {
    ride:null,
    isMapLoaded:false,
    road:null
};

export const rideDetailsSlice = createSlice({
    name: 'UserDetails',
    initialState,
    reducers:{
        setIsMapLoaded: (state, action:PayloadAction<boolean>) => {
            state.isMapLoaded = action.payload;
        },
        setDirection: (state, action:PayloadAction<google.maps.DirectionsResult>) => {
            state.directions = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(
                   fetchRideData.fulfilled,
                    (state, action: PayloadAction<{
                        id: string;
                        user_count: number;
                        road_id: string;
                        title: string;
                        description: string;
                        isApplied: boolean;
                    } >) => {
                       state.ride = action.payload;
                  }
            )
            .addCase(
                fetchRoad.fulfilled,
                (state, action: PayloadAction<Road>) => {
                    state.road = action.payload;
                }
            )
            .addCase(
                applyToRide.fulfilled,
                (state, action: PayloadAction) => {
                    // @ts-ignore
                    state.ride.isApplied = true;
                }
            )
            .addCase(
                unApplyToRide.fulfilled,
                (state, action: PayloadAction) => {
                        // @ts-ignore
                    state.ride.isApplied = false;
                }
            )
            .addCase(deleteRide.fulfilled, (state, action: PayloadAction) => {

            })
    },
});

export const { actions: rideDetailsActions } = rideDetailsSlice;
export const { reducer: rideDetailsReducer } = rideDetailsSlice;
