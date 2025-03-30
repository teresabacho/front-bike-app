import { memo, useEffect, useState } from 'react';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './AchievementsPage.module.scss';
import { AppImage } from '@/shared/ui/redesigned/AppImage';
import { Skeleton } from '@/shared/ui/redesigned/Skeleton';
import { Text } from '@/shared/ui/redesigned/Text';
import { Card } from '@/shared/ui/redesigned/Card';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useSelector } from 'react-redux';
import { StateSchema } from '@/app/providers/StoreProvider';
import {
    fetchAchievements,
    fetchAchievementsProgress,
    markAchievementsSeen,
} from '@/pages/MyPage/model/services/achievments.service';
import { Tab, Tabs } from '@/pages/MyPage/ui/Tabs';
import { achievementsPageReducer } from '@/pages/MyPage/model/slice/AchievmentsPage.slice';
import { Progress } from '@/pages/MyPage/ui/Progress';

const initialReducers: ReducersList = {
    achievementsPage: achievementsPageReducer,
};

export const AchievementsPage = memo(() => {
    const dispatch = useAppDispatch();
    const achievements = useSelector((state: StateSchema) => state?.achievementsPage?.achievements || []);
    const achievementsProgress = useSelector((state: StateSchema) => state?.achievementsPage?.achievementsProgress || []);
    const isLoading = useSelector((state: StateSchema) => state?.achievementsPage?.isLoading);
    const error = useSelector((state: StateSchema) => state?.achievementsPage?.error);

    const [activeTab, setActiveTab] = useState<string>('all');

    useEffect(() => {
        dispatch(fetchAchievements());
        dispatch(fetchAchievementsProgress());

        return () => {
            dispatch(markAchievementsSeen());
        };
    }, [dispatch]);

    const onTabClick = (tab: Tab) => {
        setActiveTab(tab.value);
    };

    const tabs: Tab[] = [
        {
            value: 'all',
            content: 'Всі',
        },
        {
            value: 'completed',
            content: 'Отримані',
        },
        {
            value: 'inProgress',
            content: 'В процесі',
        },
    ];

    const renderProgressAchievements = () => {
        if (isLoading) {
            return Array.from({ length: 3 }).map((_, index) => (
                <Card
                    key={index}
                    padding="16"
                    className={cls.achievementCard}
                >
                    <HStack gap="16">
                        <Skeleton width={60} height={60} border="50%" />
                        <VStack gap="8" max>
                            <Skeleton width={150} height={24} />
                            <Skeleton width={200} height={16} />
                            <Skeleton width="100%" height={8} />
                        </VStack>
                    </HStack>
                </Card>
            ));
        }

        if (error) {
            return (
                <Text
                    variant="error"
                    title="Помилка при завантаженні досягнень"
                    text="Спробуйте оновити сторінку"
                />
            );
        }

        if (!achievementsProgress.length) {
            return (
                <Text
                    title="Інформація про досягнення поки недоступна"
                    text="Спробуйте оновити сторінку"
                />
            );
        }

        let filteredAchievements = [...achievementsProgress];

        if (activeTab === 'completed') {
            filteredAchievements = achievementsProgress.filter(item => item.isCompleted);
        } else if (activeTab === 'inProgress') {
            filteredAchievements = achievementsProgress.filter(item => !item.isCompleted);
        }

        if (filteredAchievements.length === 0) {
            return (
                <Text
                    title={activeTab === 'completed' ? "У вас ще немає отриманих досягнень" : "У вас немає досягнень в процесі"}
                    text="Зробіть свою першу поїздку щоб отримати досягнення!"
                />
            );
        }

        return filteredAchievements.map((item) => {
            const { achievement, progress, current, isCompleted } = item;

            let currentFormatted = current;
            let thresholdFormatted = achievement.threshold;

            if (achievement.type === 'DISTANCE') {
                currentFormatted = Math.floor(current / 1000);
                thresholdFormatted = achievement.threshold / 1000;
            } else if (achievement.type === 'DURATION') {
                const hours = Math.floor(current/60 / 60);
                const minutes = current/60 % 60;
                currentFormatted = `${hours.toFixed()}г ${minutes.toFixed()}хв`;

                const thresholdHours = Math.floor(achievement.threshold/60 / 60);
                const thresholdMinutes = achievement.threshold/60 % 60;
                thresholdFormatted = `${thresholdHours.toFixed()}г ${thresholdMinutes.toFixed()}хв`;
            }
            console.log('achievement', achievement.icon);
            return (
                <Card
                    key={achievement.id}
                    padding="16"
                    className={classNames(cls.achievementCard, { [cls.completed]: isCompleted })}
                >
                    <HStack gap="16" max>
                        <AppImage
                            fallback={<Skeleton width={60} height={60} border="50%" />}
                            src={`${achievement.icon.toString().startsWith('http')? achievement.icon : 'https://w7.pngwing.com/pngs/240/803/png-transparent-computer-icons-encapsulated-postscript-decoration-is-in-progress-angle-text-trademark.png'}`}
                            width={60}
                            height={60}
                            className={cls.achievementIcon}
                            alt={achievement.title}
                        />
                        <VStack gap="8" max>
                            <HStack justify="between" max>
                                <Text title={achievement.title} bold />
                                {isCompleted && (
                                    <div className={cls.completedBadge}>✓</div>
                                )}
                            </HStack>
                            <Text text={achievement.description} size="s" />

                            <VStack gap="4" max>
                                <Progress
                                    value={progress}
                                    className={cls.progressBar}
                                />
                                <HStack justify="between" max>
                                    <Text
                                        text={
                                            achievement.type === 'RIDE_COUNT'
                                                ? `${currentFormatted} / ${thresholdFormatted} поїздок`
                                                : achievement.type === 'DISTANCE'
                                                    ? `${currentFormatted} / ${thresholdFormatted} км`
                                                    : `${currentFormatted} / ${thresholdFormatted}`
                                        }
                                        size="s"
                                        className={cls.progressText}
                                    />
                                    <Text
                                        text={`${progress}%`}
                                        size="s"
                                        className={cls.percentText}
                                        bold={isCompleted}
                                    />
                                </HStack>
                            </VStack>

                            {isCompleted && (
                                <Text
                                    text={`Отримано: ${new Date(achievements.find(a => a.id === achievement.id)?.unlocked_at || new Date()).toLocaleDateString()}`}
                                    size="s"
                                    className={cls.date}
                                />
                            )}
                        </VStack>
                    </HStack>
                </Card>
            );
        });
    };

    return (
        <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
            <VStack gap="16" max className={cls.achievementsPage}>
                <Text title="Мої досягнення" size="l" bold />

                <Tabs
                    tabs={tabs}
                    value={activeTab}
                    onTabClick={onTabClick}
                    className={cls.tabs}
                />

                <VStack gap="16" max className={cls.achievements}>
                    {renderProgressAchievements()}
                </VStack>
            </VStack>
        </DynamicModuleLoader>
    );
});
