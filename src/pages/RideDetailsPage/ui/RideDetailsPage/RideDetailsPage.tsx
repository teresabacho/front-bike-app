import React, { memo, useCallback, useEffect, useState } from 'react';
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
import { unApplyToRide } from '../../model/services/unApplyToRide';
import { rideDetailsActions, rideDetailsReducer } from '../../model/slice/rideDetails.slice';
import { Map } from '@/features/Map';
import { deleteRide } from '../../model/services/deleteRide/deleteRide';
import { getRouteMyRides } from '@/shared/const/router';
import { RideAdviceGPT } from '@/pages/RideDetailsPage/ui/RideDetailsPage/chatgpt';
import { WeatherWidget } from '@/pages/RideDetailsPage/ui/RideDetailsPage/weather';
import { formatDistance, formatDuration } from '@/helpers/helpers';
import { Input } from '@/shared/ui/redesigned/Input';
import { Modal } from '@/shared/ui/redesigned/Modal';
import { rideApplicationReducer } from '@/pages/TrainerApprovalPage/services/rideApplicationService';
import { applyToRide, fetchApplicationStatus } from '@/pages/RideDetailsPage/model/services/applyToRide';
import { BicycleSelector } from '@/pages/MyBikes/MyBikes';

const createGoogleCalendarUrl = (ride) => {
    if (!ride || !ride.date) return '';

    const startDate = new Date(ride.date);
    const endDate = new Date(startDate);
    if (ride.directions?.routes?.[0]?.legs?.[0]?.duration?.value) {
        const durationInMs = ride.directions.routes[0].legs[0].duration.value * 1000;
        endDate.setTime(startDate.getTime() + durationInMs);
    } else {
        endDate.setHours(endDate.getHours() + 2);
    }

    const startDateISO = startDate.toISOString().replace(/-|:|\.\d+/g, '');
    const endDateISO = endDate.toISOString().replace(/-|:|\.\d+/g, '');
    const title = encodeURIComponent(ride.title || 'Поїздка');
    let description = encodeURIComponent(ride.description || 'Деталі поїздки відсутні');
    if (ride.directions?.routes?.[0]?.legs?.[0]?.distance?.text) {
        description += encodeURIComponent('\n\nДистанція: ' + ride.directions.routes[0].legs[0].distance.text);
    }
    const location = ride.road_id ? encodeURIComponent('ID маршруту: ' + ride.road_id) : '';

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateISO}/${endDateISO}&details=${description}&location=${location}`;

    return googleCalendarUrl;
};

const ApplicationStatus = ({ status }: { status: string | null }) => {
    if (!status) return null;

    const getStatusText = () => {
        switch (status) {
            case 'pending':
                return 'Заявка на розгляді';
            case 'approved':
                return 'Заявка схвалена';
            case 'rejected':
                return 'Заявка відхилена';
            default:
                return '';
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'pending':
                return '#fbbf24';
            case 'approved':
                return '#10b981';
            case 'rejected':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    return (
        <Card padding="16" style={{ backgroundColor: getStatusColor(), color: 'white' }}>
            <Text title={getStatusText()} />
        </Card>
    );
};

const initialReducers: ReducersList = {
    RideDetailsSchema: rideDetailsReducer,
    RideApplicationSchema: rideApplicationReducer,
};

export const RideDetailsPage = memo(() => {
    const ride = useSelector((state: StateSchema) => state?.RideDetailsSchema?.ride);
    const applicationStatus = useSelector((state: StateSchema) => state?.RideApplicationSchema?.applicationStatus);
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [rideDate, setRideDate] = useState(new Date());
    const [weatherData, setWeatherData] = useState(null);
    const [showApplicationModal, setShowApplicationModal] = useState(false);
    const [applicationMessage, setApplicationMessage] = useState('');
    const [selectedBicycleId, setSelectedBicycleId] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            dispatch(fetchRideData(id));
            dispatch(fetchApplicationStatus(id));
        }
    }, [id, dispatch]);

    const road = useSelector((state: StateSchema) => state?.RideDetailsSchema?.road);
    const directions = useSelector((state: StateSchema) => state?.RideDetailsSchema?.directions);
    const isMapLoaded = useSelector((state: StateSchema) => state?.RideDetailsSchema?.isMapLoaded);

    useEffect(() => {
        if (ride) {
            setRideDate(new Date(ride.date));
        }
    }, [ride]);

    const buildRoute = useCallback(async () => {
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
    }, [road, dispatch]);

    const startLocation = road?.startMark?.location;

    useEffect(() => {
        dispatch(fetchRideData(id || ''));
    }, [id, dispatch]);

    useEffect(() => {
        if (ride?.road_id) {
            dispatch(fetchRoad(ride?.road_id || ''));
        }
    }, [ride?.road_id, dispatch]);

    useEffect(() => {
        if (isMapLoaded) {
            buildRoute();
        }
    }, [isMapLoaded, road, buildRoute]);

    const setWeatherDataForGpt = (data) => {
        setWeatherData(data);
    };

    const handleAddToCalendar = () => {
        const calendarUrl = createGoogleCalendarUrl({
            ...ride,
            directions
        });
        if (calendarUrl) {
            window.open(calendarUrl, '_blank');
        }
    };

    const handleJoinClick = () => {
        if (!id) return;

        if (!applicationStatus && ride?.createdByTrainer) {
            setShowApplicationModal(true);
        } else if (!ride?.isApplied && !applicationStatus) {
            if (ride?.price && !ride?.wasPaid) {
                navigate(`/payments?rideId=${id}&price=${ride?.price}`);
            } else {
                dispatch(applyToRide({ rideId: id }));
                dispatch(fetchRideData(id));
                dispatch(fetchApplicationStatus(id));

            }
        } else {
            dispatch(unApplyToRide(id));
        }
    };

    const handleSubmitApplication = () => {
        if (!id) return;

        dispatch(applyToRide({
            rideId: id,
            message: applicationMessage,
            bicycle_id: selectedBicycleId
        }));

        setShowApplicationModal(false);
        setApplicationMessage('');
        setSelectedBicycleId(null);

        dispatch(fetchRideData(id));
        dispatch(fetchApplicationStatus(id));
    };

    const getJoinButtonText = () => {
        if (applicationStatus) {
            switch (applicationStatus) {
                case 'pending':
                    return 'Заявка на розгляді';
                case 'approved':
                    return 'Ви схвалені!';
                case 'rejected':
                    return 'Заявка відхилена';
            }
        }

        if (!ride?.isApplied) {
            if (ride?.price && !ride?.wasPaid) {
                return 'Оплатити';
            } else {
                return 'Приєднатись';
            }
        } else {
            return 'Не приєднатись';
        }
    };

    const isJoinButtonDisabled = () => {
        return !!applicationStatus;
    };

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
                        onLoad={() => dispatch(rideDetailsActions.setIsMapLoaded(true))}
                    >
                        <Map
                            startMark={road?.startMark}
                            finishMark={road?.finishMark}
                            waypoints={road?.waypoints}
                            directions={directions}
                            mapContainerStyle={{
                                width: "300px",
                                height: "300px"
                            }}
                        />
                    </LoadScript>

                    <VStack align="center" max gap="16">
                        <ApplicationStatus status={applicationStatus} />

                        <HStack justify="center" gap="8" max>
                            <Text title="Назва" />
                            <Text title={ride?.title || 'інформація не вказана'} />
                        </HStack>
                        <HStack justify="center" gap="8" max>
                            <Text title="Опис" />
                            <Text title={ride?.description || 'інформація не вказана'} />
                        </HStack>
                        <HStack justify="center" gap="8" max>
                            <Text title="Ціна" />
                            <Text title={ride?.price || 'інформація не вказана'} />
                        </HStack>
                        <HStack justify="center" gap="8" max>
                            <Text title="Дата" />
                            <Text title={ride?.date || 'інформація не вказана'} />
                        </HStack>
                        <HStack justify="center" gap="8" max>
                            <Text title="Час" />
                            <Text title={formatDuration(ride?.duration) || 'інформація не вказана'} />
                        </HStack>
                        <HStack justify="center" gap="8" max>
                            <Text title="Дистанція" />
                            <Text title={formatDistance(ride?.distance) || 'інформація не вказана'} />
                        </HStack>
                        <HStack justify="center" gap="8" max>
                            <Text title="Число користувачів" />
                            <Text title={`${ride?.current_user_count?.toString()}/${ride?.user_count?.toString()}` || 'інформація не вказана'} />
                        </HStack>

                        {startLocation && (
                            <WeatherWidget
                                date={rideDate}
                                location={startLocation}
                                setWeatherDataForGpt={setWeatherDataForGpt}
                            />
                        )}

                        <RideAdviceGPT
                            ride={{
                                ...ride,
                                directions
                            }}
                            weatherData={weatherData}
                        />

                        <HStack justify="center" gap="8" max>
                            <Button
                                onClick={handleJoinClick}
                                disabled={isJoinButtonDisabled()}
                            >
                                {getJoinButtonText()}
                            </Button>

                            {directions?.routes[0].legs[0].duration?.text && (
                                <Button
                                    onClick={handleAddToCalendar}
                                    disabled={!ride?.date}
                                >
                                    Додати в Google Calendar
                                </Button>
                            )}

                            <Button onClick={() => {
                                navigate(`/ride/${ride?.id}/chat`)
                            }}>
                                Почати чат
                            </Button>

                            {ride?.canBeDeleted && (
                                <Button onClick={() => {
                                    dispatch(deleteRide(ride?.id));
                                    navigate(getRouteMyRides());
                                }}>
                                    Видалити
                                </Button>
                            )}
                        </HStack>
                    </VStack>
                </VStack>

                <Modal
                    isOpen={showApplicationModal}
                    onClose={() => {
                        setShowApplicationModal(false);
                        setApplicationMessage('');
                        setSelectedBicycleId(null);
                    }}
                >
                    <VStack gap="16" max>
                        <Text title="Подання заявки на поїздку" />
                        <Text text="Ця поїздка створена тренером. Заповніть форму для подачі заявки:" />

                        <BicycleSelector
                            selectedBicycleId={selectedBicycleId}
                            onBicycleSelect={setSelectedBicycleId}
                        />

                        <VStack gap="4" max>
                            <Text text="Повідомлення тренеру (необов'язково):" />
                            <textarea
                                value={applicationMessage}
                                onChange={(e) => setApplicationMessage(e.target.value)}
                                placeholder="Розкажіть про свій досвід, мотивацію та готовність до поїздки..."
                                className="w-full p-3 border rounded h-24 resize-none"
                            />
                        </VStack>

                        <HStack gap="8" justify="end" max>
                            <Button
                                onClick={() => {
                                    setShowApplicationModal(false);
                                    setApplicationMessage('');
                                    setSelectedBicycleId(null);
                                }}
                                variant="outline"
                            >
                                Скасувати
                            </Button>
                            <Button onClick={handleSubmitApplication}>
                                Подати заявку
                            </Button>
                        </HStack>
                    </VStack>
                </Modal>
            </Card>
        </DynamicModuleLoader>
    );
});
