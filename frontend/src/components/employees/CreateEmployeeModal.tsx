import { useState } from 'react';
import type { FC } from 'react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { employeeService } from '@/features/employees/services';
import styles from './CreateEmployeeModal.module.css';

interface CreateEmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const CreateEmployeeModal: FC<CreateEmployeeModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'EMPLOYEE' as 'EMPLOYEE' | 'HR' | 'ADMIN',
        department: '',
        designation: '',
        dateOfJoining: '',
        salary: '',
    });

    const [createdEmployee, setCreatedEmployee] = useState<{
        employeeId: string;
        temporaryPassword: string;
    } | null>(null);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.department.trim()) newErrors.department = 'Department is required';
        if (!formData.designation.trim()) newErrors.designation = 'Designation is required';
        if (!formData.dateOfJoining) newErrors.dateOfJoining = 'Date of joining is required';
        if (!formData.salary) newErrors.salary = 'Fixed Wage is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsLoading(true);
        setErrors({});

        try {
            const response = await employeeService.createByAdmin({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phone,
                role: formData.role,
                department: formData.department,
                designation: formData.designation,
                joiningDate: new Date(formData.dateOfJoining).toISOString(),
                salary: parseFloat(formData.salary),
                companyName: 'Company', // TODO: Get from settings
            });

            if (response.success && response.data) {
                setCreatedEmployee({
                    employeeId: response.data.user.employeeId,
                    temporaryPassword: response.data.temporaryPassword,
                });
            } else {
                setErrors({ submit: response.message || 'Failed to create employee' });
            }
        } catch (error: any) {
            setErrors({ submit: error.message || 'Failed to create employee' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (createdEmployee) {
            onSuccess();
        }
        setCreatedEmployee(null);
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            role: 'EMPLOYEE',
            department: '',
            designation: '',
            dateOfJoining: '',
            salary: '',
        });
        setErrors({});
        onClose();
    };

    return (
        <div className={styles.overlay} onClick={handleClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Create New Employee</h2>
                    <button className={styles.closeButton} onClick={handleClose}>×</button>
                </div>

                {createdEmployee ? (
                    <div className={styles.successContent}>
                        <div className={styles.successIcon}>✓</div>
                        <h3>Employee Created Successfully!</h3>
                        <div className={styles.credentials}>
                            <div className={styles.credentialItem}>
                                <label>Employee ID:</label>
                                <div className={styles.credentialValue}>
                                    <span>{createdEmployee.employeeId}</span>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(createdEmployee.employeeId)}
                                        className={styles.copyButton}
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>
                            <div className={styles.credentialItem}>
                                <label>Temporary Password:</label>
                                <div className={styles.credentialValue}>
                                    <span>{createdEmployee.temporaryPassword}</span>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(createdEmployee.temporaryPassword)}
                                        className={styles.copyButton}
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>
                        </div>
                        <p className={styles.note}>
                            Please share these credentials with the employee. They can use either their email or employee ID to log in.
                        </p>
                        <Button onClick={handleClose}>Done</Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label>First Name *</label>
                                <Input
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    error={errors.firstName}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Last Name *</label>
                                <Input
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    error={errors.lastName}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Email *</label>
                                <Input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    error={errors.email}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Phone *</label>
                                <Input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    error={errors.phone}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Role *</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className={styles.select}
                                >
                                    <option value="EMPLOYEE">Employee</option>
                                    <option value="HR">HR Officer</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Department *</label>
                                <Input
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    error={errors.department}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Designation *</label>
                                <Input
                                    name="designation"
                                    value={formData.designation}
                                    onChange={handleChange}
                                    error={errors.designation}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Date of Joining *</label>
                                <Input
                                    type="date"
                                    name="dateOfJoining"
                                    value={formData.dateOfJoining}
                                    onChange={handleChange}
                                    error={errors.dateOfJoining}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Fixed Wage (CTC) *</label>
                                <Input
                                    type="number"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    placeholder="Enter total monthly wage"
                                    error={errors.salary}
                                />
                            </div>
                        </div>

                        {errors.submit && (
                            <div className={styles.error}>{errors.submit}</div>
                        )}

                        <div className={styles.actions}>
                            <Button type="button" variant="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Creating...' : 'Create Employee'}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
