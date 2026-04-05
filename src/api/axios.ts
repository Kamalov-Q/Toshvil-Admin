import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios"
export interface ApiErrorResponse {
    message: string;
    statusCode: number;
}

let refreshTokenPromise: Promise<string> | null = null;

const createAxiosInstance = (): AxiosInstance => {
    const instance = axios.create({
        baseURL: import.meta.env.VITE_API_URL as string,
        timeout: 20000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Request interceptor
    instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response interceptor
    instance.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

            if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/login') {
                originalRequest._retry = true;

                try {
                    // If a refresh token is already in progress, wait for it to complete
                    if (refreshTokenPromise) {
                        const newAccessToken = await refreshTokenPromise;
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        return instance(originalRequest);
                    }

                    const refreshToken = localStorage.getItem('refreshToken');
                    if (!refreshToken) {
                        // Clear auth and redirect to login
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        window.location.href = '/login';
                        return Promise.reject(error);
                    }

                    refreshTokenPromise = refreshAccessToken(instance, refreshToken);
                    const newAccessToken = await refreshTokenPromise;
                    refreshTokenPromise = null;

                    localStorage.setItem('accessToken', newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return instance(originalRequest);

                } catch (error) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                    return Promise.reject(error);
                }
            }

            return Promise.reject(error);

        }

    );

    return instance;

}

const refreshAccessToken = async (
    instance: AxiosInstance,
    refreshToken: string
): Promise<string> => {
    const response = await instance.post('/auth/refresh', {
        refreshToken
    });

    return response.data.accessToken;
}


export const apiClient = createAxiosInstance();