
export interface ApiErrorResponse {
    message: string;
    statusCode: number;
}

let refreshTokenPromise: Promise<string> | null = null;

const createAxiosInstance = (): 