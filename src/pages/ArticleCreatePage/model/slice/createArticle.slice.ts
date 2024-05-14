import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CreateArticleTypes } from '../types/createArticleTypes';
import { createArticle } from '../services/createArticle';
import { uploadPhoto } from '../services/uploadPhoto/UploadPhoto';

const  initialState: CreateArticleTypes
    = {
    isLoading: false,
    title: '',
    blocks:[],
    file: null
};

export const createArticleSlice = createSlice({
    name: 'CreateRide',
    initialState,
    reducers: {
        setTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload;
        },
        setDescription: (state, action: PayloadAction<{
            description: string;
            title:string
        }>) => {
            state.blocks.push({paragraphs:action.payload.description.split("."), title: action.payload.title });
        },
        setFile: (state, action: PayloadAction<File>) => {
            state.file = action.payload;
        },
        updateAvatar: (state, action: PayloadAction<string>) => {
            if (state.img){
                state.img = action.payload;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createArticle.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(createArticle.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(createArticle.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(uploadPhoto.fulfilled, (state, action) => {
                state.img = action.payload.url;

            })
    },
});

export const { actions: createArticleActions } = createArticleSlice;
export const { reducer: createArticleReducer } = createArticleSlice;
