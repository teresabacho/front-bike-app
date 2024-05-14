import { StateSchema } from '@/app/providers/StoreProvider';
import { getRegisterIsLoading } from './getRegisterIsLoading';

describe('getRegisterIsLoading.test', () => {
    test('should return true', () => {
        const state: DeepPartial<StateSchema> = {
            registerForm: {
                isLoading: true,
            },
        };
        expect(getRegisterIsLoading(state as StateSchema)).toEqual(true);
    });
    test('should work with empty state', () => {
        const state: DeepPartial<StateSchema> = {};
        expect(getRegisterIsLoading(state as StateSchema)).toEqual(false);
    });
});
