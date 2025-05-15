import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Text } from '@/shared/ui/redesigned/Text';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';
import { Card } from '@/shared/ui/redesigned/Card';
import { $api } from '@/shared/api/api';

interface ApprovalStatusProps {
    className?: string;
}

export const UserApprovalStatus = ({ className }: ApprovalStatusProps) => {
    const { t } = useTranslation();
    const [status, setStatus] = useState<{
        isPendingApproval: boolean;
        isApproved: boolean;
        role: string;
        notes?: string;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchApprovalStatus = async () => {
            try {
                const response = await $api.get('/users/approval-status', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                setStatus(response.data);
            } catch (error) {
                setError(error.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchApprovalStatus();
    }, []);


    if (status?.isApproved ){
        localStorage.setItem('isApproved', 'true');
    }

    if  (localStorage.getItem('role' )!== 'trainer') {
        return null;
    }
    return (
        <Card
            padding="16"
        >
            <VStack gap="8">
                <Text title={t('Trainer Status')} size="m" />

                {status?.isPendingApproval && (
                    <Text
                        text={t('Your trainer request is pending approval')}
                        variant="accent"
                    />
                )}

                {status?.isApproved && (
                    <Text
                        text={t('You are an approved trainer')}
                        variant="accent"
                    />
                )}

                {!status?.isPendingApproval && !status?.isApproved  && (
                    <VStack gap="4">
                        <Text
                            text={t('Your trainer request was not approved')}
                            variant="error"
                        />
                        {status?.notes && (
                            <Text text={t('Notes: ') + status.notes} />
                        )}
                    </VStack>
                )}
            </VStack>
        </Card>
    );
};
