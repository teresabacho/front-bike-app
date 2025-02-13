import { memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './UserDetailsPage.module.scss';
import { AppImage } from '@/shared/ui/redesigned/AppImage';
import { Skeleton } from '@/shared/ui/redesigned/Skeleton';
import { Text } from '@/shared/ui/redesigned/Text';
import { Card } from '@/shared/ui/redesigned/Card';
import { StateSchema } from '@/app/providers/StoreProvider';
import { fetchUserData } from '../../model/services/fetchUserData';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { userDetailsReducer } from '../../model/slice/usersDetails.slice';
import { Button } from '@/shared/ui/redesigned/Button';
import { subscribeToUser } from '../../model/services/subscribeToUser';
import { unSubscribeToUser } from '../../model/services/unSubscribeToUser';
import { fetchRides } from '../../model/services/fetchRides';
import { fetchPosts } from '../../model/services/fetchPosts';
import { ArticleListItem , ArticleView } from '@/entities/Article';
import { RideCard } from '@/pages/MyRides';

const initialReducers: ReducersList = {
    userDetailsSchema: userDetailsReducer,
};
export const UserDetails = memo(() => {
    const user = useSelector((state:StateSchema) => state?.userDetailsSchema?.user)
    const articles = useSelector((state:StateSchema) => state?.userDetailsSchema?.articles)
    const rides = useSelector((state:StateSchema) => state?.userDetailsSchema?.rides)
    const {id} = useParams()
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const[isPostsVisible, setIsPostsVisible] = useState(true)

    useEffect(() => {
        if (id) {
            dispatch(fetchUserData(id));
        }
    },[id,dispatch]);

    useEffect(() => {
        if (id) {
            dispatch(fetchPosts(id));
        }
    },[id,dispatch]);
    return (
        <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
            <Card
                padding="24"
                max
                className={classNames(cls.ArticleListItem, {}, [
                    cls.card,
                    cls.SMALL,
                ])}
            >
                <VStack justify="center" align="center" gap="8" max>
                    <AppImage
                        fallback={<Skeleton width="100%" height={250} />}
                        src={
                            user?.avatar ||
                            'https://www.hundeo.com/wp-content/uploads/2019/05/Shiba-Inu-Profilbild.jpg'
                        }
                        className={cls.img}
                        alt={user?.lastname || ''}
                    />
                    <VStack align="center" max gap="16">
                        <HStack justify="center" gap="8" max>
                            <Text
                                text={user?.username || 'інформація не вказана'}
                            />
                        </HStack>
                        <HStack justify="center" gap="8" max>
                            <Text title="Вік" />
                            <Text
                                title={user?.age || 'інформація не вказана'}
                            />
                        </HStack>
                        <HStack justify="center" gap="8" max>
                            <Text title="Ім'я" />
                            <Text
                                title={user?.first || 'інформація не вказана'}
                            />
                        </HStack>
                        <HStack justify="center" gap="8" max>
                            <Text title="Прізвище" />
                            <Text
                                title={
                                    user?.lastname || 'інформація не вказана'
                                }
                            />
                        </HStack>

                        <HStack justify="center" gap="8" max>
                            <Text title="Місто" />
                            <Text
                                title={user?.city || 'інформація не вказана'}
                            />
                        </HStack>

                        <HStack justify="center" gap="8" max>
                            <Button
                                onClick={() => {
                                    if (!id) return;
                                    if (!user?.isSubscribed) {
                                        dispatch(subscribeToUser(id));
                                    } else {
                                        dispatch(unSubscribeToUser(id));
                                    }
                                }}
                            >
                                {user?.isSubscribed
                                    ? 'Відписатись'
                                    : 'Підписатись'}
                            </Button>
                            <Button
                                onClick={() => {
                                    navigate(`/users/${user?.id}/chat`);
                                }}
                            >
                                Почати чат
                            </Button>
                            <Button
                                onClick={() => {
                                    dispatch(fetchRides(id || ''));
                                    setIsPostsVisible(false);
                                }}
                            >
                                Поїздки користувача
                            </Button>
                            <Button
                                onClick={() => {
                                    dispatch(fetchPosts(id || ''));
                                    setIsPostsVisible(true);
                                }}
                            >
                                Пости користувача
                            </Button>
                        </HStack>
                    </VStack>
                    {isPostsVisible && articles?.length
                        ? articles.map((u) => {
                              return (
                                  <ArticleListItem
                                      article={u}
                                      view={ArticleView.BIG}
                                  />
                              );
                          })
                        : isPostsVisible && (
                              <div>У цього користувача ще немає постів</div>
                          )}
                    {!isPostsVisible && rides?.length ? (
                        rides.map((u) => {
                            return <RideCard ride={u} view={ArticleView.BIG} />;
                        })
                    ) : !isPostsVisible && (
                        <div>У цього користувача ще немає поїздок</div>
                    )}
                </VStack>
            </Card>
        </DynamicModuleLoader>
    );
});
