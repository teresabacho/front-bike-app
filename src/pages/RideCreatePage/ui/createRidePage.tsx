

import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { CreateRide } from '@/features/RideCreate';
import { $api } from '@/shared/api/api';
import { Road } from '@/entities/Road';

const CreateRidePage = () => {
    const { id = '' } = useParams();
    const [mapData, setMapData] = useState<Road>();
    const [directions, setDirections] = useState<google.maps.DirectionsResult>();
    const [mapLoaded, setMapLoaded] = useState(false);

    async function fetchData(id: string) {
        const result: AxiosResponse<Road> = await $api.get(`road/${id}`);
        setMapData(result.data);
    }
     const buildRoute = useCallback( async ()=> {
        if (!window.google || !mapData) return;

        const directionsService = new window.google.maps.DirectionsService();
        const result = await directionsService.route({
            origin: mapData.startMark.location || '',
            waypoints: mapData.waypoints?.map(waypoint => ({
                stopover: false,
                location: waypoint.location
            })),
            destination: mapData.finishMark.location || '',
            travelMode: window.google.maps.TravelMode.WALKING,
        });
        setDirections(result);
    },[mapData])

    useEffect(() => {
        fetchData(id);
    }, [id]);

    useEffect(() => {
        if (mapLoaded) {
            buildRoute();
        }
    }, [mapLoaded, mapData, buildRoute]);

    return (
        <div className="App">
            <div>
                <CreateRide />
            </div>
        </div>
    );
};

export default CreateRidePage;
