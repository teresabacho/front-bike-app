import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
    lng: 'ua',
    fallbackLng: 'ua',
    debug: false,

    interpolation: {
        escapeValue: false, // not needed for react!!
    },
    resources: { ua: { translations: {} } },
});

export default i18n;
