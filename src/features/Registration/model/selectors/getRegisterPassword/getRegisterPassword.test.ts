import { StateSchema } from '@/app/providers/StoreProvider';
import { getRegisterPasswrod } from './getRegisterPasswrod';

describe('getRegisterPassword.test', () => {
    test('should return value', () => {
        const state: DeepPartial<StateSchema> = {
            registerForm: {
                password: '123123',
            },
        };
        expect(getRegisterPasswrod(state as StateSchema)).toEqual('123123');
    });
    test('should work with empty state', () => {
        const state: DeepPartial<StateSchema> = {};
        expect(getRegisterPasswrod(state as StateSchema)).toEqual('');
    });
});
