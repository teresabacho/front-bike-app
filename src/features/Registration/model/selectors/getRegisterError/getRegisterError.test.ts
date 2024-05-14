import { StateSchema } from '@/app/providers/StoreProvider';
import { getRegisterError } from './getRegisterError';

describe('getRegisterError.test', () => {
    test('should return error', () => {
        const state: DeepPartial<StateSchema> = {
            registerForm: {
                error: 'error',
            },
        };
        expect(getRegisterError(state as StateSchema)).toEqual('error');
    });
    test('should work with empty state', () => {
        const state: DeepPartial<StateSchema> = {};
        expect(getRegisterError(state as StateSchema)).toEqual(undefined);
    });
});
