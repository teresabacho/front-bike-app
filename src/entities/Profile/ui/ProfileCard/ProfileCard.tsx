import { useTranslation } from 'react-i18next';

import React from 'react';
import { Currency } from '@/entities/Currency';
import { Country } from '@/entities/Country';
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
    onChangeCurrency?: (currency: Currency) => void;
    onChangeCountry?: (country: Country) => void;
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
