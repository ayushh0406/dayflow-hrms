import { useState } from 'react';
import type { FC } from 'react';
import { Input } from '@/components/common/Input';
import styles from './AdminAttendanceView.module.css';

interface AttendanceRecord {
  id: string;
  employeeName: string;
  checkIn: string;
  checkOut: string;
  workHours: string;
  extraHours: string;
}

export const AdminAttendanceView: FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
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
    console.log(`Navigate ${direction}`);
  };

  return (
    <div className={styles.attendanceView}>
      {/* Search Bar */}
      <div className={styles.searchSection}>
        <Input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Navigation Controls */}
      <div className={styles.navigationBar}>
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
          
          <div className={styles.dateSelector}>
            <button className={styles.dateButton}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Date
            </button>
          </div>
          
          <div className={styles.dayIndicator}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            Day
          </div>
        </div>

        {/* Statistics */}
        <div className={styles.statsSection}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>12</span>
            <span className={styles.statLabel}>Present</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>3</span>
            <span className={styles.statLabel}>Absent</span>
          </div>
        </div>
      </div>

      {/* Current Date */}
      <div className={styles.currentDate}>
        <h3>22, October 2025</h3>
        <span className={styles.dayName}>Tuesday</span>
      </div>

      {/* Attendance Table */}
      <div className={styles.tableContainer}>
        <table className={styles.attendanceTable}>
          <thead>
            <tr>
              <th>Emp</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Work Hours</th>
              <th>Extra hours</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((record) => (
              <tr key={record.id}>
                <td className={styles.empCell}>{record.employeeName}</td>
                <td>{record.checkIn}</td>
                <td>{record.checkOut}</td>
                <td className={styles.hoursCell}>{record.workHours}</td>
                <td className={styles.hoursCell}>{record.extraHours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};