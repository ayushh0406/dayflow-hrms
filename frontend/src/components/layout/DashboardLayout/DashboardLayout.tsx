import { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';
import { Input } from '@/components/common/Input';
import styles from './DashboardLayout.module.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentView: 'overview' | 'employees' | 'admin-attendance' | 'employee-attendance' | 'time-off';
  onViewChange: (view: DashboardLayoutProps['currentView']) => void;
}

export const DashboardLayout: FC<DashboardLayoutProps> = ({
  children,
  currentView,
  onViewChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  const handleProfileClick = () => {
    window.location.href = '/profile';
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      window.location.href = '/';
    }
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Persistent Header with Navigation */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>
            <span>Company Logo</span>
          </div>

          {/* Main Navigation */}
          <nav className={styles.nav}>
            <button
              className={`${styles.navItem} ${currentView === 'overview' ? styles.active : ''}`}
              onClick={() => onViewChange('overview')}
            >
              Dashboard
            </button>

            <button
              className={`${styles.navItem} ${currentView === 'employees' ? styles.active : ''}`}
              onClick={() => onViewChange('employees')}
            >
              Employees
            </button>

            <div className={styles.attendanceDropdown}>
              <button
                className={`${styles.navItem} ${currentView.includes('attendance') ? styles.active : ''}`}
              >
                Attendance
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <div className={styles.dropdownMenu}>
                <button
                  className={styles.dropdownItem}
                  onClick={() => onViewChange('admin-attendance')}
                >
                  Admin View
                </button>
                <button
                  className={styles.dropdownItem}
                  onClick={() => onViewChange('employee-attendance')}
                >
                  Employee View
                </button>
              </div>
            </div>

            <button
              className={`${styles.navItem} ${currentView === 'time-off' ? styles.active : ''}`}
              onClick={() => onViewChange('time-off')}
            >
              Time Off
            </button>
          </nav>
        </div>

        <div className={styles.headerRight}>
          {/* Search - show only on employees view */}
          {currentView === 'employees' && (
            <div className={styles.searchContainer}>
              <Input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          )}

          {/* Attendance Status Button */}
          <button className={styles.attendanceButton}>
            <div className={styles.statusDot}></div>
            <span>Check In</span>
          </button>

          {/* Profile Menu */}
          <div className={styles.profileMenu}>
            <button
              className={styles.profileButton}
              onClick={toggleProfileDropdown}
            >
              <div className={styles.avatar}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <path d="M20 8v6M23 11h-6" />
                </svg>
              </div>
            </button>

            {showProfileDropdown && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownHeader}>
                  <div className={styles.avatar}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                    </svg>
                  </div>
                  <span className={styles.userName}>Current User</span>
                </div>
                <div className={styles.dropdownDivider}></div>
                <button
                  className={styles.dropdownItem}
                  onClick={handleProfileClick}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                  </svg>
                  My Profile
                </button>
                <button
                  className={styles.dropdownItem}
                  onClick={handleLogout}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16,17 21,12 16,7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {children}
      </div>
    </div>
  );
};