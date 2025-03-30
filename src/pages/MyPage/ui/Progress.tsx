import { memo } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './Progress.module.scss';

interface ProgressProps {
    className?: string;
    value: number;
    max?: number;
    height?: number;
}

export const Progress = memo((props: ProgressProps) => {
    const {
        className,
        value,
        max = 100,
        height = 4,
    } = props;

    const normalizedValue = Math.min(Math.max(0, value), max);
    const percent = (normalizedValue / max) * 100;

    return (
        <div
            className={classNames(cls.progress, {}, [className])}
            style={{ height: `${height}px` }}
        >
            <div
                className={classNames(cls.progressBar, {
                    [cls.low]: percent < 30,
                    [cls.medium]: percent >= 30 && percent < 70,
                    [cls.high]: percent >= 70,
                    [cls.complete]: percent >= 100,
                })}
                style={{ width: `${percent}%` }}
            />
        </div>
    );
});
