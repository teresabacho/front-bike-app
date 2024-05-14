import axios from 'axios';
import { TOKEN_LOCALSTORAGE_KEY } from '@/shared/const/localstorage';

export const $api = axios.create({
    baseURL: __API__,
    withCredentials: true,
});

$api.interceptors.request.use((config) => {
    if (config.headers){
        config.headers.Authorization = `Bearer ${localStorage.getItem(TOKEN_LOCALSTORAGE_KEY)}`
        return config;
    }
    return null
})

$api.interceptors.response.use((config) => {
    return config;
},async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await axios.post<{accessToken:string}>(`${__API__}/auth/refresh-token`)
            localStorage.setItem(TOKEN_LOCALSTORAGE_KEY, response.data.accessToken);
            return $api.request(originalRequest);
        } catch (e) {
        }
    }
    throw error;
})
