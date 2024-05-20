import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { Road } from '@/entities/Road';

export const fetchRoads = createAsyncThunk<
    Road[],
    void,
    ThunkConfig<string>
>('createRide/fetchRoad', async (props,thunkApi) => {
    const { extra, rejectWithValue } = thunkApi;

    try {
        const response = await extra.api.get<Road[]>(`/road`);

        if (!response.data) {
            throw new Error();
        }

        return response.data;
    } catch (e) {
        return rejectWithValue('error');
    }
});
