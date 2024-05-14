import { RegisterSchema } from '../types/registerSchema';
import { registerActions, registerReducer } from './registerSlice';

describe('loginSlice.test', () => {
    test('test set username', () => {
        const state: DeepPartial<RegisterSchema> = { username: '123' };
        expect(
            registerReducer(
                state as RegisterSchema,
                registerActions.setUsername('123123'),
            ),
        ).toEqual({ username: '123123' });
    });

    test('test set password', () => {
        const state: DeepPartial<RegisterSchema> = { password: '123' };
        expect(
            registerReducer(
                state as RegisterSchema,
                registerActions.setPassword('123123'),
            ),
        ).toEqual({ password: '123123' });
    });
});
