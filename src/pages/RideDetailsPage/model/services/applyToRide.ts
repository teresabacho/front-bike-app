import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';

export const applyToRide = createAsyncThunk<
    void,
    string,
    ThunkConfig<string>
>('RideDetails/unapply', async (rideId,thunkApi) => {
    const { extra, rejectWithValue } = thunkApi;

    try {
        const response = await extra.api.post(`/ride/${rideId}/apply`);
        return response.data;
    } catch (e) {
        return rejectWithValue('error');
    }
});
