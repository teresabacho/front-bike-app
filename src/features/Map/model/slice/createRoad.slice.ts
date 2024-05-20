import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CreateRoadSchema, Location } from '../types/MapTypes';
import { createRoad } from '../services/creatRoad';

const initialState: CreateRoadSchema
    = {
    isLoading: false,
    directions: null,
    waypoints: [{location:'', position:null}],
    startMark: {location:'', position:null},
    finishMark: {location:'', position:null},
    activeInput: null,
    id:'',
    isSaved:false,
    title:'Моя улюблена поїздка',
    distance: '',
    time:'',
};

export const createRoadSlice = createSlice({
    name: 'createRoad',
    initialState,
    reducers: {
        setTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload;
        },
        setWaypoints: (state, action: PayloadAction<Location[]>) => {
            state.waypoints = action.payload;
        },
        setId: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        setFinishMark: (state, action: PayloadAction<Location>) => {
            state.finishMark = action.payload;
        },
        setStartMark: (state, action: PayloadAction<Location>) => {
            state.startMark = action.payload;
        },
        setDirections: (state, action: PayloadAction<google.maps.DirectionsResult>) => {
            state.directions = action.payload;
        },
        setActiveInput: (state, action: PayloadAction<number|null>) => {
            state.activeInput = action.payload;
        },
        setIsSaved: (state, action: PayloadAction<boolean>) => {
            state.isSaved = action.payload;
        },
        setTime: (state, action: PayloadAction<string>) => {
            state.time = action.payload;
        },
        setDistance: (state, action: PayloadAction<string>) => {
            state.distance = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createRoad.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(createRoad.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(createRoad.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { actions: createRoadActions } = createRoadSlice;
export const { reducer:createRoadReducer } = createRoadSlice;
