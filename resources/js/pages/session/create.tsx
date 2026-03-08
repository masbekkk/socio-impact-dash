import SessionController from '@/actions/App/Http/Controllers/SessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { ArrowRight, Eye, EyeOff, LoaderCircle, Store, Users } from 'lucide-react';
import { useState } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
            <Head title="Masuk" />

            {/* Left Side - Marketing */}
            <div className="relative hidden flex-col justify-between p-10 text-white lg:flex overflow-hidden bg-black">
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/assets/loginimg.webp"
                        alt="SocialImpact.ID Background"
                        className="h-full w-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0a3825]/90 to-[#06251b]/95 mix-blend-multiply" />
                </div>

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-2 text-lg font-medium opacity-90">
                    <AppLogoIcon className="h-10 w-10 text-white" />
                    <span className="text-xl font-bold tracking-tight">SocialImpact.ID</span>
                </div>

                {/* Main Content */}
                <div className="relative z-10 max-w-lg space-y-6">
                    <h1 className="text-5xl font-bold leading-tight tracking-tight">
                        Kelola Proyek Anda Dengan Mudah
                    </h1>
                    <p className="text-lg text-white/80">
                        Platform manajemen proyek terintegrasi untuk memantau, mengelola, dan melaporkan kebutuhan Anda.
                    </p>

                    {/* Community Badge */}
                    {/* <div className="mt-8 flex items-center gap-4 rounded-lg bg-transparent p-3 backdrop-blur-0 border w-fit">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0a3825] bg-gray-200">
                                    <Users className="h-5 w-5 text-gray-500" />
                                </div>
                            ))}
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0a3825] bg-gray-800 text-xs font-medium text-white">
                                +2k
                            </div>
                        </div>
                        <div className="text-sm">
                            <p className="font-semibold text-white/60 text-xs uppercase tracking-wider">Komunitas</p>
                            <p className="font-bold">Bergabung dengan 2rb+ mitra</p>
                        </div>
                    </div> */}
                </div>

                {/* Footer */}
                <div className="relative z-10 flex items-center justify-between text-xs text-white/50">
                    <p>&copy; 2026 SocialImpact.ID</p>
                    {/* <div className="space-x-4">
                        <a href="#" className="hover:text-white">Privacy</a>
                        <a href="#" className="hover:text-white">Terms</a>
                    </div> */}
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background lg:p-8">
                {/* Mobile Logo (Visible only on small screens) */}
                <div className="mb-8 flex items-center gap-2 text-lg font-medium lg:hidden">
                    <AppLogoIcon className="h-10 w-10 text-[#0a3825]" />
                    <span className="text-xl font-bold tracking-tight text-[#0a3825]">SocialImpact.ID</span>
                </div>

                <div className="mx-auto w-full max-w-[400px] space-y-6">
                    <div className="space-y-2 text-center lg:text-left">
                        <h2 className="text-3xl font-bold">Masuk</h2>
                        <p className="text-muted-foreground">Masuk ke dashboard untuk mengelola proyek.</p>
                    </div>

                    <Form
                        {...SessionController.store.form()}
                        resetOnSuccess={['password']}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            placeholder="example@gmail.com"
                                            className="h-12"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password">Password</Label>
                                            {canResetPassword && (
                                                <TextLink
                                                    href={request()}
                                                    className="text-sm font-medium text-green-700 hover:text-green-800"
                                                    tabIndex={5}
                                                >
                                                    Lupa Password?
                                                </TextLink>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="••••••••"
                                                className="h-12 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            tabIndex={3}
                                            className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                        />
                                        <Label htmlFor="remember" className="font-normal text-muted-foreground">Remember me</Label>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="h-12 w-full bg-[#0a7a3b] hover:bg-[#0a6632] text-white text-base font-medium transition-all"
                                    tabIndex={4}
                                    disabled={processing}
                                    data-test="login-button"
                                >
                                    {processing ? (
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    ) : null}
                                    Masuk
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </>
                        )}
                    </Form>

                    {status && (
                        <div className="text-center text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    {/* <div className="text-center text-sm text-muted-foreground">
                        Belum punya akun?{' '}
                        <TextLink href={register()} tabIndex={5} className="font-bold text-green-700 hover:text-green-800">
                            Daftar sekarang
                        </TextLink>
                    </div> */}
                </div>
            </div>
        </div>
    );
}
