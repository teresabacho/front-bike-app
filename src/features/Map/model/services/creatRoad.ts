import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { Location } from '../types/MapTypes';
import { Road } from '@/entities/Road';

interface createRoadProps {
    waypoints: Array<Location>;
    finishMark:Location;
    startMark: Location;
    title: string
}

export const createRoad = createAsyncThunk<
    Road,
    createRoadProps,
    ThunkConfig<string>
>('createRoad/createRoad', async (createRoadData, thunkApi) => {
    const { extra, dispatch, rejectWithValue, getState } = thunkApi;
    const {title} = getState().createRoadSchema

    try {
        console.log(createRoadData);
        const { data, status } = await extra.api.post<Road>('/road', { ...createRoadData,title });

        if (status !==201) {
            throw new Error();
        }
        return data;
    } catch (e) {
        return rejectWithValue('error');
    }
});
