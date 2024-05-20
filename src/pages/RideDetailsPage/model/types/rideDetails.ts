import { Road } from '@/entities/Road';

export type RideDetails = {
    ride:{
        id: string;
        user_count: number;
        road_id: string;
        title: string;
        description: string;
        isApplied: boolean;
    } | null
    road:Road| null,
    directions?: google.maps.DirectionsResult,
    isMapLoaded: boolean,
}
