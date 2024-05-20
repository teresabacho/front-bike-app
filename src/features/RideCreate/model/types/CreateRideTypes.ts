import { Road } from '@/entities/Road';

export type CreateRideTypes = {
    isLoading: boolean;
    error?: string;
    road?:Road[]
    usersCount:number,
    description:string,
    isMapLoaded:boolean,
    directions?: Array<{
        id: string,
        direction: google.maps.DirectionsResult
    }>
}
