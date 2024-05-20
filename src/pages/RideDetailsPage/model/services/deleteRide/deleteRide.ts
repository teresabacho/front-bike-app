import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';

export const deleteRide = createAsyncThunk<
    void,
    string,
    ThunkConfig<string>
>('articleDetails/addCommentForArticle', async (id, thunkApi) => {
    const { extra, dispatch, rejectWithValue,  } = thunkApi;

    try {
        const response = await extra.api.delete(`/ride/${id}`);

        return response.data;
    } catch (e) {
        return rejectWithValue('error');
    }
});
