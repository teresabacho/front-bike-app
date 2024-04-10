import { $api } from '@/shared/api/api';

/**
 * Отримання списку всіх поїздок з можливістю фільтрації за періодом
 * @param {string} timePeriod - Період часу ('all' або 'month')
 * @returns {Promise<Array>} - Масив поїздок
 */

export const getAllRides = async (timePeriod = 'all') => {
    try {
        const params = {};
        if (timePeriod === 'month') {
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            params.from_date = lastMonth.toISOString().split('T')[0];
        }

        const response = await $api.get('/ride', { params });
        return response.data;
    } catch (error) {
        console.error('Помилка при отриманні списку поїздок:', error);
        throw error;
    }
};

/**
 * Отримання списку поїздок поточного користувача
 * @param {string} timePeriod - Період часу ('all' або 'month')
 * @returns {Promise<Array>} - Масив поїздок користувача
 */
export const getMyRides = async (timePeriod = 'all') => {
    try {
        const params = {};
        if (timePeriod === 'month') {
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            params.from_date = lastMonth.toISOString().split('T')[0];
        }

        const response = await $api.get('/ride/user_owner', { params });
        return response.data;
    } catch (error) {
        console.error('Помилка при отриманні списку поїздок користувача:', error);
        throw error;
    }
};

/**
 * Отримання аналітичних даних для графіків
 * @param {string} timePeriod - Період часу ('all' або 'month')
 * @param {string} userFilter - Фільтр користувача ('all' або 'my')
 * @returns {Promise<Object>} - Об'єкт з аналітичними даними
 */
export const getRideAnalytics = async (timePeriod = 'all', userFilter = 'all') => {
    try {
        let rides;
        if (userFilter === 'my') {
            rides = await getMyRides(timePeriod);
        } else {
            rides = await getAllRides(timePeriod);
        }
        console.log('dasdasd');

        return processDataForCharts(rides);
    } catch (error) {
        console.error('Помилка при отриманні аналітичних даних:', error);
        throw error;
    }
};

const processDataForCharts = (rides) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0)
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
        percentage: rides.length > 0 ? Math.round((count / rides.length) * 100) : 0
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
