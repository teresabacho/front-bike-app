// model/slice/rideApplicationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    fetchApplicationStatus,
    fetchRideApplications,
    fetchTrainerApplications,
    fetchUserApplications,
    handleRideApplication,
} from '@/pages/RideDetailsPage/model/services/applyToRide';

export interface RideApplication {
    id: string;
    user_id: string;
    ride_id: string;
    status: 'pending' | 'approved' | 'rejected';
    message?: string;
    trainer_notes?: string;
    created_at: string;
    updated_at: string;
    user?: {
        id: string;
        username: string;
        first: string;
        lastname: string;
        avatar?: string;
    };
    ride?: {
        id: string;
        title: string;
        date: string;
    };
}

export interface RideApplicationState {
    trainerApplications: RideApplication[];
    userApplications: RideApplication[];
    currentRideApplications: RideApplication[];
    applicationStatus: string | null;
    isLoading: boolean;
    error?: string;
}

const initialState: RideApplicationState = {
    trainerApplications: [],
    userApplications: [],
    currentRideApplications: [],
    applicationStatus: null,
    isLoading: false,
};

export const rideApplicationSlice = createSlice({
    name: 'rideApplications',
    initialState,
    reducers: {
        clearApplications: (state) => {
            state.trainerApplications = [];
            state.userApplications = [];
            state.currentRideApplications = [];
        },
        clearError: (state) => {
            state.error = undefined;
        },
        setApplicationStatus: (state, action: PayloadAction<string | null>) => {
            state.applicationStatus = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTrainerApplications.pending, (state) => {
                state.isLoading = true;
                state.error = undefined;
            })
            .addCase(fetchTrainerApplications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.trainerApplications = action.payload;
            })
            .addCase(fetchTrainerApplications.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            .addCase(fetchUserApplications.pending, (state) => {
                state.error = undefined;
            })
            .addCase(fetchUserApplications.fulfilled, (state, action) => {
                state.userApplications = action.payload;
            })
            .addCase(fetchUserApplications.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(handleRideApplication.pending, (state) => {
                state.error = undefined;
            })
            .addCase(handleRideApplication.fulfilled, (state, action) => {
                const index = state.trainerApplications.findIndex(
                    app => app.id === action.payload.id
                );
                if (index !== -1) {
                    state.trainerApplications[index] = action.payload;
                }

                const currentIndex = state.currentRideApplications.findIndex(
                    app => app.id === action.payload.id
                );
                if (currentIndex !== -1) {
                    state.currentRideApplications[currentIndex] = action.payload;
                }
            })
            .addCase(handleRideApplication.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(fetchRideApplications.pending, (state) => {
                state.error = undefined;
            })
            .addCase(fetchRideApplications.fulfilled, (state, action) => {
                state.currentRideApplications = action.payload;
            })
            .addCase(fetchRideApplications.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(fetchApplicationStatus.pending, (state) => {
                state.error = undefined;
            })
            .addCase(fetchApplicationStatus.fulfilled, (state, action) => {
                state.applicationStatus = action.payload;
            })
            .addCase(fetchApplicationStatus.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { actions: rideApplicationActions } = rideApplicationSlice;
export const { reducer: rideApplicationReducer } = rideApplicationSlice;
