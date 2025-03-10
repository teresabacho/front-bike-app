import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    checkMonthlyGoal,
    fetchMonthlyGoal,
    fetchUserLevel,
    setMonthlyGoal,
} from '@/pages/MyPage/model/services/achievments.service';
import { MonthlyGoalStatusDto, UserLevelDto } from '@/pages/MyPage/model/services/achievment.dto';

interface UserLevelSchema {
    level?: UserLevelDto;
    monthlyGoal?: MonthlyGoalStatusDto;
    isLoading: boolean;
    isLoadingGoal: boolean;
    error?: string;
    errorGoal?: string;
}

const initialState: UserLevelSchema = {
    isLoading: false,
    isLoadingGoal: false,
};

export const userLevelSlice = createSlice({
    name: 'userLevel',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserLevel.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(fetchUserLevel.fulfilled, (state, action: PayloadAction<UserLevelDto>) => {
                state.isLoading = false;
                state.level = action.payload;
            })
            .addCase(fetchUserLevel.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

        builder
            .addCase(fetchMonthlyGoal.pending, (state) => {
                state.errorGoal = undefined;
                state.isLoadingGoal = true;
            })
            .addCase(fetchMonthlyGoal.fulfilled, (state, action: PayloadAction<MonthlyGoalStatusDto>) => {
                state.isLoadingGoal = false;
                state.monthlyGoal = action.payload;
            })
            .addCase(fetchMonthlyGoal.rejected, (state, action) => {
                state.isLoadingGoal = false;
                state.errorGoal = action.payload;
            })

        builder
            .addCase(setMonthlyGoal.pending, (state) => {
                state.errorGoal = undefined;
                state.isLoadingGoal = true;
            })
            .addCase(setMonthlyGoal.fulfilled, (state, action) => {
                state.isLoadingGoal = false;
                state.monthlyGoal = {
                    exists: true,
                    goal: action.payload.goal,
                    currentStats: state.monthlyGoal?.currentStats || {
                        distance: 0,
                        rides_count: 0,
                        duration: 0,
                    },
                    progress: action.payload.status?.progress || {
                        distance: 0,
                        rides: 0,
                        duration: 0,
                    },
                    completed: action.payload.status?.completed || false,
                };
            })
            .addCase(setMonthlyGoal.rejected, (state, action) => {
                state.isLoadingGoal = false;
                state.errorGoal = action.payload;
            })

        builder
            .addCase(checkMonthlyGoal.fulfilled, (state, action) => {
                if (state.monthlyGoal) {
                    state.monthlyGoal.completed = action.payload.completed || state.monthlyGoal.completed;
                    state.monthlyGoal.progress = action.payload.progress || state.monthlyGoal.progress;
                }
            });
    },
});

export const { actions: userLevelActions } = userLevelSlice;
export const { reducer: userLevelReducer } = userLevelSlice;
