import { memo } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './rideDetailsPage.module.scss';
import { Text } from '@/shared/ui/redesigned/Text';
import { Card } from '@/shared/ui/redesigned/Card';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';
import { getRouteRideDetails } from '@/shared/const/router';
import { Button } from '@/shared/ui/redesigned/Button';
import { AppLink } from '@/shared/ui/redesigned/AppLink';
import { ArticleView } from '@/entities/Article';

export const RideCard = memo((props: {ride:{
        title: string,
        description: string,
        user_count: number,
        current_user_count: number,
        id:string,
        date: string
    },view: ArticleView, className?: string;}) => {

    const {ride,view, className} = props


    if (view === ArticleView.SMALL) {
        return (
            <AppLink
                to={getRouteRideDetails(ride.id || '')}
                className={classNames(cls.ArticleListItem, {}, [
                    className,
                    cls[view],
                ])}
            >
                <Card className={cls.card} border="partial" padding="0">
                    <HStack className={cls.info} gap="4">
                        <Text title="Назва" className={cls.title} />
                        <Text title={ride.title} className={cls.title} />
                    </HStack>
                    <HStack className={cls.info} gap="4">
                        <Text title="Дата" className={cls.title} />
                        <Text title={ride.date} className={cls.title} />
                    </HStack>
                    {
                        ride?.confidenceScore && <HStack className={cls.info} gap="4">
                            <Text title="Упевненість:" className={cls.title} />
                            <Text title={`${ride?.confidenceScore} %`} className={cls.title} />
                        </HStack>
                    }
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
                <VStack align="center" max gap="16">
                    <HStack justify="center" gap="8" max>
                        <Text title="Title:" />
                        <Text text={ride.title || ''} />
                    </HStack>
                    <HStack justify="center" gap="8" max>
                        <Text title="Description:" />
                        <Text title={ride.description || ''}  />
                    </HStack>
                    <HStack justify="center" gap="8" max>
                        <Text title="Date:" />
                        <Text title={ride.date || ''}  />
                    </HStack>
                    {
                        ride?.confidenceScore && <HStack className={cls.info} gap="4">
                            <Text title="Упевненість:" className={cls.title} />
                            <Text title={`${ride?.confidenceScore} %`} className={cls.title} />
                        </HStack>
                    }
                    <AppLink
                        to={getRouteRideDetails(ride.id || '')}
                    >
                        <Button variant="outline">
                            Деталі
                        </Button>
                    </AppLink>
                </VStack>
            </HStack>

        </Card>
    );
});
