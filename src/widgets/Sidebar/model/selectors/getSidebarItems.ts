import { useSelector } from 'react-redux';
import { getUserAuthData } from '@/entities/User';

import MainIcon from '@/shared/assets/icons/home.svg';
import ArticleIcon from '@/shared/assets/icons/article.svg';
import ProfileIcon from '@/shared/assets/icons/avatar.svg';
import ChatIcon from '@/shared/assets/icons/message-circle-text-svgrepo-com.svg';
import AddIcon from '@/shared/assets/icons/add-circle-svgrepo-com.svg';
import BikeIcon from '@/shared/assets/icons/bike-svgrepo-com.svg';



import { SidebarItemType } from '../types/sidebar';
import {
    getAdminApprovals, getAdminReports,
    getRideCreate,
    getRouteArticles,
    getRouteMain, getRouteMyProfile, getRouteMyRides, getRouterCreateRoad, getRouteUserLIst, getTrainerApprovals,
} from '@/shared/const/router';

export const useSidebarItems = () => {
    const userData = useSelector(getUserAuthData);
    const sidebarItemsList: SidebarItemType[] = [
        {
            path: getRouteMain(),
            Icon: MainIcon,
            text: 'Головна',
        }
    ];

    if (userData) {
        sidebarItemsList.push(
            {
                path: getRouteMyProfile(),
                Icon: ProfileIcon,
                text: 'Моя сторінка',
                authOnly: true,
            },

            {
                path: getRouteArticles(),
                Icon: ArticleIcon,
                text: 'Стрічка',
                authOnly: true,
            },
            {
                path: getRouterCreateRoad(),
                Icon: AddIcon,
                text: 'Cтворити маршут',
                authOnly: true,
            },
            {
                path: getRideCreate(),
                Icon: AddIcon,
                text: 'Cтворити поїздку',
                authOnly: true,
            },
            {
                path: getRouteMyRides(),
                Icon: BikeIcon,
                text: 'Мої поїздки',
                authOnly: true,
            },
            {
                path: getRouteUserLIst(),
                Icon: ChatIcon,
                text: 'Мої чати',
                authOnly: true,
            },
        );
    }
    if (localStorage.getItem('role') === 'admin') {
        console.log('Admin role detected, adding admin sidebar item');
       sidebarItemsList.push( {
           path: getAdminApprovals(),
           Icon: ProfileIcon,
           text: 'Заявки на тренера',
       })
        sidebarItemsList.push( {
            path: getAdminReports(),
            Icon: ChatIcon,
            text: 'Cкарги',
        })
    }
    if (localStorage.getItem('role') === 'trainer') {
        sidebarItemsList.push({
            path: getTrainerApprovals(),
            Icon: ProfileIcon,
            text: 'Заявки на поїздки',
        })
    }
    return sidebarItemsList;
};
