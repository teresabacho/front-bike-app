import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Page } from '@/widgets/Page';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { fetchRides } from '../model/services/fetchRides';
import { StateSchema } from '@/app/providers/StoreProvider';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { myRidesReducer } from '../model/slice/MyRides.slice';
import { RideCard } from './rideCard';
import {Text} from "@/shared/ui/redesigned/Text";
import {Button} from "@/shared/ui/redesigned/Button";
import {getRideCreate, getRouterCreateRoad, getRouterSaveRide} from "@/shared/const/router";
import {VStack} from "@/shared/ui/redesigned/Stack";


export const MyRides = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const rides = useSelector((state:StateSchema) => state.myRideSchema?.rides)
    useEffect(() => {
        dispatch(fetchRides())
    }, [dispatch]);

    const initialReducers: ReducersList = {
        myRideSchema: myRidesReducer,
    };

    return (

        <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
            <Page data-testid="MainPage">
                {rides && rides.length > 0 ? rides.map((ride) => {
                    return(
                        <RideCard ride={ride} />
                    )
                }): <VStack justify="center" align="center" gap="32" max>
                    <Text text="У вас ще немає жодної поїздки, Давайте Створимо!" />
                    <Button onClick={() => {
                        navigate(getRideCreate())
                    }}>До поїздок</Button>
                </VStack>}

            </Page>
        </DynamicModuleLoader>

    );
};

