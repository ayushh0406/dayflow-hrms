import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { companyService } from '@/features/company/services';
import type { Company } from '@/features/company/services';
import styles from './CompanySettings.module.css';

export const CompanySettings: FC = () => {
    const [company, setCompany] = useState<Company | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        logo: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        loadCompany();
    }, []);

    const loadCompany = async () => {
        try {
            setIsFetching(true);
            const response = await companyService.getCompany();
            if (response.success && response.data) {
                setCompany(response.data);
                setFormData({
                    name: response.data.name,
                    logo: response.data.logo || '',
                });
            }
        } catch (error) {
            console.error('Failed to load company:', error);
        } finally {
            setIsFetching(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Company name is required';
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
            const response = await companyService.updateCompany({
                name: formData.name,
                logo: formData.logo || undefined,
            });

            if (response.success) {
                alert('Company details updated successfully!');
                loadCompany();
            } else {
                setErrors({ submit: response.message || 'Failed to update company' });
            }
        } catch (error: any) {
            setErrors({ submit: error.message || 'Failed to update company' });
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <div className={styles.loading}>Loading company details...</div>;
    }

    if (!company) {
        return (
            <div className={styles.noCompany}>
                <p>No company information found. Please contact support.</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Company Settings</h1>
                <p>Manage your company information</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label>Company Name *</label>
                    <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        placeholder="Enter company name"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Company Logo URL</label>
                    <Input
                        name="logo"
                        value={formData.logo}
                        onChange={handleChange}
                        error={errors.logo}
                        placeholder="Enter logo URL (optional)"
                    />
                    {formData.logo && (
                        <div className={styles.logoPreview}>
                            <img src={formData.logo} alt="Company Logo Preview" />
                        </div>
                    )}
                </div>

                {errors.submit && (
                    <div className={styles.error}>{errors.submit}</div>
                )}

                <div className={styles.actions}>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Updating...' : 'Update Company'}
                    </Button>
                </div>
            </form>
        </div>
    );
};
