import { useTranslation } from 'react-i18next';
import { memo, useCallback, useMemo } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import { TabItem, Tabs } from '@/shared/ui/redesigned/Tabs';
import { ArticleType } from '@/entities/Article';

interface ArticleTypeTabsProps {
    className?: string;
    value: ArticleType;
    onChangeType: (type: ArticleType) => void;
}

export const ArticleTypeTabs = memo((props: ArticleTypeTabsProps) => {
    const { className, value, onChangeType } = props;
    const { t } = useTranslation();

    const typeTabs = useMemo<TabItem[]>(
        () => [
            {
                value: ArticleType.ARTICLES,
                content: t('Пости'),
            },
            {
                value: ArticleType.USER,
                content: t('Користувачі'),
            },
            {
                value: ArticleType.RIDES,
                content: t('Поїздки'),
            },
        ],
        [t],
    );

    const onTabClick = useCallback(
        (tab: TabItem) => {
            onChangeType(tab.value as ArticleType);
        },
        [onChangeType],
    );

    return (
        <Tabs
                            direction="column"
                            tabs={typeTabs}
                            value={value}
                            onTabClick={onTabClick}
                            className={classNames('', {}, [className])}
                        />
    );
});
