import { useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import { StateSchema } from '@/app/providers/StoreProvider';
import { fetchUsers } from '../../model/services/fetchUsers';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { userListReducer } from '../../model/slice/users.slice';
import { UserListItem } from './userListItem';
import { ArticleView } from '@/entities/Article';
import {Text} from "@/shared/ui/redesigned/Text";
import {Button} from "@/shared/ui/redesigned/Button";
import {getRouteArticles, getRouterCreateRoad} from "@/shared/const/router";
import {VStack} from "@/shared/ui/redesigned/Stack";
import {useNavigate} from "react-router-dom";

const initialReducers: ReducersList = {
    userListSchema:userListReducer,
};
const UserPage = () => {
    const users = useSelector((state:StateSchema) => state?.userListSchema?.users)
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    console.log('hello');

    return(
        <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
            <div>
                {!users?.length ? users?.map((user) => {
                    return <UserListItem buttonTitle="Почати чат" to={`/users/${user?.id}/chat`} view={ArticleView.BIG} user={user} key={user.id} />
                }): <VStack justify="center" align="center" gap="32" max>
                    <Text text="У вас ще немає жодного чату, але можна найти товариша у пошуку" />
                    <Button onClick={() => {
                        navigate(getRouteArticles()+'?sort=createdAt&order=asc&search=&type=users')
                    }}>До пошуку</Button>
                </VStack>}
            </div>
        </DynamicModuleLoader>

    )
};

export default UserPage;
