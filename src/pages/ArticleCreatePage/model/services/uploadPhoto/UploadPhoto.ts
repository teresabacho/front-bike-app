import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';

export const uploadPhoto = createAsyncThunk<
    {url:string},
    {file:FormData},
    ThunkConfig<string>
>('createRide/fetchRoad', async (uploadPhotoData,thunkApi) => {
    const { extra, rejectWithValue } = thunkApi;
    try {
        const response = await extra.api.post<{url:string}>("/articles/upload-photo", uploadPhotoData.file,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });


        return response.data;
    } catch (e) {
        return rejectWithValue('error');
    }
});
