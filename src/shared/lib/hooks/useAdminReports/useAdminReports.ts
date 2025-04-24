import { useState, useCallback } from 'react';
import { $api } from '@/shared/api/api';

interface BanUserData {
    userId: string;
    reason: string;
    duration: number;
}

export const useAdminReports = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getAllReports = useCallback(async (status?: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await $api.get('/admin/reports', {
                params: { status }
            });
            return response.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Помилка при завантаженні репортів';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const dismissReport = useCallback(async (reportId: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await $api.post(`/admin/reports/${reportId}/dismiss`);
            return response.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Помилка при відхиленні репорту';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const resolveReport = useCallback(async (reportId: number, action: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await $api.post(`/admin/reports/${reportId}/resolve`, { action });
            return response.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Помилка при розгляді репорту';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const banUser = useCallback(async (data: BanUserData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await $api.post('/admin/ban-user', data);
            return response.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Помилка при бані користувача';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteArticle = useCallback(async (articleId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await $api.delete(`/admin/articles/${articleId}`);
            return response.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Помилка при видаленні статті';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteComment = useCallback(async (commentId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await $api.delete(`/admin/comments/${commentId}`);
            return response.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Помилка при видаленні коментаря';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        getAllReports,
        dismissReport,
        resolveReport,
        banUser,
        deleteArticle,
        deleteComment,
        loading,
        error,
    };
};
