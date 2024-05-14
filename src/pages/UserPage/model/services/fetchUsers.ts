import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { UserListItem } from '../types/usersList';

export const fetchUsers = createAsyncThunk<
    UserListItem[],
    void,
    ThunkConfig<string>
>('createRide/fetchRoad', async (props,thunkApi) => {
    const { extra, rejectWithValue } = thunkApi;

    try {
        const response = await extra.api.get<UserListItem[]>(`/users/get_chat`);

        console.log(response);

        return response.data;
    } catch (e) {
        return rejectWithValue('error');
    }
});
