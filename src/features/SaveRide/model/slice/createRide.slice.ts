import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SaveRideTypes } from '../types/SaveRideTypes';
import { Road } from '@/entities/Road';
import { fetchRoad } from '../services/fetchRoad';

const  initialState: SaveRideTypes
    = {
    isLoading: false,
    usersCount: 0,
    description:'',
    title:'',
    date:'',
    isMapLoaded: false,
};

export const saveRideSlice = createSlice({
    name: 'CreateRide',
    initialState,
    reducers: {
        setUserCount: (state, action: PayloadAction<number>) => {
            console.log(action.payload);
            state.usersCount = action.payload;
        },
        setTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload;
        },
        setRoad: (state, action: PayloadAction<Road>) => {
            state.road = action.payload;
        },
        setDescription: (state, action: PayloadAction<string>) => {
            state.description = action.payload;
        },
        setIsMapLoaded: (state, action:PayloadAction<boolean>) => {
            state.isMapLoaded = action.payload;
        },
        setDirection: (state, action:PayloadAction<google.maps.DirectionsResult>) => {
            state.directions = action.payload
        },
        setDate: (state, action:PayloadAction<string>) => {
            state.date = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoad.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(fetchRoad.fulfilled, (state, action) => {
                state.isLoading = false;
                state.road = action.payload;
            })
            .addCase(fetchRoad.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
    },
});

export const { actions: saveRideActions } = saveRideSlice;
export const { reducer: saveRideReducer } = saveRideSlice;
