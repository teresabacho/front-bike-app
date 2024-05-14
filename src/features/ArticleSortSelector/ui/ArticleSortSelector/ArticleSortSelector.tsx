import { useTranslation } from 'react-i18next';
import { memo, useMemo } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import { SelectOption } from '@/shared/ui/deprecated/Select';
import { SortOrder } from '@/shared/types/sort';
import cls from './ArticleSortSelector.module.scss';
import { ArticleSortField } from '@/entities/Article';
import { ListBox } from '@/shared/ui/redesigned/Popups';
import { VStack } from '@/shared/ui/redesigned/Stack';
import { Text } from '@/shared/ui/redesigned/Text';

interface ArticleSortSelectorProps {
    className?: string;
    sort: ArticleSortField;
    order: SortOrder;
    onChangeOrder: (newOrder: SortOrder) => void;
    onChangeSort: (newSort: ArticleSortField) => void;
}

export const ArticleSortSelector = memo((props: ArticleSortSelectorProps) => {
    const { className, onChangeOrder, onChangeSort, order, sort } = props;
    const { t } = useTranslation();

    const orderOptions = useMemo<SelectOption<SortOrder>[]>(
        () => [
            {
                value: 'asc',
                content: t('по збільшенню'),
            },
            {
                value: 'desc',
                content: t('по зменшунню'),
            },
        ],
        [t],
    );

    const sortFieldOptions = useMemo<SelectOption<ArticleSortField>[]>(
        () => [
            {
                value: ArticleSortField.CREATED,
                content: t('дата створення'),
            },
            {
                value: ArticleSortField.TITLE,
                content: t('по назві'),
            },
            {
                value: ArticleSortField.VIEWS,
                content: t('по переглядам'),
            },
        ],
        [t],
    );

    return (
        <div
                            className={classNames(
                                cls.ArticleSortSelectorRedesigned,
                                {},
                                [className],
                            )}
                        >
                            <VStack gap="8">
                                <Text text={t('Сортировать по:')} />
                                <ListBox
                                    items={sortFieldOptions}
                                    value={sort}
                                    onChange={onChangeSort}
                                />
                                <ListBox
                                    items={orderOptions}
                                    value={order}
                                    onChange={onChangeOrder}
                                />
                            </VStack>
                        </div>
    );
});
