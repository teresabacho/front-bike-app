import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';

export const deleteArticle = createAsyncThunk<
    void,
    string,
    ThunkConfig<string>
>('articleDetails/addCommentForArticle', async (id, thunkApi) => {
    const { extra, dispatch, rejectWithValue,  } = thunkApi;

    try {
        const response = await extra.api.delete(`/articles/${id}`);

        return response.data;
    } catch (e) {
        return rejectWithValue('error');
    }
});
