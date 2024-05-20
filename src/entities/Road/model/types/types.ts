import { Location } from '@/features/Map';

export type Road = {
    id:string
    finishMark: Location
    startMark: Location
    waypoints: Array<Location>
    direction: google.maps.DirectionsResult | null

}
