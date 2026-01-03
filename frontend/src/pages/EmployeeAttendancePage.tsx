import { useState } from 'react';
import type { FC } from 'react';
import styles from './EmployeeAttendancePage.module.css';

interface EmployeeAttendanceRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string;
  workHours: string;
  extraHours: string;
}

export const EmployeeAttendancePage: FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('Oct');
  
  const attendanceData: EmployeeAttendanceRecord[] = [
    {
      id: '1',
      date: '28/10/2025',
      checkIn: '10:00',
      checkOut: '19:00',
      workHours: '09:00',
      extraHours: '01:00'
    },
    {
      id: '2',
      date: '29/10/2025',
      checkIn: '10:00',
      checkOut: '19:00',
      workHours: '09:00',
      extraHours: '01:00'
    }
  ];

  const handleMonthNavigation = (direction: 'prev' | 'next') => {
    // Handle month navigation
    console.log(`Navigate ${direction}`);
  };

  const handleBack = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className={styles.attendanceContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backButton} onClick={handleBack}>
            ← Back
          </button>
          <h1 className={styles.pageTitle}>Attendance</h1>
        </div>
      </div>

      <div className={styles.content}>
        {/* Modern Navigation Controls */}
        <div className={styles.navigationBar}>
          <div className={styles.navSection}>
            <div className={styles.navControls}>
              <button 
                className={styles.navButton}
                onClick={() => handleMonthNavigation('prev')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <button 
                className={styles.navButton}
                onClick={() => handleMonthNavigation('next')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
              <div className={styles.monthDropdown}>
                <button className={styles.dropdownButton}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {selectedMonth}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Statistics Cards */}
          <div className={styles.statsContainer}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4"/>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>22</span>
                <span className={styles.statLabel}>Days Present</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7z"/>
                </svg>
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>3</span>
                <span className={styles.statLabel}>Leaves Count</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>25</span>
                <span className={styles.statLabel}>Total Working Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Date Display */}
        <div className={styles.currentDate}>
          <div className={styles.dateCard}>
            <span className={styles.dateText}>22, October 2025</span>
            <span className={styles.dayText}>Tuesday</span>
          </div>
        </div>

        {/* Attendance Table */}
        <div className={styles.tableContainer}>
          <table className={styles.attendanceTable}>
            <thead>
              <tr>
                <th className={styles.dateColumn}>Date</th>
                <th className={styles.timeColumn}>Check In</th>
                <th className={styles.timeColumn}>Check Out</th>
                <th className={styles.hoursColumn}>Work Hours</th>
                <th className={styles.hoursColumn}>Extra hours</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((record) => (
                <tr key={record.id} className={styles.tableRow}>
                  <td className={styles.dateCell}>{record.date}</td>
                  <td className={styles.timeCell}>{record.checkIn}</td>
                  <td className={styles.timeCell}>{record.checkOut}</td>
                  <td className={styles.hoursCell}>{record.workHours}</td>
                  <td className={styles.hoursCell}>{record.extraHours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};