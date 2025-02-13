import { createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '@/entities/User';
import { ThunkConfig } from '@/app/providers/StoreProvider';

interface RegisterByUsernameAndEmailProps {
    username: string;
    email:string;
    password: string;
    role:string
}

export const registerByUsernameAndEmail = createAsyncThunk('register/registerByUsernameAndEmail', async (formData, thunkApi) => {
    const { extra, rejectWithValue } = thunkApi;

    try {
        // Using FormData, not sending JSON
        const response = await extra.api.post('/auth/registration', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.status !==200) {
            throw new Error();
        }

        return response.data;
    } catch (e) {
        console.log(e);
        return rejectWithValue('error');
    }
});
