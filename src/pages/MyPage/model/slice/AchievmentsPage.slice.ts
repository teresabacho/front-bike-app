import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AchievementProgressDto, UserAchievementDto } from '@/pages/MyPage/model/services/achievment.dto';
import {
    checkAchievements,
    fetchAchievements,
    fetchAchievementsProgress, markAchievementsSeen,
} from '@/pages/MyPage/model/services/achievments.service';

interface AchievementsPageSchema {
    achievements: UserAchievementDto[];
    achievementsProgress: AchievementProgressDto[];
    isLoading: boolean;
    error?: string;
}

const initialState: AchievementsPageSchema = {
    achievements: [],
    achievementsProgress: [],
    isLoading: false,
};

export const achievementsPageSlice = createSlice({
    name: 'achievementsPage',
    initialState,
    reducers: {
        setAchievements: (state, action: PayloadAction<UserAchievementDto[]>) => {
            state.achievements = action.payload;
        },
        setAchievementsProgress: (state, action: PayloadAction<AchievementProgressDto[]>) => {
            state.achievementsProgress = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAchievements.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(fetchAchievements.fulfilled, (state, action) => {
                state.isLoading = false;
                state.achievements = action.payload;
            })
            .addCase(fetchAchievements.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        builder
            .addCase(fetchAchievementsProgress.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(fetchAchievementsProgress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.achievementsProgress = action.payload;
            })
            .addCase(fetchAchievementsProgress.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        builder
            .addCase(checkAchievements.pending, (state) => {
                state.error = undefined;
            })
            .addCase(checkAchievements.fulfilled, (state, action) => {
                if (action.payload.length > 0) {
                    const existingIds = state.achievements.map(a => a.id);
                    const newAchievements = action.payload.filter(a => !existingIds.includes(a.id));

                    state.achievements = [...state.achievements, ...newAchievements];
                }
            })
            .addCase(checkAchievements.rejected, (state, action) => {
                state.error = action.payload;
            });

        builder
            .addCase(markAchievementsSeen.fulfilled, (state) => {
                state.achievements = state.achievements.map(achievement => ({
                    ...achievement,
                    is_seen: true,
                }));
            });
    },
});

export const { actions: achievementsPageActions } = achievementsPageSlice;
export const { reducer: achievementsPageReducer } = achievementsPageSlice;
