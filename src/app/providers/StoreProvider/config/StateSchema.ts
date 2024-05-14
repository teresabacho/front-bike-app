import {
    AnyAction,
    EnhancedStore,
    Reducer,
    ReducersMapObject,
} from '@reduxjs/toolkit';
import { CombinedState } from 'redux';
import { AxiosInstance } from 'axios';
import { LoginSchema } from '@/features/AuthByUsername';
import { UserSchema } from '@/entities/User';
import { ArticleDetailsSchema } from '@/entities/Article';
import { ArticleDetailsPageSchema } from '@/pages/ArticleDetailsPage';
import { AddCommentFormSchema } from '@/features/addCommentForm';
import { ArticlesPageSchema } from '@/pages/ArticlesPage';
import { UISchema } from '@/features/UI';
import { rtkApi } from '@/shared/api/rtkApi';
import { ProfileSchema } from '@/features/editableProfileCard';
import { RegisterSchema } from '@/features/Registration';
import { CreateRoadSchema } from '@/features/Map';
import { CreateRideTypes } from '@/features/RideCreate';
import { SaveRideTypes } from '@/features/SaveRide';
import { ChatTypes } from '@/pages/ChatPage';
import { MyRidesTypes } from '@/pages/MyRides';
import { UsersList } from '@/pages/UserPage';
import { UserDetails } from '@/pages/UserDetailsPage';
import { RideDetails } from '@/pages/RideDetailsPage';
import { MyPage } from '@/pages/MyPage';
import { CreateArticleTypes } from '@/pages/ArticleCreatePage';

export interface StateSchema {
    user: UserSchema;
    ui: UISchema;
    [rtkApi.reducerPath]: ReturnType<typeof rtkApi.reducer>;

    loginForm?: LoginSchema;
    registerForm?: RegisterSchema;
    profile?: ProfileSchema;
    articleDetails?: ArticleDetailsSchema;
    addCommentForm?: AddCommentFormSchema;
    articlesPage?: ArticlesPageSchema;
    articleDetailsPage?: ArticleDetailsPageSchema;
    createRoadSchema?:CreateRoadSchema,
    createRideSchema?:CreateRideTypes,
    saveRideSchema?:SaveRideTypes,
    chatSchema?:ChatTypes
    myRideSchema?: MyRidesTypes,
    userListSchema?:UsersList
    userDetailsSchema?:UserDetails,
    RideDetailsSchema?:RideDetails,
    myPage?:MyPage,
    createArticle?: CreateArticleTypes
}

export type StateSchemaKey = keyof StateSchema;
export type MountedReducers = OptionalRecord<StateSchemaKey, boolean>;

export interface ReducerManager {
    getReducerMap: () => ReducersMapObject<StateSchema>;
    reduce: (
        state: StateSchema,
        action: AnyAction,
    ) => CombinedState<StateSchema>;
    add: (key: StateSchemaKey, reducer: Reducer) => void;
    remove: (key: StateSchemaKey) => void;
    getMountedReducers: () => MountedReducers;
}

export interface ReduxStoreWithManager extends EnhancedStore<StateSchema> {
    reducerManager: ReducerManager;
}

export interface ThunkExtraArg {
    api: AxiosInstance;
}

export interface ThunkConfig<T> {
    rejectValue: T;
    extra: ThunkExtraArg;
    state: StateSchema;
}
