import {
    GoogleMap,
    Marker,
    DirectionsRenderer,
} from '@react-google-maps/api';
import { Location } from '../../model/types/MapTypes';

const mapContainerStyle = {
    width: '1000px',
    height: '1000px',
};
type propsType = {
    onMapClick?:(event:google.maps.MapMouseEvent)=>void
    startMark?:Location
    finishMark?:Location
    waypoints?:Array<Location>
    directions?: google.maps.DirectionsResult | null,
    mapContainerStyle?: {
        width: string,
        height: string
    }
}
const center = {
    lat: 49.842957,
    lng: 24.031111,
};
export const Map = ({onMapClick, startMark,waypoints,finishMark, directions , mapContainerStyle = {
    width: '1000px',
    height: '1000px',
}}:propsType) => {
    return (
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={center}
                        zoom={13}
                        onClick={onMapClick}
                    >
                        {startMark && <Marker position={startMark.position || center} />}
                        {waypoints?.length && waypoints.map((waypoint, index) =>
                            waypoint.position ? <Marker key={index} position={waypoint.position} /> : null
                        )}
                        {directions && <DirectionsRenderer directions={directions} />}
                        {finishMark?.position && <Marker position={finishMark.position} />}

                    </GoogleMap>
    )
};

export default Map;
