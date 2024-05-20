import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { Road } from '@/entities/Road';

export const fetchRideData = createAsyncThunk<
    {
        id: string;
        user_count: number;
        road_id: string;
        title: string;
        description: string;
        isApplied: boolean;
    } ,
    string,
    ThunkConfig<string>
>('rideDetails/', async (id, thunkApi) => {
    const { extra, rejectWithValue } = thunkApi;

    try {
        const response = await extra.api.get<{
            id: string;
            user_count: number;
            road_id: string;
            title: string;
            description: string;
            isApplied: boolean;
        } >(`/ride/${id}`);

        console.log(response.data);

        if (!response.data) {
            throw new Error();
        }

        return response.data;
    } catch (e) {
        return rejectWithValue('error');
    }
});

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
