import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';



export const deleteRoad = createAsyncThunk<
    string,
    string,
    ThunkConfig<string>
>('createRoad/deleteRoad', async (id, thunkApi) => {
    const { extra, dispatch, rejectWithValue } = thunkApi;

    try {
        const response = await extra.api.delete(`/road/${id}`);

        if (response.status !==204) {
            throw new Error();
        }

        return id
    } catch (e) {
        return rejectWithValue('error');
    }
});
