import { useTranslation } from 'react-i18next';
import { memo, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    DynamicModuleLoader,
    ReducersList,
} from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { classNames } from '@/shared/lib/classNames/classNames';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import {
    Text as TextDeprecated,
    TextAlign,
    TextSize,
} from '@/shared/ui/deprecated/Text';
import { Text } from '@/shared/ui/redesigned/Text';
import { Skeleton as SkeletonRedesigned } from '@/shared/ui/redesigned/Skeleton';
import { Avatar } from '@/shared/ui/deprecated/Avatar';
import CalendarIcon from '@/shared/assets/icons/calendar-20-20.svg';
import { Icon } from '@/shared/ui/deprecated/Icon';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';
import { fetchArticleById } from '../../model/services/fetchArticleById/fetchArticleById';
import { articleDetailsReducer } from '../../model/slice/articleDetailsSlice';
import cls from './ArticleDetails.module.scss';
import {
    getArticleDetailsData,
    getArticleDetailsError,
    getArticleDetailsIsLoading,
} from '../../model/selectors/articleDetails';
import { renderArticleBlock } from './renderBlock';
import { AppImage } from '@/shared/ui/redesigned/AppImage';
import { $api } from '@/shared/api/api';
import { getRouteArticles } from '@/shared/const/router';
import { ReportButton } from '@/shared/lib/components/ReportModal/ReportButton';
import { Button } from '@/shared/ui/redesigned/Button';
import { getUserAuthData } from '@/entities/User';

interface ArticleDetailsProps {
    className?: string;
    id?: string;
}

const reducers: ReducersList = {
    articleDetails: articleDetailsReducer,
};
export const usePermissions = () => {
    const userData = useSelector(getUserAuthData);
    const role = localStorage.getItem('role')

    const isAdmin =role=== 'admin';
    const isTrainer = role === 'trainer';
    const isUser = role === 'user';

    const canManageReports = isAdmin;
    const canBanUsers = isAdmin;
    const canDeleteAnyContent = isAdmin;

    const canDeleteComment = (commentUserId: string) => {
        return userData?.id === commentUserId || isAdmin;
    };

    const canDeleteArticle = (articleUserId: string) => {
        return userData?.id === articleUserId || isAdmin;
    };

    const canReportContent = (contentUserId: string) => {
        return userData && userData.id !== contentUserId;
    };

    return {
        isAdmin,
        isTrainer,
        isUser,
        canManageReports,
        canBanUsers,
        canDeleteAnyContent,
        canDeleteComment,
        canDeleteArticle,
        canReportContent,
        userData,
    };
};
const Deprecated = () => {
    const article = useSelector(getArticleDetailsData);
    return (
        <>
            <HStack justify="center" max className={cls.avatarWrapper}>
                <Avatar size={200} src={article?.img} className={cls.avatar} />
            </HStack>
            <VStack gap="4" max data-testid="ArticleDetails.Info">
                <TextDeprecated
                    className={cls.title}
                    title={article?.title}
                    text={article?.subtitle}
                    size={TextSize.L}
                />
                <HStack gap="8" className={cls.articleInfo}>
                    <Icon className={cls.icon} Svg={CalendarIcon} />
                    <TextDeprecated text={article?.createdAt} />
                </HStack>
            </VStack>
            {article?.blocks.map(renderArticleBlock)}
        </>
    );
};

const Redesigned = () => {
    const article = useSelector(getArticleDetailsData);
    const navigate = useNavigate();
    const { canDeleteArticle } = usePermissions();

    const handleDeleteArticle = useCallback(async () => {
        if (!article?.id) return;

        if (!confirm('Ви впевнені, що хочете видалити цю статтю?')) {
            return;
        }

        try {
            await $api.delete(`/articles/${article.id}`);
            navigate(getRouteArticles());
        } catch (error) {
            console.error('Помилка при видаленні статті:', error);
        }
    }, [article?.id, navigate]);
    return (
        <>
            <Text title={article?.title} size="l" bold />
            <Text title={article?.subtitle} />
            <HStack justify="between" align="start" max>
                <VStack gap="8" max>
                    <Text title={article?.title} size="l" bold />
                    <Text title={article?.subtitle} />
                </VStack>

                {article && (
                    <HStack gap="8">
                        <ReportButton
                            targetType="article"
                            targetId={article.id}
                            contentUserId={article.user?.id}
                            contentPreview={article.title}
                            variant="outline"
                        />

                        {canDeleteArticle(article.user?.id) && (
                            <Button
                                variant="outline"
                                color="error"
                                onClick={handleDeleteArticle}
                            >
                                Видалити
                            </Button>
                        )}
                    </HStack>
                )}
            </HStack>
            <AppImage
                fallback={
                    <SkeletonRedesigned
                        width="100%"
                        height={420}
                        border="16px"
                    />
                }
                src={article?.img}
                className={cls.img}
            />
            {article?.blocks.map(renderArticleBlock)}
        </>
    );
};
export const ArticleDetailsSkeleton = () => {
    const Skeleton = SkeletonRedesigned;
    return (
        <VStack gap="16" max>
            <Skeleton
                className={cls.avatar}
                width={200}
                height={200}
                border="50%"
            />
            <Skeleton className={cls.title} width={300} height={32} />
            <Skeleton className={cls.skeleton} width={600} height={24} />
            <Skeleton className={cls.skeleton} width="100%" height={200} />
            <Skeleton className={cls.skeleton} width="100%" height={200} />
        </VStack>
    );
};

export const ArticleDetails = memo((props: ArticleDetailsProps) => {
    const { className, id } = props;
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const isLoading = useSelector(getArticleDetailsIsLoading);
    const error = useSelector(getArticleDetailsError);

    useEffect(() => {
        if (__PROJECT__ !== 'storybook') {
            dispatch(fetchArticleById(id));
        }
    }, [dispatch, id]);

    let content;

    if (isLoading) {
        content = <ArticleDetailsSkeleton />;
    } else if (error) {
        content = (
            <TextDeprecated
                align={TextAlign.CENTER}
                title={t('Сталась помилка при загрузці статті.')}
            />
        );
    } else {
        content = (
            <Redesigned />
        );
    }

    return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount>
            <VStack
                gap="16"
                max
                className={classNames(cls.ArticleDetails, {}, [className])}
            >
                {content}
            </VStack>
        </DynamicModuleLoader>
    );
});
