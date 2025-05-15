import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';

export const applyToRide = createAsyncThunk<
    any,
    string | { rideId: string; message?: string },
    ThunkConfig<string>
>('RideDetails/applyToRide', async (params, thunkApi) => {
    const { extra, rejectWithValue } = thunkApi;

    let rideId: string;
    let requestBody: any = {};

    if (typeof params === 'string') {
        rideId = params;
    } else {
        rideId = params.rideId;
        if (params.message) {
            requestBody.message = params.message;
        }
    }

    try {
        const response = await extra.api.post(`/ride/${rideId}/apply`, requestBody);
        return response.data;
    } catch (e) {
        return rejectWithValue('error');
    }
});

export const fetchTrainerApplications = createAsyncThunk<
    any[],
    string | undefined,
    ThunkConfig<string>
>('RideApplications/fetchTrainerApplications', async (rideId, thunkApi) => {
    const { extra, rejectWithValue } = thunkApi;

    try {
        const url = rideId
            ? `/ride/applications/trainer?rideId=${rideId}`
            : '/ride/applications/trainer';
        const response = await extra.api.get(url);
        return response.data;
    } catch (e) {
        return rejectWithValue('error');
    }
});

export const fetchUserApplications = createAsyncThunk<
    any[],
    void,
    ThunkConfig<string>
>('RideApplications/fetchUserApplications', async (_, thunkApi) => {
    const { extra, rejectWithValue } = thunkApi;

    try {
        const response = await extra.api.get('/ride/applications/user');
        return response.data;
    } catch (e) {
        return rejectWithValue('error');
    }
});

export const handleRideApplication = createAsyncThunk<
    any,
    {
        applicationId: string;
        status: 'approved' | 'rejected';
        trainer_notes?: string;
    },
    ThunkConfig<string>
>('RideApplications/handleApplication', async ({ applicationId, status, trainer_notes }, thunkApi) => {
    const { extra, rejectWithValue } = thunkApi;

    try {
        const response = await extra.api.patch(`/ride/applications/${applicationId}`, {
            status,
            trainer_notes
        });
        return response.data;
    } catch (e) {
        return rejectWithValue('error');
    }
});

export const fetchRideApplications = createAsyncThunk<
    any[],
    string,
    ThunkConfig<string>
>('RideApplications/fetchRideApplications', async (rideId, thunkApi) => {
    const { extra, rejectWithValue } = thunkApi;

    try {
        const response = await extra.api.get(`/ride/${rideId}/applications`);
        return response.data;
    } catch (e) {
        return rejectWithValue('error');
    }
});

export const fetchApplicationStatus = createAsyncThunk<
    string | null,
    string,
    ThunkConfig<string>
>('RideApplications/fetchApplicationStatus', async (rideId, thunkApi) => {
    const { extra, rejectWithValue } = thunkApi;

    try {
        const response = await extra.api.get('/ride/applications/user');
        const applications = response.data;
        const application = applications.find(app => app.ride_id === rideId);
        return application?.status || null;
    } catch (e) {
        return rejectWithValue('error');
    }
});
