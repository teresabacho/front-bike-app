import { memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './MonthlyGoalForm.module.scss';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';
import { Text } from '@/shared/ui/redesigned/Text';
import { Card } from '@/shared/ui/redesigned/Card';
import { StateSchema } from '@/app/providers/StoreProvider';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { Input } from '@/shared/ui/redesigned/Input';
import { Button } from '@/shared/ui/redesigned/Button';
import { checkMonthlyGoal, fetchMonthlyGoal, setMonthlyGoal } from '@/pages/MyPage/model/services/achievments.service';
import { Progress } from '@/pages/MyPage/ui/Progress';

interface MonthlyGoalFormProps {
    className?: string;
}

export const MonthlyGoalForm = memo((props: MonthlyGoalFormProps) => {
    const { className } = props;
    const dispatch = useAppDispatch();

    const isLoading = useSelector((state: StateSchema) => state.userLevel?.isLoadingGoal);
    const error = useSelector((state: StateSchema) => state.userLevel?.errorGoal);
    const monthlyGoal = useSelector((state: StateSchema) => state.userLevel?.monthlyGoal);

    const [distanceGoal, setDistanceGoal] = useState<number | string>('');
    const [ridesGoal, setRidesGoal] = useState<number | string>('');
    const [durationGoal, setDurationGoal] = useState<number | string>('');

    const getMonthName = () => {
        const monthNames = [
            'січень', 'лютий', 'березень', 'квітень', 'травень', 'червень',
            'липень', 'серпень', 'вересень', 'жовтень', 'листопад', 'грудень'
        ];

        const now = new Date();
        return monthNames[now.getMonth()];
    };

    useEffect(() => {
        dispatch(fetchMonthlyGoal());
    }, [dispatch]);

    useEffect(() => {
        if (monthlyGoal?.exists && monthlyGoal.goal) {
            setDistanceGoal(monthlyGoal.goal.distance_goal ? monthlyGoal.goal.distance_goal / 1000 : '');
            setRidesGoal(monthlyGoal.goal.rides_goal || '');

            setDurationGoal(monthlyGoal.goal.duration_goal ? monthlyGoal.goal.duration_goal / 60 : '');
        }
    }, [monthlyGoal]);

    const handleSubmit = () => {
        const distance = distanceGoal ? Number(distanceGoal) * 1000 : 0;
        const rides = ridesGoal ? Number(ridesGoal) : 0;
        const duration = durationGoal ? Number(durationGoal) * 60 : 0;

        dispatch(setMonthlyGoal({
            distanceGoal: distance,
            ridesGoal: rides,
            durationGoal: duration,
        }));
    };

    const handleCheckGoal = () => {
        dispatch(checkMonthlyGoal());
    };

    const renderGoalForm = () => {
        return (
            <VStack gap="16" max>
                <Text title={`Ціль на ${getMonthName()}`} />

                <VStack gap="8" max>
                    <Input
                        label="Відстань (км)"
                        value={distanceGoal}
                        onChange={(value) => setDistanceGoal(value)}
                        type="number"
                        min={0}
                    />

                    <Input
                        label="Кількість поїздок"
                        value={ridesGoal}
                        onChange={(value) => setRidesGoal(value)}
                        type="number"
                        min={0}
                    />

                    <Input
                        label="Тривалість (години)"
                        value={durationGoal}
                        onChange={(value) => setDurationGoal(value)}
                        type="number"
                        min={0}
                        step={0.5}
                    />
                </VStack>

                <Button onClick={handleSubmit} disabled={isLoading}>
                    {monthlyGoal?.exists ? 'Оновити ціль' : 'Встановити ціль'}
                </Button>
            </VStack>
        );
    };

    const renderGoalProgress = () => {
        if (!monthlyGoal?.exists || !monthlyGoal.goal) {
            return (
                <Text text="Ви ще не встановили ціль на цей місяць" />
            );
        }

        const { goal, currentStats, progress, completed } = monthlyGoal;

        return (
            <VStack gap="16" max>
                <HStack justify="between" max>
                    <Text title={`Ціль на ${getMonthName()}`} />
                    {completed && (
                        <div className={cls.completedBadge}>Виконано!</div>
                    )}
                </HStack>

                {/* Відстань */}
                {goal.distance_goal > 0 && (
                    <VStack gap="4" max>
                        <Text text={`Відстань: ${(currentStats?.distance || 0) / 1000} / ${goal.distance_goal / 1000} км`} size="s" />
                        <Progress value={progress?.distance || 0} />
                    </VStack>
                )}

                {/* Кількість поїздок */}
                {goal.rides_goal > 0 && (
                    <VStack gap="4" max>
                        <Text text={`Поїздки: ${currentStats?.rides_count || 0} / ${goal.rides_goal}`} size="s" />
                        <Progress value={progress?.rides || 0} />
                    </VStack>
                )}

                {/* Тривалість */}
                {goal.duration_goal > 0 && (
                    <VStack gap="4" max>
                        <Text text={`Тривалість: ${Math.floor((currentStats?.duration || 0) / 60)}г ${(currentStats?.duration || 0) % 60}хв / ${Math.floor(goal.duration_goal / 60)}г ${goal.duration_goal % 60}хв`} size="s" />
                        <Progress value={progress?.duration || 0} />
                    </VStack>
                )}

                <HStack gap="8">
                    <Button onClick={() => dispatch(fetchMonthlyGoal())}>
                        Оновити статистику
                    </Button>
                    <Button onClick={handleCheckGoal} variant="outline">
                        Перевірити ціль
                    </Button>
                </HStack>

                {/* Кнопка для редагування цілі */}
                <Button onClick={() => {}} variant="outline">
                    Редагувати ціль
                </Button>
            </VStack>
        );
    };

    return (
        <Card padding="24" className={classNames(cls.monthlyGoalForm, {}, [className])}>
            {isLoading ? (
                <VStack gap="8" max>
                    <Text title="Завантаження..." />
                </VStack>
            ) : error ? (
                <VStack gap="8" max>
                    <Text variant="error" title="Помилка" text={error} />
                    <Button onClick={() => dispatch(fetchMonthlyGoal())}>
                        Спробувати знову
                    </Button>
                </VStack>
            ) : !monthlyGoal?.exists || monthlyGoal?.goal?.completed === false ? (
                renderGoalForm()
            ) : (
                renderGoalProgress()
            )}
        </Card>
    );
});
