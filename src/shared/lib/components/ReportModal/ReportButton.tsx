import { useState } from 'react';
import { Button } from '@/shared/ui/redesigned/Button';
import { Icon } from '@/shared/ui/redesigned/Icon';
import { ReportModal } from '../ReportModal/ReportModal';
import { usePermissions } from '@/entities/Article/ui/ArticleDetails/ArticleDetails';

interface ReportButtonProps {
    targetType: 'article' | 'comment';
    targetId: string;
    contentUserId: string;
    contentPreview?: string;
    variant?: 'clear' | 'outline' | 'filled';
    size?: 'small' | 'medium' | 'large';
}

export const ReportButton = ({
                                 targetType,
                                 targetId,
                                 contentUserId,
                                 contentPreview,
                                 variant = 'clear',
                                 size = 'medium',
                             }: ReportButtonProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { canReportContent } = usePermissions();

    if (!canReportContent(contentUserId)) {
        return null;
    }

    return (
        <>
            <Button
                variant={variant}
                size={size}
                onClick={() => setIsModalOpen(true)}
                title="Поскаржитись на контент"
            >
                Поскаржитись
            </Button>

            <ReportModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                targetType={targetType}
                targetId={targetId}
                contentPreview={contentPreview}
            />
        </>
    );
};
