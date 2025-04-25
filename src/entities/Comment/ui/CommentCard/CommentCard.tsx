import { memo, useCallback } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Text } from '@/shared/ui/redesigned/Text';
import { Skeleton as SkeletonRedesigned } from '@/shared/ui/redesigned/Skeleton';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';
import { Button } from '@/shared/ui/redesigned/Button';
import { Icon } from '@/shared/ui/redesigned/Icon';
import cls from './CommentCard.module.scss';
import { Comment } from '../../model/types/comment';
import { getRouteProfile } from '@/shared/const/router';
import { Card } from '@/shared/ui/redesigned/Card';
import { AppLink } from '@/shared/ui/redesigned/AppLink';
import { Avatar } from '@/shared/ui/redesigned/Avatar';
import { useSelector } from 'react-redux';
import { getUserAuthData } from '@/entities/User';
import { $api } from '@/shared/api/api';
import { ReportButton } from '@/shared/lib/components/ReportModal/ReportButton';
import { usePermissions } from '@/entities/Article/ui/ArticleDetails/ArticleDetails';
import {
    fetchCommentsByArticleId
} from '@/pages/ArticleDetailsPage/model/services/fetchCommentsByArticleId/fetchCommentsByArticleId';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useParams } from 'react-router-dom';

interface CommentCardProps {
    className?: string;
    comment?: Comment;
    isLoading?: boolean;
    onDeleteComment?: (commentId: string) => void;
}

export const CommentCard = memo((props: CommentCardProps) => {
    const { className, comment, isLoading, onDeleteComment } = props;
    const userData = useSelector(getUserAuthData);
    const { canDeleteComment } = usePermissions();
 const dispatch = useAppDispatch()
    const Skeleton = SkeletonRedesigned;
  const {id} = useParams()
    const handleDeleteComment = useCallback(async () => {
        if (!comment?.id) return;

        try {
            await $api.delete(`/comments/${comment.id}`);
            dispatch(fetchCommentsByArticleId(id));
        } catch (error) {
            console.error('Помилка при видаленні коментаря:', error);
        }
    }, [comment?.id, onDeleteComment]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('uk-UA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <VStack
                data-testid="CommentCard.Loading"
                gap="8"
                max
                className={classNames(cls.CommentCard, {}, [
                    className,
                    cls.loading,
                ])}
            >
                <div className={cls.header}>
                    <Skeleton width={30} height={30} border="50%" />
                    <Skeleton
                        height={16}
                        width={100}
                        className={cls.username}
                    />
                </div>
                <Skeleton className={cls.text} width="100%" height={50} />
            </VStack>
        );
    }

    if (!comment) {
        return null;
    }
    console.log(canDeleteComment(comment.user.id));
    return (
        <Card padding="24" border="partial" fullWidth>
            <VStack
                data-testid="CommentCard.Content"
                gap="8"
                max
                className={classNames(cls.CommentCardRedesigned, {}, [
                    className,
                ])}
            >
                <HStack justify="between" align="start" max>
                    <AppLink to={getRouteProfile(comment.user.id)}>
                        <HStack gap="8">
                            {comment.user?.avatar ? (
                                <Avatar
                                    size={30}
                                    src={comment.user.avatar}
                                />
                            ) : null}
                            <Text text={comment.user?.username} bold />
                        </HStack>
                    </AppLink>

                    <HStack gap="8">
                        <ReportButton
                            targetType="comment"
                            targetId={comment.id}
                            contentUserId={comment.user.id}
                            contentPreview={comment.text}
                        />

                        {canDeleteComment(comment.user.id) && (
                            <Button
                                variant="clear"
                                onClick={handleDeleteComment}
                                title="Видалити коментар"
                            >
                                Видалити коментар
                            </Button>
                        )}
                    </HStack>
                </HStack>

                <Text text={comment?.text} />

                {comment.createdat && (
                    <Text
                        text={formatDate(comment.createdat)}
                        size="s"
                        variant="accent"
                    />
                )}
            </VStack>
        </Card>
    );
});
