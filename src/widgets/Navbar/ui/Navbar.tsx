import { useTranslation } from 'react-i18next';
import React, { memo, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { classNames } from '@/shared/lib/classNames/classNames';
import { getUserAuthData } from '@/entities/User';
import { HStack } from '@/shared/ui/redesigned/Stack';
import { NotificationButton } from '@/features/notificationButton';
import { AvatarDropdown } from '@/features/avatarDropdown';
import cls from './Navbar.module.scss';

import { Button } from '@/shared/ui/redesigned/Button';
import { RegistrationModal } from '@/features/Registration';
import { LoginModal } from '@/features/AuthByUsername';

interface NavbarProps {
    className?: string;
}

export const Navbar = memo(({ className }: NavbarProps) => {
    const { t } = useTranslation();
    const [isLoginModal, setIsLoginModal] = useState(false);
    const [isRegisterModal, setIsRegisterModal] = useState(false);
    const authData = useSelector(getUserAuthData);

    const onCloseLoginModal = useCallback(() => {
        setIsLoginModal(false);
    }, []);

    const onCloseRegisterModal = useCallback(() => {
        setIsRegisterModal(false);
    }, []);

    const onShowLoginModal = useCallback(() => {
        setIsLoginModal(true);
    }, []);

    const onShowRegisterModal = useCallback(() => {
        setIsRegisterModal(true);
    }, []);

    const mainClass = cls.NavbarRedesigned;

    if (authData) {
        return (
            <header className={classNames(mainClass, {}, [className])}>
                                    <HStack gap="16" className={cls.actions}>
                                        <NotificationButton />
                                        <AvatarDropdown />
                                    </HStack>
                                </header>
        );
    }

    return (
        <header className={classNames(mainClass, {}, [className])}>
            <Button
                                    variant="clear"
                                    className={cls.links}
                                    onClick={onShowLoginModal}
                                >
                                    {t('Увійти')}
                                </Button>

            <Button
                variant="clear"
                className={cls.links}
                onClick={onShowRegisterModal}
            >
                {t('Зареєструватись')}
            </Button>

             {isLoginModal && (
                <LoginModal isOpen={isLoginModal} onClose={onCloseLoginModal} />
             )}
            {isRegisterModal && (
                <RegistrationModal isOpen={isRegisterModal} onClose={onCloseRegisterModal} />
            )}
        </header>
    );
});
