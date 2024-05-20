import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CreateRideTypes } from '../types/CreateRideTypes';
import { Road } from '@/entities/Road';
import { fetchRoads } from '../services/fetchRoads';
import { deleteRoad } from '../services/deleteRoad';

const  initialState: CreateRideTypes
    = {
    isLoading: false,
    usersCount: 0,
    description:'',
    isMapLoaded: false,
    directions:[]
};

export const createRideSlice = createSlice({
    name: 'CreateRide',
    initialState,
    reducers: {
        setUserCount: (state, action: PayloadAction<number>) => {
            state.usersCount = action.payload;
        },
        setRoad: (state, action: PayloadAction<Road[]>) => {
            state.road = action.payload;
        },
        setIsMapLoaded: (state, action:PayloadAction<boolean>) => {
            state.isMapLoaded = action.payload;
        },
        setDirection: (state, action:PayloadAction<{id:string, direction:google.maps.DirectionsResult}>) => {
            state.directions?.push(action.payload)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoads.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(fetchRoads.fulfilled, (state, action) => {
                state.isLoading = false;
                state.road = action.payload;
            })
            .addCase(fetchRoads.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(deleteRoad.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(deleteRoad.fulfilled, (state, action) => {
                state.isLoading = false;
                state.road =  state.road && state.road.filter(road => road.id !== action.payload);
            })
            .addCase(deleteRoad.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
    },
});

export const { actions: createRideActions } = createRideSlice;
export const { reducer: createRideReducer } = createRideSlice;
