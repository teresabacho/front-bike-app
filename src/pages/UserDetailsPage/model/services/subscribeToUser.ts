import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';

export const subscribeToUser = createAsyncThunk<
    void,
    string,
    ThunkConfig<string>
>('userDetails/sub', async (userId,thunkApi) => {
    const { extra, rejectWithValue } = thunkApi;

    try {
        const response = await extra.api.post(`/users/subscribe/${userId}`);
        return response.data;
    } catch (e) {
        return rejectWithValue('error');
    }
});
