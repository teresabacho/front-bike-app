import { useTranslation } from 'react-i18next';

import React from 'react';
import { Profile } from '../../model/types/profile';
import {
    ProfileCardRedesigned,
    ProfileCardRedesignedError,
    ProfileCardRedesignedSkeleton,
} from '../ProfileCardRedesigned/ProfileCardRedesigned';

export interface ProfileCardProps {
    className?: string;
    data?: Profile;
    error?: string;
    isLoading?: boolean;
    readonly?: boolean;
    onChangeLastname?: (value?: string) => void;
    onChangeFirstname?: (value?: string) => void;
    onChangeCity?: (value?: string) => void;
    onChangeAge?: (value?: string) => void;
    onChangeUsername?: (value?: string) => void;
    onChangeAvatar?: (event:React.ChangeEvent<HTMLInputElement>) => void;
    onFileUpload:any
}

export const ProfileCard = (props: ProfileCardProps) => {
    const { isLoading, error } = props;
    const { t } = useTranslation();


    if (isLoading) {
        return (
            <ProfileCardRedesignedSkeleton />
        );
    }

    if (error) {
        return (
            <ProfileCardRedesignedError />
        );
    }

    return (
        <ProfileCardRedesigned {...props} />
    );
};
