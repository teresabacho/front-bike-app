import { StateSchema } from '@/app/providers/StoreProvider';

export const getRegisterUsername = (state: StateSchema) =>
    state?.registerForm?.username || '';
