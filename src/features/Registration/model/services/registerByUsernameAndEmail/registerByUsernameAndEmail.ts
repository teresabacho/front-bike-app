import { createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '@/entities/User';
import { ThunkConfig } from '@/app/providers/StoreProvider';

interface RegisterByUsernameAndEmailProps {
    username: string;
    email:string;
    password: string;
}

export const registerByUsernameAndEmail = createAsyncThunk<
    User,
    RegisterByUsernameAndEmailProps,
    ThunkConfig<string>
>('register/registerByUsername', async (authData, thunkApi) => {
    const { extra, dispatch, rejectWithValue } = thunkApi;

    try {
        const response = await extra.api.post<User>('/auth/registration', authData);

        if (response.status !==204) {
            throw new Error();
        }

        return response.data;
    } catch (e) {
        return rejectWithValue('error');
    }
});
