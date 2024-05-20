import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatTypes } from '../types/ChatTypes';

const  initialState: ChatTypes
    = {
    messages:[],
    users:0,
    message:''
};

export const chatRideSlice = createSlice({
    name: 'CreateRide',
    initialState,
    reducers: {
        setMessages: (state, action: PayloadAction<string>) => {
            state.messages.push(action.payload);
        },
        setInitMessages: (state, action: PayloadAction<Array<string>>) => {
            state.messages = action.payload;
        },
        setUsersLength: (state, action: PayloadAction<number>) => {
            state.users = action.payload;
        },
        setMessage: (state, action: PayloadAction<string>) => {
            state.message = action.payload;
        }
    }
});

export const { actions: chatActions } = chatRideSlice;
export const { reducer: chatRideReducer } = chatRideSlice;
