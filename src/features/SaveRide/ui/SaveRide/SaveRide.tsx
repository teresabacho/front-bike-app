/* eslint-disable i18next/no-literal-string */
import React, { useCallback, useEffect } from 'react';
import { LoadScript } from '@react-google-maps/api';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Map  } from '@/features/Map';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { StateSchema } from '@/app/providers/StoreProvider';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { saveRideActions, saveRideReducer } from '../../model/slice/createRide.slice';
import { fetchRoad } from '../../model/services/fetchRoad';
import { Input } from '@/shared/ui/redesigned/Input';
import { Text } from '@/shared/ui/redesigned/Text';
import { Button } from '@/shared/ui/redesigned/Button';
import { createRide } from '../../model/services/createRide';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';
import { getRouteMyRides } from '@/shared/const/router';

const initialReducers: ReducersList = {
    saveRideSchema: saveRideReducer,
};
const SaveRide = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const {id} = useParams();
    const road = useSelector((state:StateSchema) => state?.saveRideSchema?.road)
    const directions = useSelector((state:StateSchema) => state?.saveRideSchema?.directions)
    const isMapLoaded = useSelector((state:StateSchema) => state?.saveRideSchema?.isMapLoaded)
    const description = useSelector((state:StateSchema) => state?.saveRideSchema?.description)
    const title = useSelector((state:StateSchema) => state?.saveRideSchema?.title)
    const usersCount = useSelector((state:StateSchema) => state?.saveRideSchema?.usersCount)
    const date = useSelector((state:StateSchema) => state?.saveRideSchema?.date)
    const [isPaid, setIsPaid] = React.useState(false);
    const [price, setPrice] = React.useState(0);

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
        dispatch(saveRideActions.setDirection(result));
    },[road, dispatch])

    useEffect(() => {
        dispatch(fetchRoad(id || ''));
    }, [id,dispatch]);

    useEffect(() => {
        if (isMapLoaded) {
            buildRoute();
        }
    }, [isMapLoaded, road, buildRoute]);

    return (
        <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
            <VStack justify="center" align="center" gap="32">
                <LoadScript
                    googleMapsApiKey='AIzaSyCAQVTz4ovEKsi1PguWdsz3PjPTqXGy4LI'
                    onLoad={()=>dispatch(saveRideActions.setIsMapLoaded(true))}
                >

                    <Map startMark={road?.startMark}
                         finishMark={road?.finishMark}
                         waypoints={road?.waypoints}
                         directions={directions}
                         mapContainerStyle={{
                             width:"500px",
                             height:"500px"
                         }}
                    />

                </LoadScript>

                <VStack max justify="center" align="center" gap="8">
                    <Text text="Заголовок" />
                    <Input value={title} onChange={(e) =>
                        dispatch(saveRideActions.setTitle(
                                e
                            )
                        )
                    } />
                    <Text text="Опис" />
                    <Input value={description} onChange={(e) =>
                        dispatch(saveRideActions.setDescription(
                                e
                            )
                        )
                    }  />
                    <Text text="Максимальне число користувачів" />
                    <Input value={usersCount} onChange={(e) =>
                        dispatch(saveRideActions.setUserCount(
                                +e
                            )
                        )
                    }  />
                    <Text text="Дата заїзду" />
                    <Input value={date} type={'datetime-local'} onChange={(e) =>
                        dispatch(saveRideActions.setDate(
                                e
                            )
                        )
                    }  />
                    {
                       ( (localStorage.getItem('role') === 'trainer' && localStorage.getItem('isApproved') === 'true'  ) || localStorage.getItem('role') === 'admin') &&
                        <HStack gap="8">
                            <Text text="Платна поїздка" />
                            <input type={'checkbox'} onChange={()=>{
                                setIsPaid(!isPaid)
                            }}/>
                        </HStack>
                    }
                    {
                        isPaid &&
                        <Text text="Ціна" />
                    }
                    {
                        isPaid &&
                        <Input type={'number'} value={price} onChange={(e) =>
                            setPrice(Number(e))
                        }  />
                    }
                    <Button onClick={()=>{
                        dispatch(createRide({usersCount,description, title, roadId:id, date, isPaid, price, distance: directions?.routes?.[0]?.legs?.[0]?.distance?.value, duration: directions?.routes?.[0]?.legs?.[0]?.duration?.value}))
                        navigate(getRouteMyRides())
                    }}>Save Ride</Button>
                </VStack>
            </VStack>
        </DynamicModuleLoader>

    );
};

export default SaveRide;
