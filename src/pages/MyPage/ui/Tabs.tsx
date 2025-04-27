import { memo, ReactNode, useCallback } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './Tabs.module.scss';
import { Card } from '@/shared/ui/redesigned/Card';

export interface Tab {
    value: string;
    content: ReactNode;
}

interface TabsProps {
    className?: string;
    tabs: Tab[];
    value: string;
    onTabClick: (tab: Tab) => void;
}

export const Tabs = memo((props: TabsProps) => {
    const { className, tabs, value, onTabClick } = props;

    const clickHandle = useCallback(
        (tab: Tab) => () => {
            onTabClick(tab);
        },
        [onTabClick],
    );

    return (
        <div className={classNames(cls.tabs, {}, [className])}>
            {tabs.map((tab) => {
                const isSelected = tab.value === value;
                return (
                    <Card
                        variant={isSelected ? 'light' : 'normal'}
                        className={classNames(cls.tab, {
                            [cls.selected]: isSelected,
                        })}
                        key={tab.value}
                        onClick={clickHandle(tab)}
                        border="round"
                    >
                        {tab.content}
                    </Card>
                );
            })}
        </div>
    );
});
