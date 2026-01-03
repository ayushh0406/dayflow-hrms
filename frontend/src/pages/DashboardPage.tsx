import { useState } from 'react';
import type { FC } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { EmployeeCard } from '@/components/common/EmployeeCard';
import { AdminAttendanceView } from '@/components/features/attendance/AdminAttendanceView';
import { EmployeeAttendanceView } from '@/components/features/attendance/EmployeeAttendanceView';
import { TimeOffView } from '@/components/features/timeoff/TimeOffView';
import { Button } from '@/components/common/Button';
import styles from './DashboardPage.module.css';

type DashboardView = 'employees' | 'admin-attendance' | 'employee-attendance' | 'time-off';

// Mock employee data
const mockEmployees = [
  {
    id: '1',
    name: 'John Doe',
    position: 'Software Engineer',
    department: 'Engineering',
    status: 'PRESENT' as const,
    profilePicture: '',
  },
  {
    id: '2',
    name: 'Jane Smith',
    position: 'Product Manager',
    department: 'Product',
    status: 'LEAVE' as const,
    profilePicture: '',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    position: 'Designer',
    department: 'Design',
    status: 'ABSENT' as const,
    profilePicture: '',
  },
  {
    id: '4',
    name: 'Sarah Williams',
    position: 'HR Manager',
    department: 'Human Resources',
    status: 'PRESENT' as const,
    profilePicture: '',
  },
  {
    id: '5',
    name: 'David Brown',
    position: 'DevOps Engineer',
    department: 'Engineering',
    status: 'PRESENT' as const,
    profilePicture: '',
  },
  {
    id: '6',
    name: 'Emily Davis',
    position: 'Marketing Lead',
    department: 'Marketing',
    status: 'HALF_DAY' as const,
    profilePicture: '',
  },
];

export const DashboardPage: FC = () => {
  const [currentView, setCurrentView] = useState<DashboardView>('employees');

  const handleEmployeeClick = (employeeId: string) => {
    console.log('Open employee profile:', employeeId);
    alert(`Opening profile for employee ID: ${employeeId}\n(View-only mode)`);
  };

  const handleNewEmployee = () => {
    alert('Opening New Employee form...');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'employees':
        return (
          <div className={styles.employeesView}>
            <div className={styles.employeesHeader}>
              <Button 
                variant="primary" 
                size="md"
                onClick={handleNewEmployee}
                className={styles.newButton}
              >
                NEW
              </Button>
            </div>
            <div className={styles.employeeGrid}>
              {mockEmployees.map((employee) => (
                <EmployeeCard
                  key={employee.id}
                  id={employee.id}
                  name={employee.name}
                  position={employee.position}
                  department={employee.department}
                  status={employee.status}
                  profilePicture={employee.profilePicture}
                  onClick={() => handleEmployeeClick(employee.id)}
                />
              ))}
            </div>
          </div>
        );
      
      case 'admin-attendance':
        return <AdminAttendanceView />;
        
      case 'employee-attendance':
        return <EmployeeAttendanceView />;
        
      case 'time-off':
        return <TimeOffView userRole="admin" />;
        
      default:
        return null;
    }
  };

  return (
    <DashboardLayout currentView={currentView} onViewChange={setCurrentView}>
      {renderContent()}
    </DashboardLayout>
  );
};