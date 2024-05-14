import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';

export const unSubscribeToUser = createAsyncThunk<
    void,
    string,
    ThunkConfig<string>
>('userDetails/unsub', async (userId,thunkApi) => {
    const { extra, rejectWithValue } = thunkApi;

    try {
        const response = await extra.api.delete(`/users/unsubscribe/${userId}`);

        return response.data;
    } catch (e) {
        return rejectWithValue('error');
    }
});
