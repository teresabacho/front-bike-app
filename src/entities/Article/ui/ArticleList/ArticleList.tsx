import { useTranslation } from 'react-i18next';
import { HTMLAttributeAnchorTarget, memo } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Text, TextSize } from '@/shared/ui/deprecated/Text';
import { ArticleView } from '../../model/consts/articleConsts';
import { ArticleListItemSkeleton } from '../ArticleListItem/ArticleListItemSkeleton';
import { ArticleListItem } from '../ArticleListItem/ArticleListItem';
import cls from './ArticleList.module.scss';
import { Article } from '../../model/types/article';
import { HStack } from '@/shared/ui/redesigned/Stack';
import { UserListItem } from '@/pages/UserPage';
import { RideCard } from '@/pages/MyRides';

interface ArticleListProps {
    className?: string;
    articles: Article[];
    isLoading?: boolean;
    target?: HTMLAttributeAnchorTarget;
    view?: ArticleView;
}

const getSkeletons = (view: ArticleView) =>
    new Array(view === ArticleView.SMALL ? 9 : 3)
        .fill(0)
        .map((item, index) => (
            <ArticleListItemSkeleton
                className={cls.card}
                key={index}
                view={view}
            />
        ));

export const ArticleList = memo((props: ArticleListProps) => {
    const {
        className,
        articles,
        view = ArticleView.SMALL,
        isLoading,
        target,
    } = props;
    const { t } = useTranslation();

    if (!isLoading && !articles.length) {
        return (
            <div
                className={classNames(cls.ArticleList, {}, [
                    className,
                    cls[view],
                ])}
            >
                <Text size={TextSize.L} title={t('Статі не знайдені')} />
            </div>
        );
    }

    return (
        <HStack
                            wrap="wrap"
                            gap="16"
                            className={classNames(cls.ArticleListRedesigned, {}, [])}
                            data-testid="ArticleList"
                        >
                            {articles.map((item) =>
                                {
                                    console.log(item);
                                    if (item.username){
                                        return <UserListItem user={item}  view={view}
                                                             target={target}
                                                             key={item.id}
                                                             className={cls.card}/>
                                    }
                                    if(item.road_id){
                                        return <RideCard ride={item}  view={view}
                                                             target={target}
                                                             key={item.id}
                                                             className={cls.card}/>
                                    }
                                    return(
                                        <ArticleListItem
                                            article={item}
                                            view={view}
                                            target={target}
                                            key={item.id}
                                            className={cls.card}
                                        />
                                    )
                                }

                            )}
                            {isLoading && getSkeletons(view)}
                        </HStack>
    );
});
