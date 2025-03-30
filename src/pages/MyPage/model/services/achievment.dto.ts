export interface AchievementDto {
    id: string;
    title: string;
    description: string;
    type: string;
    threshold: number;
    icon: string;
}

export interface UserAchievementDto {
    id: string;
    title: string;
    description: string;
    type: string;
    threshold: number;
    icon: string;
    unlocked_at: Date;
    is_seen: boolean;
}

export interface UserStatsDto {
    rideCount: number;
    totalDistance: number;
    totalDuration: number;
}

export interface AchievementProgressDto {
    achievement: AchievementDto;
    progress: number;
    current: number;
    isCompleted: boolean;
}
export interface UserLevelDto {
    id: string;
    user_id: string;
    xp: number;
    level: number;
    xp_to_next_level: number;
    last_updated: Date;
    title: string;
    progress: number;
    max_level: boolean;
}

export interface MonthlyGoalDto {
    id: string;
    user_id: string;
    year: number;
    month: number;
    distance_goal: number;
    rides_goal: number;
    duration_goal: number;
    completed: boolean;
    created_at: Date;
}

export interface MonthlyStatsDto {
    id?: string;
    user_id?: string;
    year?: number;
    month?: number;
    distance: number;
    rides_count: number;
    duration: number;
    updated_at?: Date;
}

export interface MonthlyGoalProgressDto {
    distance: number | null;
    rides: number | null;
    duration: number | null;
}

export interface MonthlyGoalStatusDto {
    exists: boolean;
    goal?: MonthlyGoalDto;
    currentStats?: MonthlyStatsDto;
    progress?: MonthlyGoalProgressDto;
    completed?: boolean;
    message?: string;
}

export interface MonthlyGoalHistoryDto {
    goal: MonthlyGoalDto;
    stats: MonthlyStatsDto;
    progress: MonthlyGoalProgressDto;
}

export interface XpBreakdownDto {
    ride: number;
    distance: number;
    duration: number;
}

export interface XpEarnedDto {
    xpEarned: number;
    xpBreakdown: XpBreakdownDto;
    updatedLevel: UserLevelDto;
}
