export type UserListItem = {
    id:string | null
    first: string | null,
    lastname: string | null,
    age: string | null,
    city: string | null,
    username: string | null,
    avatar: string | null,
    isSubscribed?: boolean | null
}
export type MyPage = {
    user: UserListItem | null
    rides: Array<{
        title: string,
        description: string,
        user_count: number,
        id:string
    }>,
    articles: Array<any>
}
