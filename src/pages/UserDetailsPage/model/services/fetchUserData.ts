import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { UserListItem } from '../types/userDetails';

export const fetchUserData = createAsyncThunk<
    UserListItem,
    string,
    ThunkConfig<string>
>('userDetails/', async (profileId, thunkApi) => {
    const { extra, rejectWithValue } = thunkApi;

    try {
        const response = await extra.api.get<UserListItem>(`/users/profile/${profileId}`);

        console.log(response.data);

        if (!response.data) {
            throw new Error();
        }

        return response.data;
    } catch (e) {
        return rejectWithValue('error');
    }
});
