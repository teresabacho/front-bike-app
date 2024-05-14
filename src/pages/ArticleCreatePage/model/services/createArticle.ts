import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';

interface createArticleProps {
    title: string;
    blocks: Array<{
        title: string;
        paragraphs?: Array<string>;
    }>
    img?: string
}

export const createArticle = createAsyncThunk<
    void,
    createArticleProps,
    ThunkConfig<string>
>('createRoad/registerByUsername', async (createArticleData, thunkApi) => {
    const { extra, dispatch, rejectWithValue } = thunkApi;

    try {
        const response = await extra.api.post<void>('/articles', createArticleData);


        return response.data;
    } catch (e) {
        return rejectWithValue('error');
    }
});
