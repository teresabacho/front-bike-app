import React, { useState, useEffect } from 'react';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';
import { Text } from '@/shared/ui/redesigned/Text';
import { Card } from '@/shared/ui/redesigned/Card';
import cls from './WeatherWidget.module.scss';
import { Skeleton } from '@/shared/ui/redesigned/Skeleton';

const WEATHERAPI_KEY = 'fec08b86c56b4f34b4b150551252203';

export const WeatherWidget = ({ date, location, setWeatherDataForGpt }) => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const validLocation = location

    useEffect(() => {
        if (!validLocation) return;

        const fetchWeather = async () => {
            try {
                setLoading(true);

                const formattedDate = date.toISOString().split('T')[0];

                const response = await fetch(
                    `https://api.weatherapi.com/v1/forecast.json?key=${WEATHERAPI_KEY}&q=${location}&days=3&dt=${formattedDate}&lang=uk&aqi=yes`
                );

                if (!response.ok) {
                    throw new Error('Не вдалось синхронізувати погоду');
                }

                const data = await response.json();
                setWeatherData(data);
                setWeatherDataForGpt(data);
                setLoading(false);
            } catch (err) {
                console.error('Не вдалось синхронізувати погоду:', err);
                setError('Не вдалося завантажити прогноз погоди');
                setLoading(false);
            }
        };

        fetchWeather();
    }, [date, validLocation, location]);

    if (loading) {
        return (
            <Card padding="16" className={cls.weatherCard}>
                <Skeleton width="100%" height={120} />
            </Card>
        );
    }

    if (error) {
        return (
            <Card padding="16" className={cls.weatherCard}>
                <Text text={error} variant="error" />
            </Card>
        );
    }

    if (!weatherData || !weatherData.forecast || !weatherData.forecast.forecastday || weatherData.forecast.forecastday.length === 0) {
        return (
            <Card padding="16" className={cls.weatherCard}>
                <Text text="Інформація про погоду недоступна" />
            </Card>
        );
    }

    const forecast = weatherData.forecast.forecastday[0];
    const dayForecast = forecast.day;
    const hoursForecast = forecast.hour;

    const filteredHours = hoursForecast.filter((_, index) => index % 3 === 0);

    return (
        <Card padding="16" className={cls.weatherCard}>
            <VStack gap="8">
                <HStack justify="between" max>
                    <Text title="Прогноз погоди" bold />
                    <Text text={forecast.date} />
                </HStack>

                <HStack gap="16" align="center">
                    <img
                        src={`https:${dayForecast.condition.icon}`}
                        alt={dayForecast.condition.text}
                        width={64}
                        height={64}
                    />
                    <VStack>
                        <Text title={`${Math.round(dayForecast.avgtemp_c)}°C`} size="l" />
                        <Text text={dayForecast.condition.text} />
                        <Text text={`Мін: ${Math.round(dayForecast.mintemp_c)}°C / Макс: ${Math.round(dayForecast.maxtemp_c)}°C`} />
                    </VStack>
                </HStack>

                <HStack gap="16" max className={cls.weatherDetails}>
                    <VStack>
                        <Text text="Вологість" />
                        <Text title={`${dayForecast.avghumidity}%`} />
                    </VStack>
                    <VStack>
                        <Text text="Вітер" />
                        <Text title={`${Math.round(dayForecast.maxwind_kph)} км/год`} />
                    </VStack>
                    <VStack>
                        <Text text="Опади" />
                        <Text title={`${dayForecast.totalprecip_mm} мм`} />
                    </VStack>
                </HStack>

                <VStack gap="8">
                    <Text text="Додаткова інформація:" />
                    <HStack gap="16" max>
                        <Text text={`УФ-індекс: ${dayForecast.uv}`} />
                        <Text text={`Видимість: ${dayForecast.avgvis_km} км`} />
                        {weatherData.forecast.forecastday[0].astro && (
                            <Text text={`Схід сонця: ${weatherData.forecast.forecastday[0].astro.sunrise}`} />
                        )}
                    </HStack>
                </VStack>

                <VStack gap="8">
                    <Text text="Погодинний прогноз:" />
                    <HStack gap="8" className={cls.hourlyForecast}>
                        {filteredHours.map((hour) => (
                            <Card key={hour.time} padding="8" className={cls.hourCard}>
                                <VStack gap="4" align="center">
                                    <Text text={hour.time.split(' ')[1]} />
                                    <img
                                        src={`https:${hour.condition.icon}`}
                                        alt={hour.condition.text}
                                        width={32}
                                        height={32}
                                    />
                                    <Text text={`${Math.round(hour.temp_c)}°C`} />
                                </VStack>
                            </Card>
                        ))}
                    </HStack>
                </VStack>

                {weatherData.air_quality && (
                    <VStack gap="8">
                        <Text text="Якість повітря:" bold />
                        <HStack gap="16" max>
                            <Text text={`CO: ${Math.round(weatherData.air_quality.co)}`} />
                            <Text text={`NO2: ${Math.round(weatherData.air_quality.no2)}`} />
                            <Text text={`O3: ${Math.round(weatherData.air_quality.o3)}`} />
                            <Text text={`PM2.5: ${Math.round(weatherData.air_quality.pm2_5)}`} />
                        </HStack>
                    </VStack>
                )}
            </VStack>
        </Card>
    );
};
