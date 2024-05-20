import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { Road } from '@/entities/Road';

export const fetchRoad = createAsyncThunk<
    Road,
    string,
    ThunkConfig<string>
>('createRide/fetchRoad', async (id,thunkApi) => {
    const { extra, rejectWithValue } = thunkApi;

    try {
        const response = await extra.api.get<Road>(`/road/${id}`);

        if (!response.data) {
            throw new Error();
        }

        return response.data;
    } catch (e) {
        return rejectWithValue('error');
    }
});
