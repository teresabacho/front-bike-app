import React, { memo, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './RideDetailsPage.module.scss';
import { Text } from '@/shared/ui/redesigned/Text';
import { Card } from '@/shared/ui/redesigned/Card';
import { StateSchema } from '@/app/providers/StoreProvider';
import { fetchRideData, fetchRoad } from '../../model/services/fetchRideData';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { Button } from '@/shared/ui/redesigned/Button';
import { applyToRide } from '../../model/services/applyToRide';
import { unApplyToRide } from '../../model/services/unApplyToRide';
import { rideDetailsActions, rideDetailsReducer } from '../../model/slice/rideDetails.slice';
import { Map } from '@/features/Map';
import { deleteRide } from '../../model/services/deleteRide/deleteRide';
import { getRouteMyRides } from '@/shared/const/router';

const initialReducers: ReducersList = {
    RideDetailsSchema: rideDetailsReducer,
};
export const RideDetailsPage = memo(() => {
    const ride = useSelector((state:StateSchema) => state?.RideDetailsSchema?.ride)
    const {id} = useParams()
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    useEffect(() => {
        if (id) {
            dispatch(fetchRideData(id));
        }
    },[id,dispatch]);
    const road = useSelector((state:StateSchema) => state?.RideDetailsSchema?.road)
    const directions = useSelector((state:StateSchema) => state?.RideDetailsSchema?.directions)
    const isMapLoaded = useSelector((state:StateSchema) => state?.RideDetailsSchema?.isMapLoaded)
    console.log(road?.direction);
    const buildRoute = useCallback( async ()=> {
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
        dispatch(rideDetailsActions.setDirection(result));
    },[road, dispatch])

    useEffect(() => {
        dispatch(fetchRideData(id || ''));
    }, [id,dispatch]);

    useEffect(() => {
        if (ride?.road_id){
            dispatch(fetchRoad(ride?.road_id || ''));

        }
    }, [ride?.road_id,dispatch]);


    useEffect(() => {
        if (isMapLoaded) {
            buildRoute();
        }
    }, [isMapLoaded, road, buildRoute]);

    return (

        <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
            <Card
                padding="24"
                max
                className={classNames(cls.ArticleListItem, {}, [
                    cls.card,
                    cls.SMALL,
                ])}
            >
                <VStack justify="center" align="center" gap="8" max>
                    <LoadScript
                        googleMapsApiKey='AIzaSyCAQVTz4ovEKsi1PguWdsz3PjPTqXGy4LI'
                        onLoad={()=>dispatch(rideDetailsActions.setIsMapLoaded(true))}
                    >

                        <Map startMark={road?.startMark}
                             finishMark={road?.finishMark}
                             waypoints={road?.waypoints}
                             directions={directions}
                             mapContainerStyle={{
                                 width:"300px",
                                 height:"300px"
                             }}
                        />

                    </LoadScript>
                    <VStack align="center" max gap="16">
                        <HStack justify="center" gap="8" max>
                            <Text title="Назва" />
                            <Text title={ride?.title || 'інформація не вказана'}  />
                        </HStack>
                        <HStack justify="center" gap="8" max>
                            <Text title="Опис" />
                            <Text title={ride?.description || 'інформація не вказана'}  />
                        </HStack>

                        {directions?.routes[0].legs[0].distance?.text && <>
                            <HStack justify="center" gap="8" max>
                                <Text title="Час" />
                                <Text title={directions?.routes[0].legs[0].duration?.text || 'інформація не вказана'}  />
                            </HStack>

                            <HStack justify="center" gap="8" max>
                                <Text title="Дистанція" />
                                <Text title={directions?.routes[0].legs[0].distance?.text || 'інформація не вказана'}  />
                            </HStack>
                        </>}


                        <HStack justify="center" gap="8" max>
                            <Text title="Число користувачів"  />
                            <Text title={`${ride?.current_user_count?.toString()  }/${  ride?.user_count?.toString()}` || 'інформація не вказана'} />
                        </HStack>

                        <HStack justify="center" gap="8" max>
                            <Button onClick={()=>{
                                if (!id) return
                                if(!ride?.isApplied) {
                                    dispatch(applyToRide(id))
                                }
                                else {
                                    dispatch(unApplyToRide(id))
                                }
                            }
                            }
                            >{!ride?.isApplied ?'Приєднатись' : 'Не приєднатись'}</Button>
                            <Button onClick={()=>{
                                navigate(`/ride/${ride?.id}/chat`)
                            }}>Почати чат</Button>

                            {ride?.canBeDeleted && <Button onClick={()=>{
                                dispatch(deleteRide(ride?.id))
                                navigate(getRouteMyRides())
                            }}>Видалити</Button>}
                        </HStack>
                    </VStack>
                </VStack>

            </Card>
        </DynamicModuleLoader>

    );
});
