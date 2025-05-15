// In src/pages/AdminTrainerApprovalPage/ui/AdminTrainerApprovalPage.tsx
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Text } from '@/shared/ui/redesigned/Text';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';
import { Button } from '@/shared/ui/redesigned/Button';
import { Input } from '@/shared/ui/redesigned/Input';
import { Card } from '@/shared/ui/redesigned/Card';
import { Page } from '@/widgets/Page';
import { $api } from '@/shared/api/api'; // Import your axios instance

interface TrainerRequest {
    id: number;
    username: string;
    email: string;
    qualificationDocumentUrl: string;
    requestDate: string;
}

export const AdminTrainerApprovalPage = () => {
    const { t } = useTranslation();
    const [pendingTrainers, setPendingTrainers] = useState<TrainerRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notes, setNotes] = useState<Record<number, string>>({});

    const fetchPendingTrainers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await $api.get('/admin/pending-trainers');
            setPendingTrainers(response.data);
        } catch (error) {
            setError(error?.response?.data?.message || error?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingTrainers();
    }, []);

    const handleNotesChange = (userId: number, value: string) => {
        setNotes(prev => ({
            ...prev,
            [userId]: value,
        }));
    };

    const handleApprove = async (userId: number) => {
        try {
            await $api.post(`/admin/approve-trainer/${userId}`, {
                notes: notes[userId] || ''
            });
            // Refresh the list
            fetchPendingTrainers();
        } catch (error) {
            setError(error?.response?.data?.message || error?.message || 'Failed to approve trainer');
        }
    };

    const handleReject = async (userId: number) => {
        try {
            await $api.post(`/admin/reject-trainer/${userId}`, {
                notes: notes[userId] || ''
            });
            fetchPendingTrainers();
        } catch (error) {
            setError(error?.response?.data?.message || error?.message || 'Failed to reject trainer');
        }
    };

    return (
        <Page>
            <VStack gap="16" max>
                <Text title={t('Trainer Approval Requests')} />

                {error && <Text text={error} variant="error" />}

                {loading ? (
                    <Text text={t('Loading...')} />
                ) : pendingTrainers.length === 0 ? (
                    <Text text={t('No pending trainer requests')} />
                ) : (
                    <VStack gap="16" max>
                        {pendingTrainers.map((trainer) => (
                            <Card
                                key={trainer.id}
                                padding="24"
                                border="partial"
                            >
                                <VStack gap="16" max>
                                    <HStack gap="16" max justify="between">
                                        <Text
                                            title={trainer.username}
                                            size="l"
                                        />
                                        <Text
                                            text={new Date(
                                                trainer.requestDate,
                                            ).toLocaleDateString()}
                                        />
                                    </HStack>

                                    <Text text={`Email: ${trainer.email}`} />

                                    {trainer.qualificationDocumentUrl && (
                                        <HStack gap="16" max>
                                            Документ підтвердження кваліфікації:
                                            <a
                                                href={
                                                    trainer.qualificationDocumentUrl
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >лінк</a>
                                        </HStack>
                                    )}
                                    <Input
                                        placeholder={t(
                                            'Add approval/rejection notes',
                                        )}
                                        value={notes[trainer.id] || ''}
                                        onChange={(value) =>
                                            handleNotesChange(trainer.id, value)
                                        }
                                    />

                                    <HStack gap="16">
                                        <Button
                                            onClick={() =>
                                                handleApprove(trainer.id)
                                            }
                                            variant="outline"
                                        >
                                            {t('Approve')}
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                handleReject(trainer.id)
                                            }
                                            variant="outline"
                                            color="error"
                                        >
                                            {t('Reject')}
                                        </Button>
                                    </HStack>
                                </VStack>
                            </Card>
                        ))}
                    </VStack>
                )}
            </VStack>
        </Page>
    );
};
