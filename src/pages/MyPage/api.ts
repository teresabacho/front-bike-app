import { AxiosInstance } from 'axios';
import { AchievementProgressDto, UserAchievementDto } from '@/pages/MyPage/model/services/achievment.dto';

export interface AchievementApi {
    getUserAchievements: () => Promise<UserAchievementDto[]>;
    getAchievementsProgress: () => Promise<AchievementProgressDto[]>;
    checkAchievements: () => Promise<UserAchievementDto[]>;
    markAchievementsAsSeen: () => Promise<{ success: boolean }>;
}

export const AchievementApi = (instance: AxiosInstance): AchievementApi => {
    return {
        getUserAchievements: async () => {
            const { data } = await instance.get<UserAchievementDto[]>('/achievements');
            return data;
        },

        getAchievementsProgress: async () => {
            const { data } = await instance.get<AchievementProgressDto[]>('/achievements/progress');
            return data;
        },

        checkAchievements: async () => {
            const { data } = await instance.get<UserAchievementDto[]>('/achievements/check');
            return data;
        },

        markAchievementsAsSeen: async () => {
            const { data } = await instance.post<{ success: boolean }>('/achievements/seen');
            return data;
        },
    };
};
