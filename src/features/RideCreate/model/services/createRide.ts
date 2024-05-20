import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { Road } from '@/entities/Road';

interface createRoadProps {
    waypoints: Array<Location>;
    finishMark:Location;
    startMark: Location;
}

export const createRoad = createAsyncThunk<
    Road,
    createRoadProps,
    ThunkConfig<string>
>('createRoad/registerByUsername', async (createRoadData, thunkApi) => {
    const { extra, dispatch, rejectWithValue } = thunkApi;

    try {
        const response = await extra.api.post<Road>('/road', createRoadData);

        if (response.status !==204) {
            throw new Error();
        }

        return response.data;
    } catch (e) {
        return rejectWithValue('error');
    }
});
