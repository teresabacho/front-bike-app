import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDetails, UserListItem } from '../types/userDetails';
import { fetchUserData } from '../services/fetchUserData';
import { subscribeToUser } from '../services/subscribeToUser';
import { unSubscribeToUser } from '../services/unSubscribeToUser';
import { fetchRides } from '../services/fetchRides';
import { fetchPosts } from '../services/fetchPosts';

const  initialState: UserDetails
    = {
    user:null,
    rides:[]
};

export const userDetailsSlice = createSlice({
    name: 'UserDetails',
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder
            .addCase(
                   fetchUserData.fulfilled,
                    (state, action: PayloadAction<UserListItem>) => {
                       state.user = action.payload;
                  }
            )
            .addCase(
                subscribeToUser.fulfilled,
                (state, action: PayloadAction) => {
                    // @ts-ignore
                    state.user.isSubscribed = true;
                }
            )
            .addCase(
                unSubscribeToUser.fulfilled,
                (state, action: PayloadAction) => {
                        // @ts-ignore
                    state.user.isSubscribed = false;
                }
            )
            .addCase(
                fetchRides.fulfilled,
                (state, action: PayloadAction) => {
                    // @ts-ignore
                    state.rides = action.payload;
                }
            )
            .addCase(
                fetchPosts.fulfilled,
                (state, action: PayloadAction) => {
                    // @ts-ignore
                    state.articles = action.payload;
                }
            )
    }
});

export const { actions: userDetailsActions } = userDetailsSlice;
export const { reducer: userDetailsReducer } = userDetailsSlice;
