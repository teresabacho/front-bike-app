import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './ArticleAdditionalInfo.module.scss';
import { User } from '@/entities/User';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';
import { Avatar } from '@/shared/ui/redesigned/Avatar';
import { Text } from '@/shared/ui/redesigned/Text';
import { Button } from '@/shared/ui/redesigned/Button';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { deleteArticle } from '@/pages/ArticleDetailsPage';

interface ArticleAdditionalInfoProps {
    className?: string;
    author: User;
    createdAt: string;
    views: number;
    onEdit: () => void;
    canBeDeleted: boolean;
    id: string
}

export const ArticleAdditionalInfo = memo(
    (props: ArticleAdditionalInfoProps) => {
        const { className, author, createdAt, views, onEdit, canBeDeleted,id } = props;
        const { t } = useTranslation();
const dispatch = useAppDispatch()
        return (
            <VStack
                gap="32"
                className={classNames(cls.ArticleAdditionalInfo, {}, [
                    className,
                ])}
            >
                <HStack gap="8">
                    <Avatar src={author?.avatar} size={32} />
                    <Text text={author?.username} bold />
                    <Text text={createdAt} />
                </HStack>
            </VStack>
        );
    },
);
