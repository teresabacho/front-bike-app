import { createSlice } from '@reduxjs/toolkit';
import { UsersList } from '../types/usersList';
import { fetchUsers } from '../services/fetchUsers';

const  initialState: UsersList
    = {
    users:[]
};

export const userListSlice = createSlice({
    name: 'UserList',
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.users = action.payload;
            })
    },
});

export const { actions: userListActions } = userListSlice;
export const { reducer: userListReducer } = userListSlice;
