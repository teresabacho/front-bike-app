import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Text } from '@/shared/ui/redesigned/Text';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';
import { Button } from '@/shared/ui/redesigned/Button';
import { Card } from '@/shared/ui/redesigned/Card';
import { Page } from '@/widgets/Page';
import { Modal } from '@/shared/ui/redesigned/Modal';
import { Input } from '@/shared/ui/redesigned/Input';
import { useAdminReports } from '@/shared/lib/hooks/useAdminReports/useAdminReports';

interface Report {
    id: number;
    targetType: 'article' | 'comment';
    targetId: string;
    reason: string;
    reportedByUser: { username: string };
    targetUserEntity: { id: string; username: string };
    targetContent: { title?: string; text?: string; content?: string };
    status: 'pending' | 'resolved' | 'dismissed';
    createdAt: string;
}

interface BanModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    username: string;
    onBan: (userId: string, reason: string, duration: number) => void;
}

const BanModal = ({ isOpen, onClose, userId, username, onBan }: BanModalProps) => {
    const [reason, setReason] = useState('');
    const [duration, setDuration] = useState(7);

    const handleBan = () => {
        if (!reason.trim()) {
            alert('Вкажіть причину бану');
            return;
        }
        onBan(userId, reason, duration);
        onClose();
        setReason('');
        setDuration(7);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <VStack gap="16" max>
                <Text title={`Забанити користувача: ${username}`} />

                <Input
                    value={reason}
                    onChange={setReason}
                    placeholder="Причина бану"
                />

                <HStack gap="8" align="center">
                    <Text text="Тривалість (днів):" />
                    <Input
                        type="number"
                        value={duration.toString()}
                        onChange={(value) => setDuration(Number(value))}
                        style={{ width: '100px' }}
                    />
                </HStack>

                <HStack gap="8" justify="end" max>
                    <Button onClick={onClose} variant="outline">
                        Скасувати
                    </Button>
                    <Button onClick={handleBan} color="error">
                        Забанити
                    </Button>
                </HStack>
            </VStack>
        </Modal>
    );
};

export const AdminReportsPage = () => {
    const { t } = useTranslation();
    const [reports, setReports] = useState<Report[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'resolved'>('pending');
    const [banModalOpen, setBanModalOpen] = useState(false);
    const [selectedUserToBan, setSelectedUserToBan] = useState<{id: string, username: string} | null>(null);

    const {
        getAllReports,
        dismissReport,
        resolveReport,
        banUser,
        deleteArticle,
        deleteComment,
        loading,
        error
    } = useAdminReports();

    const fetchReports = async () => {
        try {
            const data = await getAllReports(selectedFilter === 'all' ? undefined : selectedFilter);
            setReports(data);
        } catch (error) {
            console.error('Помилка завантаження репортів:', error);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [selectedFilter]);

    const handleKeepContent = async (reportId: number) => {
        try {
            await dismissReport(reportId);
            fetchReports();
        } catch (error) {
            console.error('Помилка при відхиленні репорту:', error);
        }
    };

    const handleDeleteContent = async (report: Report) => {
        try {
            if (report.targetType === 'article') {
                await deleteArticle(report.targetId);
            } else if (report.targetType === 'comment') {
                await deleteComment(report.targetId);
            }

            await resolveReport(report.id, 'deleted');
            fetchReports();
        } catch (error) {
            console.error('Помилка при видаленні контенту:', error);
        }
    };

    const handleBanUser = async (userId: string, reason: string, duration: number) => {
        try {
            await banUser({ userId, reason, duration });

            const userReports = reports.filter(r => r.targetUserEntity.id === userId);
            for (const report of userReports) {
                await resolveReport(report.id, 'user_banned');
            }

            fetchReports();
        } catch (error) {
            console.error('Помилка при бані користувача:', error);
        }
    };

    const openBanModal = (user: {id: string, username: string}) => {
        setSelectedUserToBan(user);
        setBanModalOpen(true);
    };

    const getContentPreview = (report: Report) => {
        if (report.targetType === 'article') {
            return report.targetContent.title || 'Без назви';
        } else {
            return report.targetContent.text || report.targetContent.content || 'Без тексту';
        }
    };

    return (
        <Page>
            <VStack gap="16" max>
                <Text title="Керування репортами" size="l" />

                <HStack gap="8">
                    <Button
                        variant={selectedFilter === 'pending' ? 'filled' : 'outline'}
                        onClick={() => setSelectedFilter('pending')}
                    >
                        На розгляді
                    </Button>
                    <Button
                        variant={selectedFilter === 'all' ? 'filled' : 'outline'}
                        onClick={() => setSelectedFilter('all')}
                    >
                        Всі
                    </Button>
                    <Button
                        variant={selectedFilter === 'resolved' ? 'filled' : 'outline'}
                        onClick={() => setSelectedFilter('resolved')}
                    >
                        Розглянуті
                    </Button>
                </HStack>

                {error && <Text text={error} variant="error" />}

                {loading ? (
                    <Text text="Завантаження..." />
                ) : reports.length === 0 ? (
                    <Text text="Немає репортів" />
                ) : (
                    <VStack gap="16" max>
                        {reports.map((report) => (
                            <Card key={report.id} padding="24" border="partial">
                                <VStack gap="16" max>
                                    <HStack justify="between" align="start" max>
                                        <VStack gap="8" max>
                                            <Text text={`Тип: ${report.targetType === 'article' ? 'Пост' : 'Коментар'}`} bold />
                                            <Text text={`Автор: ${report.targetUserEntity.username}`} />
                                            <Text text={`Скаржник: ${report.reportedByUser.username}`} />
                                            <Text text={`Причина: ${report.reason}`} />
                                        </VStack>
                                        <Text text={report.status} bold />
                                    </HStack>

                                    <Card padding="16" variant="light">
                                        <Text text={`Контент: ${getContentPreview(report)}`} />
                                    </Card>

                                    {report.status === 'pending' && (
                                        <HStack gap="8" justify="end">
                                            <Button
                                                onClick={() => handleKeepContent(report.id)}
                                                variant="outline"
                                            >
                                                Залишити
                                            </Button>
                                            <Button
                                                onClick={() => handleDeleteContent(report)}
                                                variant="outline"
                                                color="error"
                                            >
                                                Видалити контент
                                            </Button>
                                            <Button
                                                onClick={() => openBanModal(report.targetUserEntity)}
                                                color="error"
                                            >
                                                Забанити
                                            </Button>
                                        </HStack>
                                    )}
                                </VStack>
                            </Card>
                        ))}
                    </VStack>
                )}

                {selectedUserToBan && (
                    <BanModal
                        isOpen={banModalOpen}
                        onClose={() => {
                            setBanModalOpen(false);
                            setSelectedUserToBan(null);
                        }}
                        userId={selectedUserToBan.id}
                        username={selectedUserToBan.username}
                        onBan={handleBanUser}
                    />
                )}
            </VStack>
        </Page>
    );
};
