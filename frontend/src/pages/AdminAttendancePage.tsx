import { useState } from 'react';
import type { FC } from 'react';
import { Input } from '@/components/common/Input';
import styles from './AdminAttendancePage.module.css';

interface AttendanceRecord {
  id: string;
  employeeName: string;
  checkIn: string;
  checkOut: string;
  workHours: string;
  extraHours: string;
}

export const AdminAttendancePage: FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('22/10/2025');
  const [selectedMonth, setSelectedMonth] = useState('Oct');
  
  const attendanceData: AttendanceRecord[] = [
    {
      id: '1',
      employeeName: '[Employee]',
      checkIn: '10:00',
      checkOut: '19:00',
      workHours: '09:00',
      extraHours: '01:00'
    },
    {
      id: '2',
      employeeName: '[Employee]',
      checkIn: '10:00',
      checkOut: '19:00',
      workHours: '09:00',
      extraHours: '01:00'
    }
  ];

  const handleDateNavigation = (direction: 'prev' | 'next') => {
    // Handle date navigation
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
        <div className={styles.headerRight}>
          <div className={styles.searchContainer}>
            <Input
              type="text"
              placeholder="Searchbar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {/* Modern Navigation Bar */}
        <div className={styles.navigationBar}>
          <div className={styles.navSection}>
            <div className={styles.navControls}>
              <button 
                className={styles.navButton}
                onClick={() => handleDateNavigation('prev')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <button 
                className={styles.navButton}
                onClick={() => handleDateNavigation('next')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
              <div className={styles.dateDropdown}>
                <button className={styles.dropdownButton}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Date
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
              </div>
              <div className={styles.dayDisplay}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
                <span>Day</span>
              </div>
            </div>
          </div>
          
          <div className={styles.statsSection}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <path d="M20 8v6M23 11h-6"/>
                </svg>
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>12</span>
                <span className={styles.statLabel}>Present</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <path d="M23 11l-2 2-2-2"/>
                </svg>
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>3</span>
                <span className={styles.statLabel}>Absent</span>
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
                <th className={styles.empColumn}>Emp</th>
                <th className={styles.timeColumn}>Check In</th>
                <th className={styles.timeColumn}>Check Out</th>
                <th className={styles.hoursColumn}>Work Hours</th>
                <th className={styles.hoursColumn}>Extra hours</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((record) => (
                <tr key={record.id} className={styles.tableRow}>
                  <td className={styles.empCell}>{record.employeeName}</td>
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