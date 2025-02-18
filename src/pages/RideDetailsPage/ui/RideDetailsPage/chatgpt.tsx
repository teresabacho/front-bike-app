import React, { useState, useEffect } from 'react';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';
import { Text } from '@/shared/ui/redesigned/Text';
import { Card } from '@/shared/ui/redesigned/Card';
import { Button } from '@/shared/ui/redesigned/Button';
import { Skeleton } from '@/shared/ui/redesigned/Skeleton';
import cls from './RideAdviceGPT.module.scss';

const API_KEY = '';

export const RideAdviceGPT = ({ ride, weatherData, startLocation }) => {
    const [advice, setAdvice] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAdvice = async () => {
        try {
            setLoading(true);
            setError(null);

            const rideInfo = {
                title: ride?.title || 'Невідома поїздка',
                description: ride?.description || '',
                distance: ride?.directions?.routes[0]?.legs[0]?.distance?.text || 'невідома відстань',
                duration: ride?.directions?.routes[0]?.legs[0]?.duration?.text || 'невідомий час',
                userCount: ride?.user_count || 1,
                startLocation: startLocation ? `${startLocation.lat}, ${startLocation.lng}` : 'невідома локація'
            };

            let weatherInfo = '';
            if (weatherData && weatherData.forecast && weatherData.forecast.forecastday && weatherData.forecast.forecastday.length > 0) {
                const dayForecast = weatherData.forecast.forecastday[0].day;
                const condition = dayForecast.condition ? dayForecast.condition.text : '';

                weatherInfo = `Погода: 
                Температура: ${Math.round(dayForecast.avgtemp_c)}°C (мін: ${Math.round(dayForecast.mintemp_c)}°C, макс: ${Math.round(dayForecast.maxtemp_c)}°C)
                Умови: ${condition}
                Вітер: ${Math.round(dayForecast.maxwind_kph)} км/год
                Вологість: ${dayForecast.avghumidity}%
                Опади: ${dayForecast.totalprecip_mm} мм
                УФ-індекс: ${dayForecast.uv}`;

                if (weatherData.air_quality) {
                    weatherInfo += `
                    Якість повітря: ${getAirQualityDescription(weatherData.air_quality)}`;
                }
            }

            const prompt = `Надай корисні поради для велосипедної поїздки з такими характеристиками:
            Назва: ${rideInfo.title}
            Опис: ${rideInfo.description}
            Відстань: ${rideInfo.distance}
            Тривалість: ${rideInfo.duration}
            Кількість учасників: ${rideInfo.userCount}
            Початкова локація: ${rideInfo.startLocation}
            ${weatherInfo}
            
            Поради повинні стосуватися:
            1. Підготовки до поїздки
            2. Необхідного спорядження (з урахуванням погоди)
            3. Безпеки руху
            4. Тактики руху на маршруті
            5. Харчування та гідратації
            
            Дай 5 конкретних порад, враховуючи погоду, дистанцію та складність маршруту. Відповідай українською мовою.`;

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "Ти - досвідчений велосипедист і тренер, який надає поради щодо велосипедних поїздок українською мовою. Твої поради завжди конкретні, практичні та враховують погодні умови."
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                })
            });

            if (!response.ok) {
                throw new Error('Не вдалося отримати поради');
            }

            const data = await response.json();
            setAdvice(data.choices[0].message.content);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching GPT advice:', err);
            setError('Не вдалося отримати поради. Спробуйте пізніше.');
            setLoading(false);
        }
    };

    const getAirQualityDescription = (airQuality) => {
        if (airQuality['us-epa-index']) {
            const epaIndex = airQuality['us-epa-index'];
            switch (epaIndex) {
                case 1: return 'Добра';
                case 2: return 'Помірна';
                case 3: return 'Шкідлива для чутливих груп';
                case 4: return 'Шкідлива';
                case 5: return 'Дуже шкідлива';
                case 6: return 'Небезпечна';
                default: return 'Невідома';
            }
        }

        const pm25 = airQuality.pm2_5;
        if (pm25 !== undefined) {
            if (pm25 <= 12) return 'Добра';
            if (pm25 <= 35.4) return 'Помірна';
            if (pm25 <= 55.4) return 'Шкідлива для чутливих груп';
            if (pm25 <= 150.4) return 'Шкідлива';
            if (pm25 <= 250.4) return 'Дуже шкідлива';
            return 'Небезпечна';
        }

        return 'Дані відсутні';
    };

    return (
        <Card padding="16" max className={cls.adviceCard}>
            <VStack gap="16">
                <Text title="Поради для поїздки" bold />

                {!advice && !loading && !error && (
                    <Button onClick={fetchAdvice}>
                        Отримати поради для поїздки
                    </Button>
                )}

                {loading && (
                    <Skeleton width="100%" height={150} />
                )}

                {error && (
                    <Text text={error} variant="error" />
                )}

                {advice && (
                    <VStack gap="8">
                        <Text text={advice} />
                        <Button variant="outline" onClick={fetchAdvice}>
                            Оновити поради
                        </Button>
                    </VStack>
                )}
            </VStack>
        </Card>
    );
};
