

import React, { useCallback, useEffect, useState } from 'react';
import { LoadScript } from '@react-google-maps/api';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Map  } from '@/features/Map';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { StateSchema } from '@/app/providers/StoreProvider';
import { fetchRoads } from '../../model/services/fetchRoads';
import { Road } from '@/entities/Road';
import { createRideActions, createRideReducer } from '../../model/slice/createRide.slice';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { Button } from '@/shared/ui/redesigned/Button';
import { deleteRoad } from '../../model/services/deleteRoad';
import { Text } from '@/shared/ui/redesigned/Text';
import { getRouterCreateRoad } from '@/shared/const/router';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';

const CreateRide = () => {
    const dispatch = useAppDispatch()
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const navigate = useNavigate();

    const fetchData= useCallback(()=>{
            dispatch(fetchRoads());
    },[dispatch])


    const road = useSelector((state:StateSchema) => state?.createRideSchema?.road)
    const directions = useSelector((state:StateSchema) => state?.createRideSchema?.directions)

    const initialReducers: ReducersList = {
        createRideSchema: createRideReducer,
    };



    const buildRoute = useCallback( async (road:Road)=> {
        if (!window.google || !road) return;

        const directionsService = new window.google.maps.DirectionsService();
        const result = await directionsService.route({
            origin: road.startMark.location || '',
            waypoints: road.waypoints?.map(waypoint => ({
                stopover: false,
                location: waypoint.location
            })),
            destination: road.finishMark.location || '',
            travelMode: window.google.maps.TravelMode.WALKING,
        });
        dispatch(createRideActions.setDirection({ direction:result, id: road.id }));
    },[dispatch])

    useEffect(() => {
        fetchData()
    }, [fetchData]);

    useEffect(() => {
        if (isMapLoaded && road?.length){
            road?.forEach (e=> {
                buildRoute(e)
            })
        }
    }, [isMapLoaded,road,buildRoute]);


    return (
        <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
            {road?.length ? <LoadScript
                googleMapsApiKey='AIzaSyCAQVTz4ovEKsi1PguWdsz3PjPTqXGy4LI'
                onLoad={() => setIsMapLoaded(true)}
            >
                {!!road?.length &&
                    <HStack className="App"  max
gap="32" wrap="wrap">
                        {road?.map(e => {
                            return (
                                <VStack  align="center" justify="center" gap="32" key={e.id}
className="App">

                                    <Map startMark={e?.startMark}
                                         finishMark={e?.finishMark}
                                         waypoints={e?.waypoints}
                                         directions={directions?.find((element) => element.id === e.id)?.direction}
                                         mapContainerStyle={{
                                             width: "300px",
                                             height: "300px"
                                         }}
                                    />
                                    <VStack gap="8" align="center" justify="center">
                                        <Text title={e?.title} />
                                        <HStack gap="16">
                                            <Text title={directions?.find((element) => element.id === e.id)?.direction.routes[0].legs[0].distance.text} />
                                            <Text title={directions?.find((element) => element.id === e.id)?.direction.routes[0].legs[0].duration.text} />
                                        </HStack>
                                        <HStack gap="16">
                                            <Button onClick={() => {
                                                dispatch(deleteRoad(e.id))
                                            }}>
                                                Видалити Маршут
                                            </Button>
                                            <Button onClick={() => {
                                                navigate(`${e.id}/`)
                                            }}>
                                                Обрати Маршут
                                            </Button>
                                        </HStack>
                                    </VStack>

                                </VStack>
                            )
                        })}
                    </HStack>
                }
            </LoadScript> : <VStack justify="center" align="center" gap="32" max>
                <Text text="У вас ще немає жодного маршуту, Давайте Створимо!" />
                <Button onClick={() => {
                    navigate(getRouterCreateRoad())
                }}>До Маршутів</Button>
            </VStack>}
        </DynamicModuleLoader>

    );
};

export default CreateRide;
