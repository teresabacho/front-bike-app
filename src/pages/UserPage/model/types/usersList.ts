export type UserListItem = {
    id:string | null
    first: string | null,
    lastname: string | null,
    age: string | null,
    city: string | null,
    username: string | null,
    avatar: string | null,
}
export type UsersList = {
    users: Array<UserListItem>
}
