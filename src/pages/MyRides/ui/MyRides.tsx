import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Page } from '@/widgets/Page';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { fetchRides } from '../model/services/fetchRides';
import { StateSchema } from '@/app/providers/StoreProvider';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { myRidesReducer } from '../model/slice/MyRides.slice';
import { RideCard } from './rideCard';
import { Text } from "@/shared/ui/redesigned/Text";
import { Button } from "@/shared/ui/redesigned/Button";
import { getRideCreate } from "@/shared/const/router";
import { VStack, HStack } from "@/shared/ui/redesigned/Stack";

interface FilterState {
    timeFilter: 'all' | 'past' | 'future';
    sortBy: 'date' | 'distance' | 'duration' | 'time';
    sortOrder: 'asc' | 'desc';
}

export const MyRides = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const rides = useSelector((state: StateSchema) => state.myRideSchema?.rides);

    const [filters, setFilters] = useState<FilterState>({
        timeFilter: 'all',
        sortBy: 'date',
        sortOrder: 'desc'
    });

    useEffect(() => {
        dispatch(fetchRides())
    }, [dispatch]);

    const filteredAndSortedRides = useMemo(() => {
        if (!rides) return [];

        let filtered = [...rides];
        const now = new Date();

        if (filters.timeFilter === 'past') {
            filtered = filtered.filter(ride => {
                const rideDate = new Date(ride.date);
                return rideDate < now;
            });
        } else if (filters.timeFilter === 'future') {
            filtered = filtered.filter(ride => {
                const rideDate = new Date(ride.date);
                return rideDate >= now;
            });
        }

        filtered.sort((a, b) => {
            let comparison = 0;

            switch (filters.sortBy) {
                case 'date':
                    comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
                    break;
                case 'distance':
                    comparison = (a.distance || 0) - (b.distance || 0);
                    break;
                case 'duration':
                    comparison = (a.duration || 0) - (b.duration || 0);
                    break;
                case 'time':
                    const timeA = new Date(a.date).getHours() * 60 + new Date(a.date).getMinutes();
                    const timeB = new Date(b.date).getHours() * 60 + new Date(b.date).getMinutes();
                    comparison = timeA - timeB;
                    break;
                default:
                    break;
            }

            return filters.sortOrder === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [rides, filters]);

    const initialReducers: ReducersList = {
        myRideSchema: myRidesReducer,
    };

    const timeFilterOptions = [
        { value: 'all', label: 'Всі' },
        { value: 'past', label: 'Минулі' },
        { value: 'future', label: 'Майбутні' }
    ];

    const sortByOptions = [
        { value: 'date', label: 'Дата' },
        { value: 'distance', label: 'Довжина' },
        { value: 'duration', label: 'Тривалість' },
        { value: 'time', label: 'Час дня' }
    ];

    const sortOrderOptions = [
        { value: 'desc', label: '↓' },
        { value: 'asc', label: '↑' }
    ];

    return (
        <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
            <Page data-testid="MainPage">
                <VStack gap="16" max>
                    <VStack gap="12">
                        <VStack gap="8">
                            <Text text="Фільтр за часом:" size="s" />
                            <HStack gap="8">
                                {timeFilterOptions.map((option) => (
                                    <Button
                                        key={option.value}
                                        variant={filters.timeFilter === option.value ? "filled" : "outline"}
                                        size="s"
                                        onClick={() => setFilters(prev => ({ ...prev, timeFilter: option.value as FilterState['timeFilter'] }))}
                                    >
                                        {option.label}
                                    </Button>
                                ))}
                            </HStack>
                        </VStack>

                        <VStack gap="8">
                            <Text text="Сортувати за:" size="s" />
                            <HStack gap="8" wrap="wrap">
                                {sortByOptions.map((option) => (
                                    <Button
                                        key={option.value}
                                        variant={filters.sortBy === option.value ? "filled" : "outline"}
                                        size="s"
                                        onClick={() => setFilters(prev => ({ ...prev, sortBy: option.value as FilterState['sortBy'] }))}
                                    >
                                        {option.label}
                                    </Button>
                                ))}

                                {sortOrderOptions.map((option) => (
                                    <Button
                                        key={option.value}
                                        variant={filters.sortOrder === option.value ? "filled" : "outline"}
                                        size="s"
                                        onClick={() => setFilters(prev => ({ ...prev, sortOrder: option.value as FilterState['sortOrder'] }))}
                                    >
                                        {option.label}
                                    </Button>
                                ))}
                            </HStack>
                        </VStack>
                    </VStack>

                    {filteredAndSortedRides && filteredAndSortedRides.length > 0 ? (
                        <VStack gap="16">
                            {filteredAndSortedRides.map((ride) => (
                                <RideCard key={ride.id} ride={ride} />
                            ))}
                        </VStack>
                    ) : (
                        <VStack justify="center" align="center" gap="32" max>
                            <Text text={
                                filters.timeFilter === 'all'
                                    ? "У вас ще немає жодної поїздки, Давайте Створимо!"
                                    : `Немає поїздок за обраними фільтрами`
                            } />
                            <Button onClick={() => navigate(getRideCreate())}>
                                До поїздок
                            </Button>
                        </VStack>
                    )}
                </VStack>
            </Page>
        </DynamicModuleLoader>
    );
};
