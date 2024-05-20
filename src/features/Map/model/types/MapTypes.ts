export type Location = {
    location: string,
    position: google.maps.LatLngLiteral | null
}
export type CreateRoadSchema = {
    isLoading: boolean;
    error?: string;
    startMark:Location;
    directions:google.maps.DirectionsResult | null
    finishMark:Location;
    waypoints: Array<Location>;
    activeInput:number | null;
    id:string
    isSaved:boolean,
    title:string,
    distance: string,
    time: string
}
