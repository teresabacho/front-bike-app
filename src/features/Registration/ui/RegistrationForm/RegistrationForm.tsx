import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { memo, useCallback, useState } from 'react';  // Added useState
import { classNames } from '@/shared/lib/classNames/classNames';
import { Text } from '@/shared/ui/redesigned/Text';
import {
    DynamicModuleLoader,
    ReducersList,
} from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { getRegisterUsername } from '../../model/selectors/getRegisterUsername/getRegisterUsername';
import { getRegisterPasswrod, getRegisterRole } from '../../model/selectors/getRegisterPassword/getRegisterPasswrod';
import { getRegisterIsLoading } from '../../model/selectors/getRegisterIsLoading/getRegisterIsLoading';
import { registerByUsernameAndEmail } from '../../model/services/registerByUsernameAndEmail/registerByUsernameAndEmail';
import { registerActions, registerReducer } from '../../model/slice/registerSlice';
import cls from './RegistrationForm.module.scss';
import { Button } from '@/shared/ui/redesigned/Button';
import { Input } from '@/shared/ui/redesigned/Input';
import { HStack, VStack } from '@/shared/ui/redesigned/Stack';
import { useForceUpdate } from '@/shared/lib/render/forceUpdate';
import { getRegisterError } from '../../model/selectors/getRegisterError/getRegisterError';
import { getRegisterEmail } from '../../model/selectors/getRegisterEmail/getRegisterUsername';

export interface RegisterFormProps {
    className?: string;
    onSuccess: () => void;
}

const initialReducers: ReducersList = {
    registerForm: registerReducer,
};

const RegistrationForm = memo(({ className, onSuccess }: RegisterFormProps) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const username = useSelector(getRegisterUsername);
    const email = useSelector(getRegisterEmail);
    const password = useSelector(getRegisterPasswrod);
    const isLoading = useSelector(getRegisterIsLoading);
    const error = useSelector(getRegisterError);
    const role = useSelector(getRegisterRole);
    const forceUpdate = useForceUpdate();
    const [qualificationDoc, setQualificationDoc] = useState<File | null>(null);
    console.log(qualificationDoc);

    const onChangeUsername = useCallback(
        (value: string) => {
            dispatch(registerActions.setUsername(value));
        },
        [dispatch],
    );

    const onChangePassword = useCallback(
        (value: string) => {
            dispatch(registerActions.setPassword(value));
        },
        [dispatch],
    );

    const onChangeEmail = useCallback(
        (value: string) => {
            dispatch(registerActions.setEmail(value));
        },
        [dispatch],
    );

    const onChangeRole = useCallback(
        (value: string) => {
            if (value.target.checked) {
                dispatch(registerActions.setRole('trainer'));
            } else {
                dispatch(registerActions.setRole('user'));
                setQualificationDoc(null); // Clear document when switching back to user
            }
        },
        [dispatch],
    );

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setQualificationDoc(e.target.files[0]);
        }
    }, []);

    const onLoginClick = useCallback(async () => {
        const queryParams = new URLSearchParams(window.location.search);
        const isAdminParam = queryParams.get('admin');
        const processedRole = isAdminParam ? 'admin' : role || 'user';

        // Create form data for API call
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('role', role || 'user');

        // Append document if trainer and document exists
        if (role === 'trainer' && qualificationDoc) {
            formData.append('qualificationDocument', qualificationDoc);
        }

        const result = await dispatch(registerByUsernameAndEmail(formData));
        if (result.meta.requestStatus === 'fulfilled') {
            onSuccess();
            forceUpdate();
        }
    }, [dispatch, username, password, email, onSuccess, forceUpdate, role, qualificationDoc]);

    return (
        <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
            <VStack
                gap="16"
                className={classNames(cls.RegisterForm, {}, [className])}
            >
                <Text title={t('Форма Реєстрації')} />
                {error && (
                    <Text
                        text={t('Помилка реєстрації')}
                        variant="error"
                    />
                )}
                <Input
                    autofocus
                    type="text"
                    className={cls.input}
                    placeholder={t('Введіть username')}
                    onChange={onChangeUsername}
                    value={username}
                />
                <Input
                    autofocus
                    type="text"
                    className={cls.input}
                    placeholder={t('Введіть email')}
                    onChange={onChangeEmail}
                    value={email}
                />
                <Input
                    type="text"
                    className={cls.input}
                    placeholder={t('Введіть пароль')}
                    onChange={onChangePassword}
                    value={password}
                />
                <HStack gap={16}>
                    <Text size='s' title={'Я тренер'} />
                    <input
                        placeholder={'Я тренер'}
                        type={'checkbox'}
                        onChange={(e) => onChangeRole(e)}
                    />
                </HStack>

                {role === 'trainer' && (
                    <VStack gap="8">
                        <Text size='s' title={'Завантажте документ кваліфікації'} />
                        <input
                            type="file"
                            className={cls.input}
                            onChange={handleFileChange}
                        />
                        {qualificationDoc && (
                            <Text text={`Обрано: ${qualificationDoc.name}`} />
                        )}
                    </VStack>
                )}

                <Button
                    className={cls.registerBtn}
                    onClick={onLoginClick}
                    disabled={isLoading || (role === 'trainer' && !qualificationDoc)}
                >
                    {t('Зареєструватись')}
                </Button>
            </VStack>
        </DynamicModuleLoader>
    );
});

export default RegistrationForm;
