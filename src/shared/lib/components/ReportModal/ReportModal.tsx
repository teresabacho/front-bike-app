import { useState } from 'react';
import { Text } from '@/shared/ui/redesigned/Text';
import { VStack, HStack } from '@/shared/ui/redesigned/Stack';
import { Button } from '@/shared/ui/redesigned/Button';
import { Modal } from '@/shared/ui/redesigned/Modal';
import { Card } from '@/shared/ui/redesigned/Card';
import { useReports } from '../../hooks/useReports/useReports';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    targetType: 'article' | 'comment';
    targetId: string;
    contentPreview?: string;
}

const REPORT_REASONS = [
    'Спам або небажана реклама',
    'Неприйнятний або образливий контент',
    'Дезінформація',
    'Порушення авторських прав',
    'Шахрайство або обман',
    'Заклики до насильства',
    'Інше',
];

export const ReportModal = ({
                                isOpen,
                                onClose,
                                targetType,
                                targetId,
                                contentPreview
                            }: ReportModalProps) => {
    const [selectedReason, setSelectedReason] = useState<string>('');
    const [customReason, setCustomReason] = useState<string>('');
    const { createReport, loading } = useReports();

    const handleSubmit = async () => {
        const reason = selectedReason === 'Інше' ? customReason : selectedReason;

        if (!reason.trim()) {
            alert('Будь ласка, оберіть або вкажіть причину скарги');
            return;
        }

        try {
            await createReport({
                targetType,
                targetId,
                reason: reason.trim(),
            });

            alert('Скаргу успішно подано. Дякуємо за допомогу!');
            handleClose();
        } catch (error) {
        }
    };

    const handleClose = () => {
        setSelectedReason('');
        setCustomReason('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <VStack gap="24" max>
                <Text title="Повідомити про неприйнятний контент" size="l" />

                {contentPreview && (
                    <Card padding="16" variant="light">
                        <VStack gap="8">
                            <Text text="Контент:" bold />
                            <Text
                                text={contentPreview.length > 100
                                    ? `${contentPreview.substring(0, 100)}...`
                                    : contentPreview
                                }
                                style={{ fontStyle: 'italic' }}
                            />
                        </VStack>
                    </Card>
                )}

                <VStack gap="16" max>
                    <Text text="Оберіть причину скарги:" bold />

                    <VStack gap="8" max>
                        {REPORT_REASONS.map((reason) => (
                            <Card
                                key={reason}
                                padding="12"
                                clickable
                                onClick={() => setSelectedReason(reason)}
                                style={{
                                    border: selectedReason === reason
                                        ? '2px solid var(--primary-color)'
                                        : '1px solid var(--border-color)',
                                    cursor: 'pointer',
                                }}
                            >
                                <Text text={reason} />
                            </Card>
                        ))}
                    </VStack>

                    {selectedReason === 'Інше' && (
                        <VStack gap="8" max>
                            <Text text="Опишіть проблему:" bold />
                            <textarea
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                placeholder="Детальний опис причини скарги..."
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    resize: 'vertical',
                                    fontFamily: 'inherit',
                                }}
                            />
                        </VStack>
                    )}
                </VStack>

                <HStack gap="12" justify="end" max>
                    <Button
                        onClick={handleClose}
                        variant="outline"
                        disabled={loading}
                    >
                        Скасувати
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        color="error"
                        disabled={loading || !selectedReason}
                    >
                        {loading ? 'Подання...' : 'Подати скаргу'}
                    </Button>
                </HStack>
            </VStack>
        </Modal>
    );
};
