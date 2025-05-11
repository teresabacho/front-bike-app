import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Page } from '@/widgets/Page';
import { Card } from '@/shared/ui/redesigned/Card';
import { Text } from '@/shared/ui/redesigned/Text';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';
import { Button } from '@/shared/ui/redesigned/Button';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
    ScatterChart, Scatter, ZAxis
} from 'recharts';
import { getAllRides, getRideAnalytics, getMyRides } from '@/pages/MainPage/ui/rideService';
import { useSelector } from 'react-redux';
import { getUserAuthData } from '@/entities/User';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours} год ${mins} хв` : `${mins} хв`;
};

const formatDistance = (km) => `${km} км`;

const MainPage = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [timePeriod, setTimePeriod] = useState('all');
    const [userFilter, setUserFilter] = useState('all');
    const userData = useSelector(getUserAuthData);

    const [analyticsData, setAnalyticsData] = useState({
        distanceTimeData: [],
        popularityData: [],
        priceDistributionData: [],
        speedByDistanceData: [],
        timeDistributionData: [],
        totalRidesStats: {}
    });

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);

            let rides = [];

            if (userFilter === 'my' && userData) {
                rides = await getMyRides();
            } else {
                rides = await getAllRides();
            }

            if (timePeriod === 'month') {
                const lastMonth = new Date();
                lastMonth.setMonth(lastMonth.getMonth() - 1);
                const today = new Date();

                rides = rides.filter(ride => {
                    if (!ride.date) return false;

                    const rideDate = new Date(ride.date);
                    return rideDate >= lastMonth && rideDate <= today;
                });
            }

            const data = processDataForCharts(rides);

            setAnalyticsData(data);
            setLoading(false);
        };

        fetchAnalytics();
    }, [timePeriod, userFilter, userData]);

    const processDataForCharts = (rides) => {
        console.log(rides);
        const today = new Date();
        today.setHours(0, 0, 0, 0)
        console.log('hello');
        const totalRidesStats = {
            total: rides.length,
            completed: rides.filter(ride => {
                console.log("ride");
                console.log(ride.date);
                if (!ride.date) return false;
                const rideDate = new Date(ride.date);
                return rideDate < today;
            }).length,
            active: rides.filter(ride => {
                if (!ride.date) return false;
                const rideDate = new Date(ride.date);
                rideDate.setHours(0, 0, 0, 0);
                return rideDate.getTime() === today.getTime();
            }).length,
            upcoming: rides.filter(ride => {
                if (!ride.date) return false;
                const rideDate = new Date(ride.date);
                return rideDate > today;
            }).length
        };

        const distanceTimeData = rides.map(ride => ({
            id: ride.id,
            title: ride.title?.length > 20 ? ride.title.substring(0, 20) + '...' : ride.title,
            distance: ride.distance / 1000,
            duration: ride.duration / 60,
            speed: ((ride.distance / 1000) / (ride.duration / 3600)).toFixed(2)
        }));

        const popularityData = rides.map(ride => ({
            id: ride.id,
            title: ride.title?.length > 15 ? ride.title.substring(0, 15) + '...' : ride.title,
            maxUsers: ride.user_count,
            currentUsers: ride.current_user_count || 0,
            fillPercentage: Math.round(((ride.current_user_count || 0) / ride.user_count) * 100)
        }));

        const priceRanges = {
            'Безкоштовно': 0,
            'До 100 грн': 0,
            '100-200 грн': 0,
            '200-300 грн': 0,
            'Більше 300 грн': 0
        };

        rides.forEach(ride => {
            if (ride.price === 0) {
                priceRanges['Безкоштовно']++;
            } else if (ride.price <= 100) {
                priceRanges['До 100 грн']++;
            } else if (ride.price <= 200) {
                priceRanges['100-200 грн']++;
            } else if (ride.price <= 300) {
                priceRanges['200-300 грн']++;
            } else {
                priceRanges['Більше 300 грн']++;
            }
        });

        const priceDistributionData = Object.entries(priceRanges).map(([range, count]) => ({
            range,
            count,
            percentage: rides.length ? Math.round((count / rides.length) * 100) : 0
        }));

        const distanceRanges = {
            '0-5 км': { rides: [], avgSpeed: 0 },
            '5-10 км': { rides: [], avgSpeed: 0 },
            '10-20 км': { rides: [], avgSpeed: 0 },
            '20+ км': { rides: [], avgSpeed: 0 }
        };

        rides.forEach(ride => {
            const distanceKm = ride.distance / 1000;
            const speed = (distanceKm / (ride.duration / 3600));

            if (distanceKm <= 5) {
                distanceRanges['0-5 км'].rides.push(speed);
            } else if (distanceKm <= 10) {
                distanceRanges['5-10 км'].rides.push(speed);
            } else if (distanceKm <= 20) {
                distanceRanges['10-20 км'].rides.push(speed);
            } else {
                distanceRanges['20+ км'].rides.push(speed);
            }
        });

        const speedByDistanceData = [];
        for (const [range, data] of Object.entries(distanceRanges)) {
            if (data.rides.length > 0) {
                const totalSpeed = data.rides.reduce((sum, speed) => sum + speed, 0);
                data.avgSpeed = parseFloat((totalSpeed / data.rides.length).toFixed(2));
                speedByDistanceData.push({
                    range,
                    avgSpeed: data.avgSpeed,
                    rideCount: data.rides.length
                });
            } else {
                speedByDistanceData.push({
                    range,
                    avgSpeed: 0,
                    rideCount: 0
                });
            }
        }

        const timeDistributionData = [
            { timeRange: 'Ранок (6:00-10:00)', count: 0 },
            { timeRange: 'День (10:00-16:00)', count: 0 },
            { timeRange: 'Вечір (16:00-21:00)', count: 0 },
            { timeRange: 'Ніч (21:00-6:00)', count: 0 }
        ];

        rides.forEach(ride => {
            if (!ride.date) return;

            const rideDate = new Date(ride.date);
            const hour = rideDate.getHours();

            if (hour >= 6 && hour < 10) {
                timeDistributionData[0].count++;
            } else if (hour >= 10 && hour < 16) {
                timeDistributionData[1].count++;
            } else if (hour >= 16 && hour < 21) {
                timeDistributionData[2].count++;
            } else {
                timeDistributionData[3].count++;
            }
        });

        return {
            totalRidesStats,
            distanceTimeData,
            popularityData,
            priceDistributionData,
            speedByDistanceData,
            timeDistributionData
        };
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Card padding="8" border="round">
                    <VStack gap="4">
                        <Text title={payload[0].payload.title} size="s" />
                        <Text text={`Відстань: ${formatDistance(payload[0].payload.distance)}`} />
                        <Text text={`Час: ${formatDuration(payload[0].payload.duration)}`} />
                        <Text text={`Швидкість: ${payload[0].payload.speed} км/год`} />
                    </VStack>
                </Card>
            );
        }
        return null;
    }

    const handleTimePeriodChange = (period) => {
        setTimePeriod(period);
    };

    const handleUserFilterChange = (filter) => {
        setUserFilter(filter);
    };

    const RidesStatistics = ({ stats }) => {
        return (
            <Card padding="16">
                <VStack gap="16" max>
                    <Text title={t('Загальна статистика поїздок')} />
                    <HStack gap="16" max>
                        <Card padding="16" border="round">
                            <VStack gap="8" align="center">
                                <Text title={stats.total || '0'} size="l" />
                                <Text text={t('Всього поїздок')} />
                            </VStack>
                        </Card>
                        <Card padding="16" border="round">
                            <VStack gap="8" align="center">
                                <Text title={stats.active|| '0'} size="l" />
                                <Text text={t('Активні')} />
                            </VStack>
                        </Card>
                        <Card padding="16" border="round">
                            <VStack gap="8" align="center">
                                <Text title={stats.completed|| '0'} size='l' />
                                <Text text={t('Завершені')} />
                            </VStack>
                        </Card>
                        <Card padding="16" border="round">
                            <VStack gap="8" align="center">
                                <Text title={stats.upcoming || '0'} size='l' />
                                <Text text={t('Заплановані')} />
                            </VStack>
                        </Card>
                    </HStack>
                </VStack>
            </Card>
        );
    };

    return (
        <Page data-testid="MainPage">
            <VStack gap="16" max>
                <Text title={t('Аналітика поїздок')} size="l" bold />

                {/* Фільтри та елементи управління */}
                <HStack gap="16" max>
                    {/* Фільтр часового періоду */}
                    <Card padding="8">
                        <HStack gap="8">
                            <Text text={t('Період:')} />
                            <Button
                                onClick={() => handleTimePeriodChange('all')}
                                variant={timePeriod === 'all' ? 'filled' : 'outline'}
                            >
                                {t('За весь час')}
                            </Button>
                            <Button
                                onClick={() => handleTimePeriodChange('month')}
                                variant={timePeriod === 'month' ? 'filled' : 'outline'}
                            >
                                {t('За останній місяць')}
                            </Button>
                        </HStack>
                    </Card>

                    {/* Фільтр поїздок користувача (показується тільки якщо користувач залогований) */}
                    {userData && (
                        <Card padding="8">
                            <HStack gap="8">
                                <Text text={t('Поїздки:')} />
                                <Button
                                    onClick={() => handleUserFilterChange('all')}
                                    variant={userFilter === 'all' ? 'filled' : 'outline'}
                                >
                                    {t('Всі поїздки')}
                                </Button>
                                <Button
                                    onClick={() => handleUserFilterChange('my')}
                                    variant={userFilter === 'my' ? 'filled' : 'outline'}
                                >
                                    {t('Мої поїздки')}
                                </Button>
                            </HStack>
                        </Card>
                    )}
                </HStack>

                {loading ? (
                    <Text text={t('Завантаження даних...')} />
                ) : (
                    <VStack gap="32" max>
                        {/* Загальна статистика поїздок */}
                        <RidesStatistics stats={analyticsData.totalRidesStats} />

                        {/* Графік 1: Співвідношення відстані до часу */}
                        <VStack max>
                            <Text title={t('Співвідношення відстані та часу поїздок')} />
                            <ResponsiveContainer width="100%" height={500}>
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                    <CartesianGrid />
                                    <XAxis
                                        type="number"
                                        dataKey="distance"
                                        name="Відстань"
                                        unit=" км"
                                        label={{ value: 'Відстань (км)', position: 'bottom'}}
                                    />
                                    <YAxis
                                        type="number"
                                        dataKey="duration"
                                        name="Час"
                                        unit=" хв"
                                        label={{ value: 'Час (хв)', angle: -90, position: 'left'}}
                                    />
                                    <ZAxis type="number" dataKey="speed" range={[100, 1000]} name="Швидкість" unit=" км/год" />
                                    <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                                    <Legend verticalAlign={'top'} height={30} />
                                    <Scatter name="Поїздки" data={analyticsData.distanceTimeData} fill="#8884d8" />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </VStack>

                        {/* Графік 2: Заповненість груп */}
                        <VStack gap="16" max>
                            <Text title={t('Популярність маршрутів (Заповненість груп)')} />
                            <ResponsiveContainer width="100%" height={450}>
                                <BarChart
                                    data={analyticsData.popularityData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="title"
                                        angle={-45}
                                        textAnchor="end"
                                        height={60}
                                    />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend verticalAlign={'top'} />
                                    <Bar dataKey="currentUsers" name="Поточна кількість" fill="#8884d8"  />
                                    <Bar dataKey="maxUsers" name="Максимальна кількість" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </VStack>

                        <HStack max gap="16">
                            {/* Графік 3: Розподіл поїздок за ціною */}
                            <VStack gap="16" max>
                                <Text title={t('Розподіл за ціною')} />
                                <ResponsiveContainer width="100%" height={450}>
                                    <PieChart>
                                        <Pie
                                            data={analyticsData.priceDistributionData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={true}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="count"
                                            nameKey="range"
                                        >
                                            {analyticsData.priceDistributionData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </VStack>

                            {/* Графік 4: Середня швидкість за відстанню */}
                            <VStack gap="16" max>
                                <Text title={t('Швидкість за відстанню')} />
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart
                                        data={analyticsData.speedByDistanceData}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="range" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="avgSpeed" name="Середня швидкість (км/год)" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </VStack>
                        </HStack>

                        {/* Графік 5: Розподіл поїздок за часом доби */}
                        <VStack gap="16" max>
                            <Text title={t('Розподіл поїздок за часом доби')} />
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart
                                    data={analyticsData.timeDistributionData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="timeRange" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="count" name="Кількість поїздок" stroke="#8884d8" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </VStack>
                    </VStack>
                )}
            </VStack>
        </Page>
    );
};

export default MainPage;
