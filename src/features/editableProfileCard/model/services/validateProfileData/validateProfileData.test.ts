import { Country } from '@/entities/Country';
import { Currency } from '@/entities/Currency';
import { validateProfileData } from './validateProfileData';

const data = {
    username: 'admin',
    age: 22,
    country: Country.Ukraine,
    lastname: 'ulbi tv',
    first: 'asd',
    city: 'asf',
    currency: Currency.USD,
};

describe('validateProfileData.test', () => {
    test('success', async () => {
        const result = validateProfileData(data);

        expect(result).toEqual([]);
    });

    test('without first and last name', async () => {
        const result = validateProfileData({
            ...data,
            first: '',
            lastname: '',
        });

    });

    test('incorrect age', async () => {
        const result = validateProfileData({ ...data, age: undefined });

    });

    test('incorrect country', async () => {
        const result = validateProfileData({ ...data, country: undefined });
    });

    test('incorrect all', async () => {
        const result = validateProfileData({});

    });
});
