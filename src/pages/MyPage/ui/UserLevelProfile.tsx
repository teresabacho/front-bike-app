import { memo } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './UserLevelProfile.module.scss';
import { VStack } from '@/shared/ui/redesigned/Stack';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { userLevelReducer } from '@/pages/MyPage/model/slice/UserLevel.slice';
import { LevelHeader } from '@/pages/MyPage/ui/LevelHeader';
import { MonthlyGoalForm } from '@/pages/MyPage/ui/MounthlyGoalForm';

interface UserLevelProfileProps {
    className?: string;
}

const reducers: ReducersList = {
    userLevel: userLevelReducer,
};

export const UserLevelProfile = memo((props: UserLevelProfileProps) => {
    const { className } = props;

    return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount>
            <VStack gap="16" max className={classNames(cls.userLevelProfile, {}, [className])}>
                <LevelHeader />
                <MonthlyGoalForm />
            </VStack>
        </DynamicModuleLoader>
    );
});
