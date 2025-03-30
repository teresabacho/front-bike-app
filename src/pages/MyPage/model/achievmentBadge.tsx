import React, { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from '../AchievementBadge.module.scss';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';
import { AppImage } from '@/shared/ui/redesigned/AppImage';
import { Skeleton } from '@/shared/ui/redesigned/Skeleton';
import { Text } from '@/shared/ui/redesigned/Text';
import { Card } from '@/shared/ui/redesigned/Card';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useSelector } from 'react-redux';
import { StateSchema } from '@/app/providers/StoreProvider';
import { Button } from '@/shared/ui/redesigned/Button';
import { checkAchievements } from '@/pages/MyPage/model/services/achievments.service';

interface AchievementBadgeProps {
    className?: string;
}

export const AchievementBadge = memo((props: AchievementBadgeProps) => {
    const { className } = props;
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const achievements = useSelector((state: StateSchema) => state?.achievementsPage?.achievements || []);
    const newAchievements = achievements.filter(a => !a.is_seen);

    useEffect(() => {
        dispatch(checkAchievements());
    }, [dispatch]);

    if (!newAchievements.length) {
        return null;
    }

    return (
        <Card
            padding="16"
            className={classNames(cls.achievementBadge, {}, [className])}
            onClick={() => navigate('/profile/me')}
        >
            <VStack gap="8">
                <HStack gap="8">
                    <Text title={`Нові досягнення (${newAchievements.length})`} size="s" />
                </HStack>

                {newAchievements.slice(0, 2).map((achievement) => (
                    <HStack key={achievement.id} gap="8" className={cls.achievement}>
                        <AppImage
                            fallback={<Skeleton width={30} height={30} border="50%" />}
                            src={`${achievement.icon}`}
                            width={30}
                            height={30}
                            className={cls.achievementIcon}
                            alt={achievement.title}
                        />
                        <Text text={achievement.title} size="s" />
                    </HStack>
                ))}

                {newAchievements.length > 2 && (
                    <Text
                        text={`+ ще ${newAchievements.length - 2} досягнення`}
                        size="s"
                        className={cls.moreAchievements}
                    />
                )}

                <Button
                    variant="outline"
                    size="s"
                    className={cls.viewButton}
                    onClick={() => navigate('/profile/me')}
                >
                    Переглянути всі
                </Button>
            </VStack>
        </Card>
    );
});
