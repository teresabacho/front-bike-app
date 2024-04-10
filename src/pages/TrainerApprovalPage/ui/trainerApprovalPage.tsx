import React, { memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { VStack, HStack } from '@/shared/ui/redesigned/Stack';
import { Text } from '@/shared/ui/redesigned/Text';
import { Card } from '@/shared/ui/redesigned/Card';
import { Button } from '@/shared/ui/redesigned/Button';
import { Input } from '@/shared/ui/redesigned/Input';
import { Modal } from '@/shared/ui/redesigned/Modal';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { StateSchema } from '@/app/providers/StoreProvider';
import { classNames } from '@/shared/lib/classNames/classNames';
import { fetchTrainerApplications, handleRideApplication } from '@/pages/RideDetailsPage/model/services/applyToRide';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { rideDetailsReducer } from '@/pages/RideDetailsPage/model/slice/rideDetails.slice';
import { rideApplicationReducer } from '@/pages/TrainerApprovalPage/services/rideApplicationService';

interface RideApplication {
    id: string;
    user_id: string;
    ride_id: string;
    bicycle_id: string;
    status: 'pending' | 'approved' | 'rejected';
    message?: string;
    trainer_notes?: string;
    created_at: string;
    user: {
        id: string;
        username: string;
        first: string;
        lastname: string;
        avatar?: string;
        role?: string;
    };
    ride: {
        id: string;
        title: string;
        date: string;
        distance?: number;
        duration?: number;
    };
    bicycle: {
        id: string;
        name: string;
        type: string;
        brand: string;
        model: string;
        color: string;
    };
    userStats: {
        totalRides: number;
        joinedRides: number;
        createdRides: number;
        totalDistance: number;
        avgDistance: number;
        totalDuration: number;
        avgDuration: number;
        level: number;
        experience?: number;
        experienceCategory?: string;
        joinedDistance?: number;
        joinedDuration?: number;
        createdDistance?: number;
        createdDuration?: number;
    };
}

interface TrainerApplicationsPageProps {
    className?: string;
}

export const TrainerApplicationsPage = () => {
    const [applications, setApplications] = useState<RideApplication[]>([]);
    const [selectedApplication, setSelectedApplication] = useState<RideApplication | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [trainerNotes, setTrainerNotes] = useState('');
    const [actionType, setActionType] = useState<'approved' | 'rejected'>('approved');

    const dispatch = useAppDispatch();
    const trainerApplications = useSelector((state: StateSchema) => state?.RideApplicationSchema?.trainerApplications);
    const isLoading = useSelector((state: StateSchema) => state?.RideApplicationSchema?.isLoading);
    console.log(isLoading);

    useEffect(() => {
        dispatch(fetchTrainerApplications());
    }, [dispatch]);
    console.log(trainerApplications);
    useEffect(() => {
        setApplications(trainerApplications || []);
    }, [trainerApplications]);

    const handleApplication = (applicationId: string, status: 'approved' | 'rejected', notes?: string) => {
        dispatch(handleRideApplication({
            applicationId,
            status,
            trainer_notes: notes,
        })).then(() => {
            setShowModal(false);
            setSelectedApplication(null);
            setTrainerNotes('');
        });
    };

    const openModal = (application: RideApplication, action: 'approved' | 'rejected') => {
        setSelectedApplication(application);
        setActionType(action);
        setShowModal(true);
    };

    const handleConfirmAction = () => {
        if (selectedApplication) {
            handleApplication(selectedApplication.id, actionType, trainerNotes);
        }
    };

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            pending: '#fbbf24',
            approved: '#10b981',
            rejected: '#ef4444',
        };

        const texts: Record<string, string> = {
            pending: 'На розгляді',
            approved: 'Схвалено',
            rejected: 'Відхилено',
        };

        return (
            <div
                style={{
                    backgroundColor: colors[status] || '#6b7280',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                }}
            >
                {texts[status] || status}
            </div>
        );
    };

    const getBicycleTypeText = (type: string) => {
        const types: Record<string, string> = {
            bmx: 'BMX',
            mountain: 'Гірський',
            road: 'Шосейний',
            hybrid: 'Гібрідний',
            electric: 'Електричний',
            touring: 'Туристичний',
            gravel: 'Гравійний',
        };
        return types[type] || type;
    };

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return `${hours}г ${minutes}хв`;
        }
        return `${minutes}хв`;
    };

    const pendingApplications = applications.filter(app => app?.status === 'pending');
    const processedApplications = applications.filter(app => app?.status !== 'pending');

    if (isLoading) {
        return (
            <Card padding="24" max>
                <Text title="Завантаження заявок..." />
            </Card>
        );
    }

    const initialReducers: ReducersList = {
        RideDetailsSchema: rideDetailsReducer,
        RideApplicationSchema: rideApplicationReducer,
    };

    return (
        <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
            <div>
                <VStack gap="24" max>
                    <Text title="Управління заявками на поїздки" size="l" />

                    {/* Нові заявки */}
                    {pendingApplications.length > 0 && (
                        <VStack gap="16" max>
                            <Text title="Нові заявки" size="l" />
                            {pendingApplications.map((application) => (
                                <Card key={application?.id} padding="16" max>
                                    <VStack gap="12" max>
                                        <HStack justify="between" max>
                                            <VStack gap="4">
                                                <Text
                                                    title={`${application?.user?.first || ''} ${application?.user?.lastname || ''} (@${application?.user?.username || 'Unknown'})`}
                                                    size="m"
                                                />
                                                <Text
                                                    text={`Поїздка: ${application?.ride?.title || 'Невідома поїздка'}`}
                                                    size="s"
                                                />
                                                <Text
                                                    text={`Дата поїздки: ${application?.ride?.date ? new Date(application.ride.date).toLocaleDateString() : 'Дата не вказана'}`}
                                                    size="s"
                                                />

                                                {/* Інформація про велосипед */}
                                                {application?.bicycle && (
                                                    <Card padding="8" variant="light" style={{ backgroundColor: '#e0f2fe' }}>
                                                        <VStack gap="2">
                                                            <Text
                                                                text={`🚴 Велосипед: ${application.bicycle.name}`}
                                                                size="s"
                                                                weight="bold"
                                                            />
                                                            <HStack gap="12">
                                                                <Text
                                                                    text={`${getBicycleTypeText(application.bicycle.type)}`}
                                                                    size="s"
                                                                    style={{ color: '#0277bd' }}
                                                                />
                                                                <Text
                                                                    text={`${application.bicycle.brand }   ${application.bicycle.model}`}
                                                                    size="s"
                                                                />
                                                                <Text
                                                                    text={application.bicycle.color }
                                                                    size="s"
                                                                    style={{ color: '#424242' }}
                                                                />
                                                            </HStack>
                                                        </VStack>
                                                    </Card>
                                                )}

                                                {/* Статистика користувача */}
                                                <Card padding="8" variant="light"
                                                      style={{ backgroundColor: '#f8f9fa' }}>
                                                    <VStack gap="2">
                                                        <HStack gap="16">
                                                            <Text
                                                                text={`${application?.userStats?.totalRides || 0} поїздок`}
                                                                size="s"
                                                            />
                                                            <Text
                                                                text={`${Math.round((application?.userStats?.totalDistance || 0) / 1000)} км`}
                                                                size="s"
                                                            />
                                                            <Text
                                                                text={`Сер.: ${Math.round((application?.userStats?.avgDistance || 0) / 1000)} км`}
                                                                size="s"
                                                            />
                                                            <Text
                                                                text={`Рівень: ${application?.userStats?.level || 0}`}
                                                                size="s"
                                                                style={{ color: '#7c3aed' }}
                                                            />
                                                        </HStack>
                                                        <HStack gap="16">
                                                            <Text
                                                                text={`Приєднався: ${application?.userStats?.joinedRides || 0}`}
                                                                size="s"
                                                                style={{ color: '#059669' }}
                                                            />
                                                            <Text
                                                                text={`Створив: ${application?.userStats?.createdRides || 0}`}
                                                                size="s"
                                                                style={{ color: '#dc2626' }}
                                                            />
                                                            {application?.userStats?.totalDuration && (
                                                                <Text
                                                                    text={`Загальний час: ${formatDuration(application.userStats.totalDuration)}`}
                                                                    size="s"
                                                                    style={{ color: '#6366f1' }}
                                                                />
                                                            )}
                                                        </HStack>
                                                    </VStack>
                                                </Card>
                                            </VStack>
                                            {getStatusBadge(application?.status || 'unknown')}
                                        </HStack>

                                        {application?.message && (
                                            <VStack gap="4" max>
                                                <Text text="Повідомлення від користувача:" size="s" weight="bold" />
                                                <Card padding="12" variant="light">
                                                    <Text text={application.message} />
                                                </Card>
                                            </VStack>
                                        )}

                                        <HStack gap="8" justify="end">
                                            <Button
                                                onClick={() => openModal(application, 'rejected')}
                                                variant="outline"
                                                color="error"
                                            >
                                                Відхилити
                                            </Button>
                                            <Button
                                                onClick={() => openModal(application, 'approved')}
                                                color="success"
                                            >
                                                Схвалити
                                            </Button>
                                        </HStack>
                                    </VStack>
                                </Card>
                            ))}
                        </VStack>
                    )}

                    {/* Оброблені заявки */}
                    {processedApplications.length > 0 && (
                        <VStack gap="16" max>
                            <Text title="Оброблені заявки" size="l" />
                            {processedApplications.map((application) => (
                                <Card key={application?.id} padding="16" max variant="light">
                                    <VStack gap="12" max>
                                        <HStack justify="between" max>
                                            <VStack gap="4">
                                                <Text
                                                    title={`${application?.user?.first || ''} ${application?.user?.lastname || ''} (@${application?.user?.username || 'Unknown'})`}
                                                    size="m"
                                                />
                                                <Text
                                                    text={`Поїздка: ${application?.ride?.title || 'Невідома поїздка'}`}
                                                    size="s"
                                                />

                                                {/* Компактна інформація про велосипед */}
                                                {application?.bicycle && (
                                                    <HStack gap="8">
                                                        <Text
                                                            text={`🚴 ${application.bicycle.name}`}
                                                            size="xs"
                                                            style={{ color: '#0277bd' }}
                                                        />
                                                        <Text
                                                            text={`${getBicycleTypeText(application.bicycle.type)}`}
                                                            size="xs"
                                                            style={{ color: '#6b7280' }}
                                                        />
                                                    </HStack>
                                                )}

                                                {/* Компактна статистика для оброблених заявок */}
                                                <HStack gap="8">
                                                    <Text
                                                        text={`${application?.userStats?.totalRides || 0} поїздок`}
                                                        size="xs"
                                                        style={{ color: '#6b7280' }}
                                                    />
                                                    <Text
                                                        text={`${Math.round((application?.userStats?.totalDistance || 0) / 1000)} км`}
                                                        size="xs"
                                                        style={{ color: '#6b7280' }}
                                                    />
                                                    <Text
                                                        text={`Рівень: ${application?.userStats?.level || 0}`}
                                                        size="xs"
                                                        style={{ color: '#7c3aed' }}
                                                    />
                                                </HStack>
                                            </VStack>
                                            {getStatusBadge(application?.status || 'unknown')}
                                        </HStack>

                                        {application?.trainer_notes && (
                                            <VStack gap="4" max>
                                                <Text text="Ваші нотатки:" size="s" weight="bold" />
                                                <Card padding="12" variant="light">
                                                    <Text text={application.trainer_notes} />
                                                </Card>
                                            </VStack>
                                        )}
                                    </VStack>
                                </Card>
                            ))}
                        </VStack>
                    )}

                    {applications.length === 0 && (
                        <Card padding="24" max>
                            <Text title="Заявок поки немає" align="center" />
                        </Card>
                    )}
                </VStack>

                {/* Модальне вікно підтвердження */}
                <Modal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                >
                    <VStack gap="16" max>
                        <Text
                            title={actionType === 'approved' ? 'Схвалити заявку' : 'Відхилити заявку'}
                            size="l"
                        />

                        {selectedApplication && (
                            <VStack gap="8" max>
                                <Text
                                    text={`Користувач: ${selectedApplication?.user?.username || 'Unknown'}`}
                                />
                                <Text
                                    text={`Поїздка: ${selectedApplication?.ride?.title || 'Невідома поїздка'}`}
                                />

                                {/* Інформація про велосипед в модальному вікні */}
                                {selectedApplication?.bicycle && (
                                    <Card padding="12" variant="light" style={{ backgroundColor: '#e0f2fe' }}>
                                        <VStack gap="4">
                                            <Text
                                                text={`Велосипед: ${selectedApplication.bicycle.name}`}
                                                weight="bold"
                                            />
                                            <HStack gap="12">
                                                <Text
                                                    text={getBicycleTypeText(selectedApplication.bicycle.type)}
                                                    style={{ color: '#0277bd' }}
                                                />
                                                <Text
                                                    text={`${selectedApplication.bicycle.brand} ${selectedApplication.bicycle.model}`}
                                                />
                                                <Text
                                                    text={selectedApplication.bicycle.color}
                                                    style={{ color: '#424242' }}
                                                />
                                            </HStack>
                                        </VStack>
                                    </Card>
                                )}

                                {selectedApplication?.message && (
                                    <VStack gap="4" max>
                                        <Text text="Повідомлення від користувача:" weight="bold" />
                                        <Card padding="12" variant="light">
                                            <Text text={selectedApplication.message} />
                                        </Card>
                                    </VStack>
                                )}
                            </VStack>
                        )}

                        <VStack gap="8" max>
                            <Text text="Додати коментар (опціонально):" />
                            <Input
                                value={trainerNotes}
                                onChange={setTrainerNotes}
                                placeholder={
                                    actionType === 'approved'
                                        ? 'Наприклад: Ласкаво просимо в поїздку!'
                                        : 'Наприклад: Потрібен більший досвід'
                                }
                                multiline
                                rows={3}
                            />
                        </VStack>

                        <HStack gap="8" justify="end" max>
                            <Button onClick={() => setShowModal(false)}>
                                Скасувати
                            </Button>
                            <Button
                                onClick={handleConfirmAction}
                                color={actionType === 'approved' ? 'success' : 'error'}
                            >
                                {actionType === 'approved' ? 'Схвалити' : 'Відхилити'}
                            </Button>
                        </HStack>
                    </VStack>
                </Modal>
            </div>

        </DynamicModuleLoader>
    );
}
