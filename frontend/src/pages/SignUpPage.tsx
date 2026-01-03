import { useState } from 'react';
import type { FC } from 'react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import styles from './AuthPages.module.css';

export const SignUpPage: FC = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLogoSelect = (file: File) => {
    setCompanyLogo(file);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Sign Up Data:', { ...formData, companyLogo });
      
      // Show success message or navigate
      alert('Registration successful! Please check your email for verification.');
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={`${styles.authCard} ${styles.signUpCard}`}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>App/Web Logo</div>
        </div>

        {formData.companyName && (
          <div className={styles.companyDisplay}>
            {formData.companyName}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Company Name :-"
            name="companyName"
            placeholder=""
            value={formData.companyName}
            onChange={handleChange}
            error={errors.companyName}
            icon="upload"
            onFileSelect={handleLogoSelect}
          />

          <Input
            label="Name :-"
            name="name"
            placeholder=""
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />

          <Input
            label="Email :-"
            name="email"
            type="email"
            placeholder=""
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
          />

          <Input
            label="Phone :-"
            name="phone"
            type="tel"
            placeholder=""
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            autoComplete="tel"
          />

          <Input
            label="Password :-"
            name="password"
            type="password"
            placeholder=""
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="new-password"
          />

          <Input
            label="Confirm Password :-"
            name="confirmPassword"
            type="password"
            placeholder=""
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            autoComplete="new-password"
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
            Sign Up
          </Button>

          <p className={styles.linkText}>
            Already have an account?{' '}
            <a href="/sign-in" className={styles.link}>
              Sign In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};