import { useState } from 'react';
import type { FC } from 'react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { authService } from '@/features/auth/services';
import styles from './AuthPages.module.css';

export const SignInPage: FC = () => {
    const [formData, setFormData] = useState({
        loginId: '',
        password: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.loginId.trim()) {
            newErrors.loginId = 'Login ID is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsLoading(true);
        setErrors({});

        try {
            const response = await authService.signIn({
                email: formData.loginId,
                password: formData.password,
            });

            if (response.success) {
                window.location.href = '/dashboard';
            } else {
                setErrors({ submit: response.message || 'Sign in failed. Please try again.' });
            }
        } catch (error: any) {
            setErrors({ submit: error.message || 'Invalid credentials. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <div className={styles.logoContainer}>
                    <div className={styles.logo}>App/Web Logo</div>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <Input
                        label="Login ID/Email :-"
                        name="loginId"
                        placeholder=""
                        value={formData.loginId}
                        onChange={handleChange}
                        error={errors.loginId}
                        autoComplete="username"
                    />

                    <Input
                        label="Password :-"
                        name="password"
                        type="password"
                        placeholder=""
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        autoComplete="current-password"
                    />

                    {errors.submit && (
                        <div className={styles.errorMessage}>{errors.submit}</div>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        isLoading={isLoading}
                        className={styles.submitButton}
                    >
                        SIGN IN
                    </Button>

                    <p className={styles.linkText}>
                        Don't have an account?{' '}
                        <a href="/sign-up" className={styles.link}>
                            Sign Up
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
};