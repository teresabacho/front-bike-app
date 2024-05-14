import { FC, lazy } from 'react';
import {  RegisterFormProps } from './RegistrationForm';

export const RegistrationFormAsync = lazy<FC<RegisterFormProps>>(
    () => import('./RegistrationForm'),
);
