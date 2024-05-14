import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './UserDetailsPage.module.scss';
import { Text } from '@/shared/ui/redesigned/Text';
import { Card } from '@/shared/ui/redesigned/Card';
import { AppImage } from '@/shared/ui/redesigned/AppImage';
import { Skeleton } from '@/shared/ui/redesigned/Skeleton';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';
import { UserListItem as UserListItemProps } from '../../model/types/usersList';
import { getRouteUserDetails } from '@/shared/const/router';
import { Button } from '@/shared/ui/redesigned/Button';
import { AppLink } from '@/shared/ui/redesigned/AppLink';
import { ArticleView  } from '@/entities/Article';

export const UserListItem = memo((props: {user:UserListItemProps, view: ArticleView, className?: string; buttonTitle:string, to:string}) => {
    const { user, view, className, buttonTitle, to } = props;
    const { t } = useTranslation();

    console.log(view);


    if (view === ArticleView.SMALL) {
        return (
            <AppLink
                to={getRouteUserDetails(user.id || '')}
                className={classNames(cls.ArticleListItem, {}, [
                    className,
                    cls[view],
                ])}
            >
                <Card className={cls.card} border="partial" padding="0">
                    <AppImage
                        fallback={<Skeleton width="100%" height={200} />}
                        src={user.avatar || "https://www.hundeo.com/wp-content/uploads/2019/05/Shiba-Inu-Profilbild.jpg"}
                        className={cls.img}
                    />
                    <VStack className={cls.info} gap="4">
                        <Text title={user.username} className={cls.title} />
                        <VStack gap="4" className={cls.footer} max>
                            <HStack justify="between" max>
                                <Text
                                    text={user?.first}
                                    className={cls.date}
                                />
                            </HStack>
                        </VStack>
                    </VStack>
                </Card>
            </AppLink>
        );
    }

        return (
            <Card
                padding="24"
                max
                className={classNames(cls.ArticleListItem, {}, [
                    cls.card,
                    cls.BIG,
                ])}
            >
                <HStack justify="center" gap="8" max>
                    <AppImage
                        fallback={<Skeleton width="100%" height={250} />}
                        src={user.avatar || "https://www.hundeo.com/wp-content/uploads/2019/05/Shiba-Inu-Profilbild.jpg"}
                        className={cls.img}
                        alt={user.lastname || ''}
                    />
                    <VStack align="center" max gap="16">
                        <HStack justify="center" gap="8" max>
                            <Text text={user.username || ''} />
                        </HStack>
                        <HStack justify="center" gap="8" max>
                            <Text title="age" />
                            <Text title={user.age || ''}  />
                        </HStack>
                        <HStack justify="center" gap="8" max>
                            <Text title="first" />
                            <Text title={user.first || ''}  />
                        </HStack>
                        <HStack justify="center" gap="8" max>
                            <Text title="last" />
                            <Text title={user.lastname || ''}  />
                        </HStack>

                        <HStack justify="center" gap="8" max>
                            <Text title="City" size="s" />
                            <Text title={user.city || ''} size="s" />
                        </HStack>
                    </VStack>
                    <AppLink
                        to={to||getRouteUserDetails(user.id || '')}
                    >
                        <Button variant="outline">
                            {t(buttonTitle || 'Читати далі')}
                        </Button>
                    </AppLink>
                </HStack>

            </Card>
        );
});
