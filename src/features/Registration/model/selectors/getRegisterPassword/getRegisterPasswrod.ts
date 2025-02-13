import { StateSchema } from '@/app/providers/StoreProvider';

export const getRegisterPasswrod = (state: StateSchema) =>
    state?.registerForm?.password || '';
export const getRegisterRole = (state: StateSchema) =>
    state?.registerForm?.role || '';
