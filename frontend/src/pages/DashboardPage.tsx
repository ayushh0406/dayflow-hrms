import { useState } from 'react';
import type { FC } from 'react';
import { Header } from '@/components/layout/Header';
import { EmployeeCard } from '@/components/common/EmployeeCard';
import { Button } from '@/components/common/Button';
import styles from './DashboardPage.module.css';

// Mock data - replace with actual API data
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const filteredEmployees = mockEmployees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEmployeeClick = (employeeId: string) => {
    // TODO: Navigate to employee profile view
    console.log('Open employee profile:', employeeId);
    alert(`Opening profile for employee ID: ${employeeId}\n(View-only mode)`);
  };

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    alert('Checked In successfully! Status changed to Green.');
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    alert('Checked Out successfully! Status changed to Red.');
  };

  const handleProfileClick = () => {
    window.location.href = '/profile';
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      // TODO: Clear auth and redirect to login
      window.location.href = '/sign-in';
    }
  };

  const handleNewEmployee = () => {
    alert('Opening New Employee form...');
    // TODO: Navigate to create employee page
  };

  return (
    <div className={styles.dashboardContainer}>
      <Header
        companyName="Company Logo"
        userName="Current User"
        isCheckedIn={isCheckedIn}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        onProfileClick={handleProfileClick}
        onLogout={handleLogout}
      />

      <main className={styles.mainContent}>
        <div className={styles.toolbar}>
          <Button 
            variant="primary" 
            size="md"
            onClick={handleNewEmployee}
            className={styles.newButton}
          >
            NEW
          </Button>

          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search"
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg 
              className={styles.searchIcon} 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
        </div>

        <div className={styles.employeeGrid}>
          {filteredEmployees.map((employee) => (
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

        {filteredEmployees.length === 0 && (
          <div className={styles.emptyState}>
            <p>No employees found matching "{searchQuery}"</p>
          </div>
        )}
      </main>
    </div>
  );
};