import { StateSchema } from '@/app/providers/StoreProvider';

export const getRegisterPasswrod = (state: StateSchema) =>
    state?.registerForm?.password || '';
