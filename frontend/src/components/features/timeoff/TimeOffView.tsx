import { useState } from 'react';
import type { FC } from 'react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { TimeOffRequestModal } from './TimeOffRequestModal';
import styles from './TimeOffView.module.css';

interface TimeOffRecord {
  id: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  timeOffType: 'paid-time-off' | 'sick-time-off' | 'unpaid-time-off';
  status: 'pending' | 'approved' | 'rejected';
  daysCount: number;
}

interface TimeOffViewProps {
  userRole?: 'admin' | 'employee'; // Default to admin for now
}

export const TimeOffView: FC<TimeOffViewProps> = ({ userRole = 'admin' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'time-off' | 'allocation'>('time-off');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const timeOffRequests: TimeOffRecord[] = [
    {
      id: '1',
      employeeName: '[Emp Name]',
      startDate: '28/10/2025',
      endDate: '28/10/2025',
      timeOffType: 'paid-time-off',
      status: 'pending',
      daysCount: 1
    },
    {
      id: '2',
      employeeName: 'John Doe',
      startDate: '30/10/2025',
      endDate: '01/11/2025',
      timeOffType: 'sick-time-off',
      status: 'approved',
      daysCount: 2
    },
    {
      id: '3',
      employeeName: 'Jane Smith',
      startDate: '05/11/2025',
      endDate: '07/11/2025',
      timeOffType: 'paid-time-off',
      status: 'pending',
      daysCount: 3
    }
  ];

  const handleApprove = (id: string) => {
    console.log('Approve request:', id);
    alert(`Time off request ${id} approved!`);
  };

  const handleReject = (id: string) => {
    console.log('Reject request:', id);
    alert(`Time off request ${id} rejected!`);
  };

  const handleNewTimeOff = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = (data: any) => {
    console.log('New time off request:', data);
    alert('Time off request submitted successfully!');
    setIsModalOpen(false);
  };

  const filteredRequests = timeOffRequests.filter(request =>
    request.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paidTimeOffDays = 24;
  const sickTimeOffDays = 7;

  return (
    <div className={styles.timeOffContainer}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <div className={styles.tabsContainer}>
          <button 
            className={`${styles.tab} ${activeTab === 'time-off' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('time-off')}
          >
            Time Off
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'allocation' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('allocation')}
          >
            Allocation
          </button>
        </div>

        <div className={styles.headerControls}>
          {userRole === 'admin' && (
            <Button 
              variant="primary" 
              onClick={handleNewTimeOff}
              className={styles.newButton}
            >
              NEW
            </Button>
          )}
          
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

      {/* Statistics Section */}
      <div className={styles.statsSection}>
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Paid time Off</h3>
          <div className={styles.statValue}>{paidTimeOffDays} Days Available</div>
        </div>
        
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Sick time off</h3>
          <div className={styles.statValue}>{sickTimeOffDays} Days Available</div>
        </div>
      </div>

      {/* Time Off Table */}
      <div className={styles.tableContainer}>
        <table className={styles.timeOffTable}>
          <thead>
            <tr>
              <th className={styles.nameColumn}>Name</th>
              <th className={styles.dateColumn}>Start Date</th>
              <th className={styles.dateColumn}>End Date</th>
              <th className={styles.typeColumn}>Time off Type</th>
              {userRole === 'admin' && <th className={styles.statusColumn}>Status</th>}
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request) => (
              <tr key={request.id} className={styles.tableRow}>
                <td className={styles.nameCell}>{request.employeeName}</td>
                <td className={styles.dateCell}>{request.startDate}</td>
                <td className={styles.dateCell}>{request.endDate}</td>
                <td className={styles.typeCell}>
                  <span className={`${styles.typeTag} ${styles[request.timeOffType.replace('-', '')]}`}>
                    {request.timeOffType === 'paid-time-off' 
                      ? 'Paid time Off' 
                      : request.timeOffType === 'sick-time-off' 
                      ? 'Sick time off' 
                      : 'Unpaid time off'
                    }
                  </span>
                </td>
                {userRole === 'admin' && (
                  <td className={styles.statusCell}>
                    {request.status === 'pending' ? (
                      <div className={styles.actionButtons}>
                        <button 
                          className={styles.rejectButton}
                          onClick={() => handleReject(request.id)}
                          title="Reject"
                        >
                          ✕
                        </button>
                        <button 
                          className={styles.approveButton}
                          onClick={() => handleApprove(request.id)}
                          title="Approve"
                        >
                          ✓
                        </button>
                      </div>
                    ) : (
                      <span className={`${styles.statusBadge} ${styles[request.status]}`}>
                        {request.status}
                      </span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Time Off Request Modal */}
      <TimeOffRequestModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};