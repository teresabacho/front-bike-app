import { memo, useEffect } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './LevelHeader.module.scss';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';
import { Text } from '@/shared/ui/redesigned/Text';
import { Card } from '@/shared/ui/redesigned/Card';
import { useSelector } from 'react-redux';
import { StateSchema } from '@/app/providers/StoreProvider';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { Skeleton } from '@/shared/ui/redesigned/Skeleton';
import { Progress } from '@/pages/MyPage/ui/Progress';
import { fetchUserLevel, LEVEL_COLORS } from '@/pages/MyPage/model/services/achievments.service';

interface LevelHeaderProps {
    className?: string;
}

export const LevelHeader = memo((props: LevelHeaderProps) => {
    const { className } = props;
    const dispatch = useAppDispatch();

    const isLoading = useSelector((state: StateSchema) => state.userLevel?.isLoading);
    const error = useSelector((state: StateSchema) => state.userLevel?.error);
    const level = useSelector((state: StateSchema) => state.userLevel?.level);

    useEffect(() => {
        dispatch(fetchUserLevel());
    }, [dispatch]);

    if (isLoading) {
        return (
            <Card padding="16" className={classNames(cls.levelHeader, {}, [className])}>
                <VStack gap="8" max>
                    <HStack justify="between" max>
                        <Skeleton width={100} height={20} />
                        <Skeleton width={80} height={20} />
                    </HStack>
                    <Skeleton width="100%" height={8} />
                </VStack>
            </Card>
        );
    }

    if (error) {
        return (
            <Card padding="16" className={classNames(cls.levelHeader, {}, [className])}>
                <Text variant="error" text="Помилка завантаження рівня" />
            </Card>
        );
    }

    if (!level) {
        return null;
    }

    const levelColor = LEVEL_COLORS[level.level] || LEVEL_COLORS.default;

    return (
        <Card
            padding="16"
            className={classNames(cls.levelHeader, {}, [className])}
            border="partial"
            borderColor={levelColor}
        >
            <VStack gap="8" max>
                <HStack justify="between" max>
                    <Text title={level.title} size="s" bold className={cls.levelTitle} />
                    <Text text={`Рівень ${level.level}`} size="s" className={cls.levelValue} />
                </HStack>

                {!level.max_level ? (
                    <>
                        <Progress value={level.progress} className={cls.progress} />
                        <HStack justify="between" max>
                            <Text text={`XP: ${level.xp}`} size="s" className={cls.xpText} />
                            <Text text={`${level.progress}%`} size="s" className={cls.percentText} />
                        </HStack>
                    </>
                ) : (
                    <Text text="Максимальний рівень досягнуто!" size="s" className={cls.maxLevel} />
                )}
            </VStack>
        </Card>
    );
});
