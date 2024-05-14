import { memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './MyPage.module.scss';
import { AppImage } from '@/shared/ui/redesigned/AppImage';
import { Skeleton } from '@/shared/ui/redesigned/Skeleton';
import { Text } from '@/shared/ui/redesigned/Text';
import { Card } from '@/shared/ui/redesigned/Card';
import { StateSchema } from '@/app/providers/StoreProvider';
import { fetchUserData } from '../../model/services/fetchUserData';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { Button } from '@/shared/ui/redesigned/Button';
import { myPageReducer } from '../../model/slice/MyPage.slice';
import { ArticleListItem, ArticleView } from '@/entities/Article';
import { RideCard } from '@/pages/MyRides';
import { fetchRides } from '../../model/services/fetchRides';
import { fetchPosts } from '../../model/services/fetchPosts';

const initialReducers: ReducersList = {
    myPage: myPageReducer,
};
export const MyPage = memo(() => {
    const user = useSelector((state:StateSchema) => state?.myPage?.user)
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const articles = useSelector((state:StateSchema) => state?.myPage?.articles)
    const rides = useSelector((state:StateSchema) => state?.myPage?.rides)
    const[isPostsVisible, setIsPostsVisible] = useState(true)

    useEffect(() => {
            dispatch(fetchUserData());
    },[dispatch]);

    useEffect(() => {

            dispatch(fetchPosts());

    },[dispatch]);

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
                        src={user?.avatar || "https://www.hundeo.com/wp-content/uploads/2019/05/Shiba-Inu-Profilbild.jpg"}
                        className={cls.img}
                        alt={user?.lastname || ''}
                    />
                    <VStack align="center" max gap="16">
                        <HStack justify="center" gap="8" max>
                            <Text text={user?.username || 'інформація не вказана'} />
                        </HStack>
                        <HStack justify="center" gap="8" max>
                            <Text title="age" />
                            <Text title={user?.age || 'інформація не вказана'}  />
                        </HStack>
                        <HStack justify="center" gap="8" max>
                            <Text title="first" />
                            <Text title={user?.first || 'інформація не вказана'}  />
                        </HStack>
                        <HStack justify="center" gap="8" max>
                            <Text title="last" />
                            <Text title={user?.lastname || 'інформація не вказана'}  />
                        </HStack>

                        <HStack justify="center" gap="8" max>
                            <Text title="City"  />
                            <Text title={user?.city || 'інформація не вказана'} />
                        </HStack>

                        <HStack justify="center" gap="8" max>
                            <Button onClick={()=>{
                                navigate(`/articles/new`)
                            }}>Створити пост</Button>
                        </HStack>
                        <Button onClick={()=>{
                            dispatch(fetchRides())
                            setIsPostsVisible(false)

                        }}>Поїздки користувача</Button>
                        <Button onClick={()=>{
                            dispatch(fetchPosts())
                            setIsPostsVisible(true)
                        }}>Пости користувача</Button>
                        {isPostsVisible && articles?.length && articles.map((u)=>{
                            return (
                                <ArticleListItem article={u} view={ArticleView.BIG}/>
                            )
                        })}
                        { !isPostsVisible && rides?.length && rides.map((u)=>{
                            return (
                                <RideCard ride={u} view={ArticleView.BIG}/>
                            )
                        })}
                    </VStack>
                </VStack>

            </Card>
        </DynamicModuleLoader>

    );
});
