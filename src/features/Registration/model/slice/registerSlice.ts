import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RegisterSchema } from '../types/registerSchema';
import { registerByUsernameAndEmail } from '../services/registerByUsernameAndEmail/registerByUsernameAndEmail';

const initialState: RegisterSchema = {
    isLoading: false,
    username: '',
    password: '',
    email: '',
    role: '',
};

export const registerSlice = createSlice({
    name: 'register',
    initialState,
    reducers: {
        setUsername: (state, action: PayloadAction<string>) => {
            state.username = action.payload;
        },
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
        setPassword: (state, action: PayloadAction<string>) => {
            state.password = action.payload;
        },
        setRole: (state, action: PayloadAction<string>) => {
            console.log('hello');
            console.log(action.payload);
            state.role = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerByUsernameAndEmail.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(registerByUsernameAndEmail.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(registerByUsernameAndEmail.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

// Action creators are generated for each case reducer function
export const { actions: registerActions } = registerSlice;
export const { reducer: registerReducer } = registerSlice;
