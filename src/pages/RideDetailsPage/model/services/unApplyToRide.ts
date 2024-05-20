import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';

export const unApplyToRide = createAsyncThunk<
    void,
    string,
    ThunkConfig<string>
>('RideDetails/apply', async (rideId,thunkApi) => {
    const { extra, rejectWithValue } = thunkApi;

    try {
        const response = await extra.api.delete(`/ride/${rideId}/unapply`);

        return response.data;
    } catch (e) {
        return rejectWithValue('error');
    }
});
