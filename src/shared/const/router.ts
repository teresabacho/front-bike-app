export enum AppRoutes {
    MAIN = 'main',
    SETTINGS = 'settings',
    ABOUT = 'about',
    PROFILE = 'profile',
    ARTICLES = 'articles',
    ARTICLE_DETAILS = 'article_details',
    ARTICLE_CREATE = 'article_create',
    ARTICLE_EDIT = 'article_edit',
    ADMIN_PANEL = 'admin_panel',
    FORBIDDEN = 'forbidden',
    ROAD_CREATE = 'create_road',
    NOT_FOUND = 'not_found',
    RIDE_CREATE = 'ride_create',
    RIDE_SAVE = 'ride_save',
    RIDE_CHAT = 'ride_chat',
    MY_RIDES = 'my_rides',
    USER_LIST = 'user_list',
    USER_DETAILS = 'user_details',
    USER_CHAT = 'user_chat',
    RIDE_DETAILS = 'ride_details',
    MY_PROFILE = 'my_profile',
    PAYMENTS = 'payments',
ADMIN_TRAINER_APPROVAL = 'admin_trainer_approval',
TRAINER_APPROVAL = 'trainer_approval',
ADMIN_REPORTS= 'admin_reports',
}

export const getRouteMain = () => '/';
export const getRideCreate = () => `/ride`;
export const getRouteSettings = () => '/settings';
export const getRouteAbout = () => '/about';
export const getRouteProfile = (id: string) => `/profile/${id}`;
export const getRouteMyProfile = () => `/profile/me`;
export const getRouteArticles = () => '/articles';
export const getRouteArticleDetails = (id: string) => `/articles/${id}`;
export const getRouteArticleCreate = () => '/articles/new';
export const getRouteArticleEdit = (id: string) => `/articles/${id}/edit`;
export const getRouteAdmin = () => '/admin';
export const getRouteForbidden = () => '/forbidden';
export const getRouterCreateRoad = () => '/road';
export const getRouterSaveRide = (id:string) => `/ride/${id}`;
export const getRouteChat = (id:string) => `/ride/${id}/chat`;
export const getUserChat = (id:string) => `/users/${id}/chat`;
export const getRouteMyRides = () => `/my-rides`;
export const getRouteUserLIst = () => `/users`;
export const getRouteUserDetails= (id:string) => `/users/${id}`;
export const getRouteRideDetails= (id:string) => `/ride-details/${id}`;
export const getPayments= (id:string) => `/payments`;
export const getAdminApprovals= () => `/admin/trainer-approval`;
export const getTrainerApprovals= () => `/trainer/ride-approvals`;
export const getAdminReports= () => `/admin/reports`;

export const AppRouteByPathPattern: Record<string, AppRoutes> = {
    [getRouteMain()]: AppRoutes.MAIN,
    [getRouteSettings()]: AppRoutes.SETTINGS,
    [getRouteAbout()]: AppRoutes.ABOUT,
    [getRouteProfile(':id')]: AppRoutes.PROFILE,
    [getRouteArticles()]: AppRoutes.ARTICLES,
    [getRouteArticleDetails(':id')]: AppRoutes.ARTICLE_DETAILS,
    [getRouteArticleCreate()]: AppRoutes.ARTICLE_CREATE,
    [getRouteArticleEdit(':id')]: AppRoutes.ARTICLE_EDIT,
    [getRouteAdmin()]: AppRoutes.ADMIN_PANEL,
    [getRouteForbidden()]: AppRoutes.FORBIDDEN,
    [getRouterCreateRoad()]: AppRoutes.ROAD_CREATE,
    [getRideCreate()]: AppRoutes.RIDE_CREATE,
    [getRouterSaveRide(':id')]: AppRoutes.RIDE_SAVE,
    [getRouteChat(':id')]: AppRoutes.RIDE_CHAT,
    [getRouteMyRides()]: AppRoutes.MY_RIDES,
    [getRouteUserLIst()]: AppRoutes.USER_LIST,
    [getRouteUserDetails(':id')]: AppRoutes.USER_DETAILS,
    [getUserChat(':id')]: AppRoutes.USER_CHAT,
    [getRouteRideDetails(':id')]: AppRoutes.RIDE_DETAILS,
    [getRouteMyProfile()]: AppRoutes.MY_PROFILE,
    [getPayments(":id")]: AppRoutes.PAYMENTS,
    [getAdminApprovals()]: AppRoutes.ADMIN_TRAINER_APPROVAL,
    [getTrainerApprovals()]: AppRoutes.TRAINER_APPROVAL,
    [getAdminReports()]: AppRoutes.ADMIN_REPORTS,

};
