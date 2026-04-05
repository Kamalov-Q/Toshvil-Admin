import { z } from 'zod';

export const LoginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters'),
});

export type LoginDto = z.infer<typeof LoginSchema>;

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    admin: {
        id: string;
        email: string;
        role: 'admin' | 'super_admin';
        firstName?: string;
        lastName?: string;
        fullName?: string;
    };
}

export interface RefreshResponse {
    accessToken: string;
}