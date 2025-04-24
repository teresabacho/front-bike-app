
import { useState, useCallback } from 'react';
import { $api } from '@/shared/api/api';

interface CreateReportData {
    targetType: 'article' | 'comment';
    targetId: string;
    reason: string;
}

export const useReports = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createReport = useCallback(async (data: CreateReportData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await $api.post('/reports', data);
            return response.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Помилка при створенні репорту';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const getMyReports = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await $api.get('/reports/my');
            return response.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Помилка при завантаженні репортів';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        createReport,
        getMyReports,
        loading,
        error,
    };
};
