import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../components/ui/form';
import { useAuthStore } from '../store/authStore';
import { useLogin } from '../features/auth/api/hooks';
import { Lock, Mail, LogIn, AlertCircle } from 'lucide-react';
import { toast } from '../utils/toast';

// Login schema validation
const LoginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email manzilini kiritish majburiy')
        .email('Email manzili noto\'g\'ri'),
    password: z
        .string()
        .min(1, 'Parolni kiritish majburiy')
        .min(6, 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak'),
});

type LoginFormValues = z.infer<typeof LoginSchema>;

export default function LoginPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const loginMutation = useLogin();

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onBlur',
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            await loginMutation.mutateAsync(data);
            navigate('/dashboard', { replace: true });
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                'Kirishda xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.';
            toast.error(errorMessage);
            console.error('Login error:', error);
        }
    };

    const isLoading = loginMutation.isPending;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            {/* Main content */}
            <div className="w-full max-w-md z-10">
                {/* Logo/Brand section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg mb-4">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Paneli</h1>
                    <p className="text-gray-600">Tizimni osongina boshqaring</p>
                </div>

                {/* Login card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    {/* Card header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <LogIn className="w-6 h-6" />
                            Kirish
                        </h2>
                        <p className="text-blue-100 text-sm mt-1">
                            Admin paneliga kirish uchun ma'lumotlaringizni kiriting
                        </p>
                    </div>

                    {/* Card body */}
                    <div className="p-6 space-y-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                {/* Error alert */}
                                {form.formState.errors.email || form.formState.errors.password ? (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-semibold text-red-900 text-sm">
                                                Iltimos, ma'lumotlarni tekshiring
                                            </h3>
                                            {form.formState.errors.email && (
                                                <p className="text-xs text-red-700 mt-1">
                                                    {form.formState.errors.email.message}
                                                </p>
                                            )}
                                            {form.formState.errors.password && (
                                                <p className="text-xs text-red-700 mt-1">
                                                    {form.formState.errors.password.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ) : null}

                                {/* Email field */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 font-semibold">Email manzili</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                                    <Input
                                                        {...field}
                                                        type="email"
                                                        placeholder="admin@misol.uz"
                                                        disabled={isLoading}
                                                        className="pl-10 h-11 border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-base"
                                                        autoComplete="email"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-600" />
                                        </FormItem>
                                    )}
                                />

                                {/* Password field */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-gray-700 font-semibold">Parol</FormLabel>
                        <a
                          href="#"
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Unutdingizmi?
                        </a>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <Input
                            {...field}
                            type="password"
                            placeholder="••••••••"
                            disabled={isLoading}
                            className="pl-10 h-11 border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-base"
                            autoComplete="current-password"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-600" />
                    </FormItem>
                  )}
                />

                            {/* Remember me */}
                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                                    Meni eslab qol
                                </label>
                            </div>

                            {/* Submit button */}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <svg
                                            className="w-5 h-5 animate-spin"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="w-5 h-5" />
                                        Kirish
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>

                    {/* Demo credentials info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-xs font-semibold text-blue-900 mb-2">Demo ma'lumotlar</p>
                        <div className="space-y-1 text-xs text-blue-700">
                            <p>
                                <span className="font-medium">Email:</span> admin@example.com
                            </p>
                            <p>
                                <span className="font-medium">Password:</span> password123
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card footer */}
                <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
                    <p className="text-center text-sm text-gray-600">
                        Yordam kerakmi?{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                            Qo'llab-quvvatlash xizmati
                        </a>
                    </p>
                </div>
            </div>

            {/* Footer text */}
            <p className="text-center text-xs text-gray-600 mt-6">
                © 2024 Admin Paneli. Barcha huquqlar himoyalangan.
            </p>
        </div>

      {/* CSS for animations */ }
    <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div >
  );
}