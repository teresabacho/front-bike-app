import { createAsyncThunk } from '@reduxjs/toolkit';
import { User, userActions } from '@/entities/User';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { TOKEN_LOCALSTORAGE_KEY } from '@/shared/const/localstorage';

interface LoginByUsernameProps {
    username: string;
    password: string;
}

export const loginByUsername = createAsyncThunk<
    { accessToken:string },
    LoginByUsernameProps,
    ThunkConfig<string>
>('login/loginByUsername', async (authData, thunkApi) => {
    const { extra, dispatch, rejectWithValue } = thunkApi;

    try {
        const response = await extra.api.post<{ accessToken:string }>('auth/login', authData);

        if (!response.data) {
            throw new Error();
        }

        localStorage.setItem(TOKEN_LOCALSTORAGE_KEY, response.data.accessToken);
        const userResponse = await extra.api.get<User>('auth/me')
        dispatch(userActions.setAuthData(userResponse.data));
        return response.data;
    } catch (e) {
        return rejectWithValue('error');
    }
});
