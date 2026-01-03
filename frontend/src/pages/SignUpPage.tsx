import { useState } from 'react';
import type { FC } from 'react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { authService } from '@/features/auth/services';
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
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, companyLogo: 'Please select an image file' }));
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, companyLogo: 'File size should not exceed 5MB' }));
        return;
      }

      setLogoFile(file);
      setErrors(prev => ({ ...prev, companyLogo: '' }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
    setErrors({});

    try {
      const [firstName, ...lastNameParts] = formData.name.split(' ');
      const lastName = lastNameParts.join(' ') || '';

      // Generate employee ID for first admin user
      const employeeId = `OIJODO${new Date().getFullYear()}${String(1).padStart(4, '0')}`;

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('employeeId', employeeId);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('role', 'ADMIN');
      formDataToSend.append('firstName', firstName);
      formDataToSend.append('lastName', lastName);
      formDataToSend.append('companyName', formData.companyName);
      if (logoFile) {
        formDataToSend.append('companyLogo', logoFile);
      }

      const response = await authService.signUp(formDataToSend);

      if (response.success) {
        alert('Admin account created successfully! You can now create employees from the dashboard.');
        window.location.href = '/dashboard';
      } else {
        setErrors({ submit: response.message || 'Registration failed. Please try again.' });
      }
    } catch (error: any) {
      setErrors({ submit: error.message || 'Registration failed. Please try again.' });
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
          />

          <div className={styles.inputGroup}>
            <label className={styles.label}>Company Logo (optional) :-</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className={styles.fileInput}
            />
            {errors.companyLogo && (
              <span className={styles.errorText}>{errors.companyLogo}</span>
            )}
            {logoPreview && (
              <div className={styles.logoPreview}>
                <img src={logoPreview} alt="Logo preview" />
              </div>
            )}
          </div>

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