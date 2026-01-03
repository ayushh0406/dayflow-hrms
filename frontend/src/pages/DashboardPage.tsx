import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { EmployeeCard } from '@/components/common/EmployeeCard';
import { Button } from '@/components/common/Button';
import { CreateEmployeeModal } from '@/components/employees/CreateEmployeeModal';
import { dashboardService, type DashboardStats } from '@/features/dashboard/services';
import { employeeService, type Employee } from '@/features/employees/services';
import { attendanceService } from '@/features/attendance/services';
import styles from './DashboardPage.module.css';

type DashboardView = 'overview' | 'employees' | 'admin-attendance' | 'employee-attendance' | 'time-off';

export const DashboardPage: FC = () => {
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState<'checked-in' | 'checked-out' | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, employeesRes, meRes] = await Promise.all([
        dashboardService.getDashboard(),
        employeeService.getAll(),
        employeeService.getMe()
      ]);

      if (statsRes.data) setStats(statsRes.data);
      if (employeesRes.data) setEmployees(employeesRes.data);
      if (meRes.data) setCurrentUser(meRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      await attendanceService.checkInOut('checkin');
      setCheckInStatus('checked-in');
      fetchDashboardData(); // Refresh stats
      alert('Checked in successfully!');
    } catch (error) {
      console.error('Check-in failed:', error);
      alert('Check-in failed. Please try again.');
    }
  };

  const handleCheckOut = async () => {
    try {
      await attendanceService.checkInOut('checkout');
      setCheckInStatus('checked-out');
      fetchDashboardData(); // Refresh stats
      alert('Checked out successfully!');
    } catch (error) {
      console.error('Check-out failed:', error);
      alert('Check-out failed. Please try again.');
    }
  };

  const handleEmployeeCreated = () => {
    fetchDashboardData();
    setIsCreateModalOpen(false);
  };

  const renderOverview = () => {
    if (!stats) return null;

    // Check if it's admin dashboard by checking for a unique property
    const isAdmin = 'totalEmployees' in stats;

    return (
      <div className={styles.overview}>
        <div className={styles.welcomeSection}>
          <h1>Welcome back, {currentUser?.firstName}!</h1>
          <div className={styles.actions}>
            <Button onClick={handleCheckIn} variant="primary" disabled={checkInStatus === 'checked-in'}>
              Check In
            </Button>
            <Button onClick={handleCheckOut} variant="outline" disabled={checkInStatus === 'checked-out'}>
              Check Out
            </Button>
          </div>
        </div>

        {isAdmin ? (
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>Total Employees</h3>
              <p className={styles.statValue}>{(stats as any).totalEmployees}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Present Today</h3>
              <p className={styles.statValue}>{(stats as any).attendance?.present ?? 0}</p>
            </div>
            <div className={styles.statCard}>
              <h3>On Leave</h3>
              <p className={styles.statValue}>{(stats as any).attendance?.leave ?? 0}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Pending Leaves</h3>
              <p className={styles.statValue}>{(stats as any).pendingLeaves?.length ?? 0}</p>
            </div>
          </div>
        ) : (
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>My Status</h3>
              <p className={styles.statValue}>{(stats as any).todayAttendance?.status ?? 'Not Marked'}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Work Hours</h3>
              <p className={styles.statValue}>{(stats as any).todayAttendance?.workHours ?? 0}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Leave Balance</h3>
              <p className={styles.statValue}>{(stats as any).leaves?.balance ?? 0}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Days Present (Month)</h3>
              <p className={styles.statValue}>{(stats as any).monthlyAttendance?.present ?? 0}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderEmployees = () => (
    <div className={styles.employeesView}>
      <div className={styles.employeesHeader}>
        <h2>Employees</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>Add Employee</Button>
      </div>
      <div className={styles.employeeGrid}>
        {employees.map((emp) => (
          <EmployeeCard
            key={emp.id}
            id={emp.id}
            name={`${emp.firstName} ${emp.lastName}`}
            position={emp.designation}
            department={emp.department}
            status={emp.isActive ? 'PRESENT' : 'ABSENT'} // Simplified status for now
            profilePicture={emp.profilePicture || ''}
            onClick={() => console.log('View employee', emp.id)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <DashboardLayout currentView={currentView} onViewChange={setCurrentView}>
      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <>
          {currentView === 'overview' && renderOverview()}
          {currentView === 'employees' && renderEmployees()}
          {/* Placeholders for other views */}
          {currentView === 'admin-attendance' && <div>Admin Attendance View (Coming Soon)</div>}
          {currentView === 'employee-attendance' && <div>Employee Attendance View (Coming Soon)</div>}
          {currentView === 'time-off' && <div>Time Off View (Coming Soon)</div>}
        </>
      )}

      <CreateEmployeeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleEmployeeCreated}
      />
    </DashboardLayout>
  );
};