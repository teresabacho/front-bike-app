import { MainPage } from '@/pages/MainPage';
import { AboutPage } from '@/pages/AboutPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { ArticlesPage } from '@/pages/ArticlesPage';
import { ArticleDetailsPage } from '@/pages/ArticleDetailsPage';
import { ArticleEditPage } from '@/pages/ArticleEditPage';
import { AdminPanelPage } from '@/pages/AdminPanelPage';
import { UserRole } from '@/entities/User';
import { ForbiddenPage } from '@/pages/ForbiddenPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import {
    AppRoutes,
    getRouteAbout,
    getRouteAdmin,
    getRouteArticleCreate,
    getRouteArticleDetails,
    getRouteArticleEdit,
    getRouteForbidden,
    getRouteArticles,
    getRouteMain,
    getRouteProfile,
    getRouteSettings,
    getRouterCreateRoad,
    getRideCreate,
    getRouterSaveRide,
    getRouteChat,
    getRouteMyRides,
    getRouteUserLIst,
    getRouteUserDetails,
    getUserChat,
    getRouteRideDetails,
    getRouteMyProfile,
    getPayments,
    getAdminApprovals, getTrainerApprovals, getAdminReports, getMyBikes,
} from '@/shared/const/router';
import { AppRoutesProps } from '@/shared/types/router';
import { SettingsPage } from '@/pages/SettingsPage';
import { RoadCreatePage } from '@/pages/RoadCreatePage';
import { CreateRidePage } from '@/pages/RideCreatePage';
import { SaveRidePage } from '@/pages/RideSavePage';
import { Chat } from '@/pages/ChatPage';
import { MyRides } from '@/pages/MyRides';
import { UserPage } from '@/pages/UserPage';
import { UserDetailsPage } from '@/pages/UserDetailsPage';
import { RideDetailsPage } from '@/pages/RideDetailsPage';
import { MyProfilePage } from '@/pages/MyPage';
import { CreateArticle } from '@/pages/ArticleCreatePage';
import CheckoutPage from '@/pages/PaymentPage/ui/CheckoutPage';
import { AdminTrainerApprovalPage } from '@/pages/AdminTrainerApprovalPage/ui/AdminTrainerApprovalPage';
import { TrainerApplicationsPage } from '@/pages/TrainerApprovalPage/ui/trainerApprovalPage';
import { AdminReportsPage } from '@/pages/AdminReportsPage/AdminReportsPage';
import MyBikes from '@/pages/MyBikes/MyBikes';

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
    [AppRoutes.MAIN]: {
        path: getRouteMain(),
        element: <MainPage />,
    },
    [AppRoutes.USER_LIST]: {
        path: getRouteUserLIst(),
        element: <UserPage />,
    },
    [AppRoutes.USER_DETAILS]: {
        path: getRouteUserDetails(':id'),
        element: <UserDetailsPage />,
    },
    [AppRoutes.USER_CHAT]: {
        path: getUserChat(':id'),
        element: <Chat isUserToUser />,
    },
    [AppRoutes.SETTINGS]: {
        path: getRouteSettings(),
        element: <SettingsPage />,
    },
    [AppRoutes.ABOUT]: {
        path: getRouteAbout(),
        element: <AboutPage />,
    },
    [AppRoutes.PROFILE]: {
        path: getRouteProfile(':id'),
        element: <ProfilePage />,
        authOnly: true,
    },
    [AppRoutes.ARTICLES]: {
        path: getRouteArticles(),
        element: <ArticlesPage />,
        authOnly: true,
    },
    [AppRoutes.ARTICLE_DETAILS]: {
        path: getRouteArticleDetails(':id'),
        element: <ArticleDetailsPage />,
        authOnly: true,
    },
    [AppRoutes.ARTICLE_CREATE]: {
        path: getRouteArticleCreate(),
        element: <CreateArticle />,
        authOnly: true,
    },
    [AppRoutes.ARTICLE_EDIT]: {
        path: getRouteArticleEdit(':id'),
        element: <ArticleEditPage />,
        authOnly: true,
    },
    [AppRoutes.ROAD_CREATE]: {
        path: getRouterCreateRoad(),
        element: <RoadCreatePage />,
        authOnly: true,
    },
    [AppRoutes.ADMIN_PANEL]: {
        path: getRouteAdmin(),
        element: <AdminPanelPage />,
        authOnly: true,
        roles: [UserRole.MANAGER, UserRole.ADMIN],
    },
    [AppRoutes.FORBIDDEN]: {
        path: getRouteForbidden(),
        element: <ForbiddenPage />,
    },
    [AppRoutes.RIDE_DETAILS]: {
        path: getRouteRideDetails(':id'),
        element: <RideDetailsPage />,
    },
    [AppRoutes.NOT_FOUND]: {
        path: '*',
        element: <NotFoundPage />,
    },
    [AppRoutes.RIDE_CREATE]: {
        path: getRideCreate(),
        element: <CreateRidePage />,
    },
    [AppRoutes.MY_PROFILE]: {
        path: getRouteMyProfile(),
        element: <MyProfilePage />,
    },
    [AppRoutes.RIDE_SAVE]: {
        path: getRouterSaveRide(':id'),
        element: <SaveRidePage />,
    },
    [AppRoutes.RIDE_CHAT]: {
        path: getRouteChat(':id'),
        element: <Chat />,
    },
    [AppRoutes.MY_RIDES]: {
        path: getRouteMyRides(),
        element: <MyRides />,
    },
    [AppRoutes.PAYMENTS]: {
        path: getPayments(':id'),
        element: <CheckoutPage />,
    },
    [AppRoutes.ADMIN_TRAINER_APPROVAL]: {
        path: getAdminApprovals(),
        element: <AdminTrainerApprovalPage />,
    },
    [AppRoutes.TRAINER_APPROVAL]: {
        path: getTrainerApprovals(),
        element: <TrainerApplicationsPage />,
    },
    [AppRoutes.ADMIN_REPORTS]: {
        path: getAdminReports(),
        element: <AdminReportsPage />,
    },
    [AppRoutes.MY_BIKES]: {
        path: getMyBikes(),
        element: <MyBikes />,
    }


};
