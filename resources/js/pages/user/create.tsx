import UserController from '@/actions/App/Http/Controllers/UserController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { ArrowRight, Eye, EyeOff, LoaderCircle, Store, Users } from 'lucide-react';
import { useState } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
            <Head title="Registrasi" />

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
                        Platform manajemen proyek terintegrasi untuk memantau, mengelola, dan melaporkan keberhasilan proyek sosial Anda.
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
                {/* Mobile Logo */}
                <div className="mb-8 flex items-center gap-2 text-lg font-medium lg:hidden">
                    <AppLogoIcon className="h-10 w-10 text-[#0a3825]" />
                    <span className="text-xl font-bold tracking-tight text-[#0a3825]">SocialImpact.ID</span>
                </div>

                <div className="mx-auto w-full max-w-[400px] space-y-6">
                    <div className="space-y-2 text-center lg:text-left">
                        <h2 className="text-3xl font-bold">Registrasi</h2>
                        <p className="text-muted-foreground">Buat akun baru untuk mulai mengelola.</p>
                    </div>

                    <Form
                        {...UserController.store.form()}
                        resetOnSuccess={['password', 'password_confirmation']}
                        disableWhileProcessing
                        className="space-y-4"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Lengkap</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        name="name"
                                        placeholder="Nama Lengkap"
                                        className="h-12"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        name="email"
                                        placeholder="example@gmail.com"
                                        className="h-12"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            tabIndex={3}
                                            autoComplete="new-password"
                                            name="password"
                                            placeholder="••••••••"
                                            className="h-12 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password_confirmation"
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            tabIndex={4}
                                            autoComplete="new-password"
                                            name="password_confirmation"
                                            placeholder="••••••••"
                                            className="h-12 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            tabIndex={-1}
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-2 h-12 w-full bg-[#0a7a3b] hover:bg-[#0a6632] text-white text-base font-medium transition-all"
                                    tabIndex={5}
                                    data-test="register-user-button"
                                >
                                    {processing && (
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Daftar Sekarang
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </>
                        )}
                    </Form>

                    <div className="text-center text-sm text-muted-foreground">
                        Sudah punya akun?{' '}
                        <TextLink href={login()} tabIndex={6} className="font-bold text-green-700 hover:text-green-800">
                            Masuk
                        </TextLink>
                    </div>
                </div>
            </div>
        </div>
    );
}
