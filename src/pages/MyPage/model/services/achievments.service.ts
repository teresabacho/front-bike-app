import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import {
    AchievementProgressDto,
    MonthlyGoalStatusDto,
    UserAchievementDto,
    UserLevelDto,
} from '@/pages/MyPage/model/services/achievment.dto';

export const fetchAchievements = createAsyncThunk<
    UserAchievementDto[],
    void,
    ThunkConfig<string>
>(
    'achievements/fetchAchievements',
    async (_, thunkApi) => {
        const { extra, rejectWithValue } = thunkApi;

        try {
            const response = await extra.api.get<UserAchievementDto[]>('/achievements');

            if (!response.data) {
                throw new Error('Не вдалося отримати досягнення');
            }

            return response.data;
        } catch (e) {
            console.log(e);
            return rejectWithValue('Помилка при отриманні досягнень');
        }
    },
);

export const checkAchievements = createAsyncThunk<
    UserAchievementDto[],
    void,
    ThunkConfig<string>
>(
    'achievements/checkAchievements',
    async (_, thunkApi) => {
        const { extra, rejectWithValue } = thunkApi;

        try {
            const response = await extra.api.get<UserAchievementDto[]>('/achievements/check');

            if (!response.data) {
                throw new Error('Не вдалося перевірити досягнення');
            }

            return response.data;
        } catch (e) {
            console.log(e);
            return rejectWithValue('Помилка при перевірці досягнень');
        }
    },
);

export const markAchievementsSeen = createAsyncThunk<
    { success: boolean },
    void,
    ThunkConfig<string>
>(
    'achievements/markAchievementsSeen',
    async (_, thunkApi) => {
        const { extra, rejectWithValue } = thunkApi;

        try {
            const response = await extra.api.post<{ success: boolean }>('/achievements/seen');

            if (!response.data) {
                throw new Error('Не вдалося позначити досягнення як переглянуті');
            }

            return response.data;
        } catch (e) {
            console.log(e);
            return rejectWithValue('Помилка при позначенні досягнень');
        }
    },
);
export const fetchAchievementsProgress = createAsyncThunk<
    AchievementProgressDto[],
    void,
    ThunkConfig<string>
>(
    'achievements/fetchAchievementsProgress',
    async (_, thunkApi) => {
        const { extra, rejectWithValue } = thunkApi;

        try {
            const response = await extra.api.get<AchievementProgressDto[]>('/achievements/progress');

            if (!response.data) {
                throw new Error('Не вдалося отримати прогрес досягнень');
            }

            return response.data;
        } catch (e) {
            console.log(e);
            return rejectWithValue('Помилка при отриманні прогресу досягнень');
        }
    },
);
export const LEVEL_COLORS = {
    1: 'var(--save-redesigned)',
    2: 'var(--save-redesigned)',
    3: 'var(--warning-redesigned)',
    4: 'var(--warning-redesigned)',
    5: 'var(--accent)',
    6: 'var(--accent)',
    7: 'var(--cancel-redesigned)',
    8: 'var(--cancel-redesigned)',
    9: 'gold',
    10: 'gold',
    default: 'var(--hint)',
};
export const fetchUserLevel = createAsyncThunk<
    UserLevelDto,
    void,
    ThunkConfig<string>
>(
    'userLevel/fetchUserLevel',
    async (_, thunkApi) => {
        const { extra, rejectWithValue } = thunkApi;

        try {
            const response = await extra.api.get<UserLevelDto>('/levels');

            if (!response.data) {
                throw new Error('Не вдалося отримати дані про рівень');
            }

            return response.data;
        } catch (e) {
            console.log(e);
            return rejectWithValue('Помилка при отриманні рівня користувача');
        }
    },
);


export const fetchMonthlyGoal = createAsyncThunk<
    MonthlyGoalStatusDto,
    void,
    ThunkConfig<string>
>(
    'userLevel/fetchMonthlyGoal',
    async (_, thunkApi) => {
        const { extra, rejectWithValue } = thunkApi;

        try {
            const response = await extra.api.get<MonthlyGoalStatusDto>('/levels/monthly-goal');

            if (!response.data) {
                throw new Error('Не вдалося отримати дані про місячну ціль');
            }

            return response.data;
        } catch (e) {
            console.log(e);
            return rejectWithValue('Помилка при отриманні місячної цілі');
        }
    },
);

interface SetMonthlyGoalProps {
    distanceGoal: number;
    ridesGoal: number;
    durationGoal: number;
}

export const setMonthlyGoal = createAsyncThunk<
    any,
    SetMonthlyGoalProps,
    ThunkConfig<string>
>(
    'userLevel/setMonthlyGoal',
    async (goalData, thunkApi) => {
        const { extra, rejectWithValue } = thunkApi;

        try {
            const response = await extra.api.post('/levels/monthly-goal', goalData);

            if (!response.data) {
                throw new Error('Не вдалося встановити місячну ціль');
            }

            return response.data;
        } catch (e) {
            console.log(e);
            return rejectWithValue('Помилка при встановленні місячної цілі');
        }
    },
);


export const checkMonthlyGoal = createAsyncThunk<
    any,
    void,
    ThunkConfig<string>
>(
    'userLevel/checkMonthlyGoal',
    async (_, thunkApi) => {
        const { extra, rejectWithValue } = thunkApi;

        try {
            const response = await extra.api.get('/levels/monthly-goals/check');

            if (!response.data) {
                throw new Error('Не вдалося перевірити місячну ціль');
            }

            return response.data;
        } catch (e) {
            console.log(e);
            return rejectWithValue('Помилка при перевірці місячної цілі');
        }
    },
);
