import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MyPage, UserListItem } from '../types/MyPage';
import { fetchUserData } from '../services/fetchUserData';
import { fetchRides } from '../services/fetchRides';
import { fetchPosts } from '../services/fetchPosts';


const  initialState: MyPage
    = {
    user:null,
    articles:[],
    rides:[]
};

export const MyPageSLice = createSlice({
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
    },
});

export const { actions: myPageActions } = MyPageSLice;
export const { reducer: myPageReducer } = MyPageSLice;
