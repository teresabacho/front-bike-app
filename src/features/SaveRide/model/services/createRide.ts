import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { Road } from '@/entities/Road';

interface createRoadProps {
    title?:string,
    description?:string,
    roadId?:string,
    usersCount?:number,
    date?:string
    isPaid?:boolean,
    price?:number,
    distance?:number,
    duration?:number,
}

export const createRide = createAsyncThunk<
    Road,
    createRoadProps,
    ThunkConfig<string>
>('createRoad/registerByUsername', async (createRideData, thunkApi) => {
    const { extra, dispatch, rejectWithValue } = thunkApi;

    try {
        const response = await extra.api.post('/ride', createRideData);

        if (response.status !==204) {
            throw new Error();
        }

        return response.data;
    } catch (e) {
        return rejectWithValue('error');
    }
});
