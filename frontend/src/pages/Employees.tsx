import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Button } from '@/components/common/Button';
import { employeeService, type Employee } from '@/features/employees/services';
import { CreateEmployeeModal } from '@/components/employees/CreateEmployeeModal';
import styles from './Employees.module.css';

export const EmployeesPage: FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchEmployees = async () => {
        try {
            setIsLoading(true);
            const response = await employeeService.getAll();
            if (response.success && response.data) {
                setEmployees(response.data);
            } else {
                setError(response.message || 'Failed to fetch employees');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleEmployeeClick = (id: string) => {
        window.location.href = `/profile?id=${id}`;
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Employees</h1>
                <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
                    Add Employee
                </Button>
            </div>

            {isLoading ? (
                <div className={styles.loading}>Loading...</div>
            ) : error ? (
                <div className={styles.error}>{error}</div>
            ) : (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Employee ID</th>
                                <th>Department</th>
                                <th>Designation</th>
                                <th>Email</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee) => (
                                <tr
                                    key={employee.id}
                                    onClick={() => handleEmployeeClick(employee.id)}
                                    className={styles.row}
                                >
                                    <td>{employee.firstName} {employee.lastName}</td>
                                    <td>{employee.employeeId}</td>
                                    <td>{employee.department}</td>
                                    <td>{employee.designation}</td>
                                    <td>{employee.email}</td>
                                    <td>
                                        <span className={`${styles.status} ${employee.isActive ? styles.active : styles.inactive}`}>
                                            {employee.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <CreateEmployeeModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    setIsCreateModalOpen(false);
                    fetchEmployees();
                }}
            />
        </div>
    );
};
