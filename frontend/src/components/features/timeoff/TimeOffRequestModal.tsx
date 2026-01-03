import { useState } from 'react';
import type { FC } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import styles from './TimeOffRequestModal.module.css';

interface TimeOffRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TimeOffRequestData) => void;
}

interface TimeOffRequestData {
  employee: string;
  timeOffType: 'paid-time-off' | 'sick-time-off' | 'unpaid-time-off';
  startDate: string;
  endDate: string;
  allocation: number;
  attachment?: File;
}

export const TimeOffRequestModal: FC<TimeOffRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<TimeOffRequestData>({
    employee: '',
    timeOffType: 'paid-time-off',
    startDate: '',
    endDate: '',
    allocation: 1,
    attachment: undefined
  });

  const handleSubmit = () => {
    if (!formData.employee || !formData.startDate || !formData.endDate) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
    onClose();
  };

  const handleDiscard = () => {
    // Reset form data
    setFormData({
      employee: '',
      timeOffType: 'paid-time-off',
      startDate: '',
      endDate: '',
      allocation: 1,
      attachment: undefined
    });
    onClose();
  };

  const handleInputChange = (field: keyof TimeOffRequestData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, attachment: file }));
    }
  };

  const getTimeOffTypeDisplay = (type: string) => {
    switch (type) {
      case 'paid-time-off': return 'Paid Time Off';
      case 'sick-time-off': return 'Sick Time Off';
      case 'unpaid-time-off': return 'Unpaid Time Off';
      default: return 'Paid Time Off';
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Time off Type Request</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Form Content */}
        <div className={styles.modalContent}>
          {/* Employee Field */}
          <div className={styles.formRow}>
            <label className={styles.label}>Employee</label>
            <Input
              type="text"
              placeholder="Enter employee name"
              value={formData.employee}
              onChange={(e) => handleInputChange('employee', e.target.value)}
              className={styles.inputField}
            />
          </div>

          {/* Time off Type */}
          <div className={styles.formRow}>
            <label className={styles.label}>Time off Type</label>
            <select
              value={formData.timeOffType}
              onChange={(e) => handleInputChange('timeOffType', e.target.value)}
              className={styles.selectField}
            >
              <option value="paid-time-off">Paid Time Off</option>
              <option value="sick-time-off">Sick Time Off</option>
              <option value="unpaid-time-off">Unpaid Time Off</option>
            </select>
          </div>

          {/* Validity Period */}
          <div className={styles.formRow}>
            <label className={styles.label}>Validity Period</label>
            <div className={styles.dateRange}>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className={styles.dateInput}
              />
              <span className={styles.dateSeparator}>To</span>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className={styles.dateInput}
              />
            </div>
          </div>

          {/* Allocation */}
          <div className={styles.formRow}>
            <label className={styles.label}>Allocation</label>
            <div className={styles.allocationContainer}>
              <Input
                type="number"
                min="0.5"
                max="365"
                step="0.5"
                value={formData.allocation}
                onChange={(e) => handleInputChange('allocation', parseFloat(e.target.value) || 1)}
                className={styles.allocationInput}
              />
              <span className={styles.allocationUnit}>Days</span>
            </div>
          </div>

          {/* Attachment */}
          <div className={styles.formRow}>
            <label className={styles.label}>Attachment:</label>
            <div className={styles.attachmentContainer}>
              <input
                type="file"
                id="fileUpload"
                className={styles.fileInput}
                onChange={handleFileUpload}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <label htmlFor="fileUpload" className={styles.uploadButton}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </label>
              <div className={styles.attachmentInfo}>
                {formData.attachment ? (
                  <span className={styles.fileName}>{formData.attachment.name}</span>
                ) : (
                  <span className={styles.attachmentNote}>(For sick leave certificate)</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.modalActions}>
          <Button
            variant="primary"
            onClick={handleSubmit}
            className={styles.submitButton}
          >
            Submit
          </Button>
          <Button
            variant="outline"
            onClick={handleDiscard}
            className={styles.discardButton}
          >
            Discard
          </Button>
        </div>
      </div>
    </div>
  );
};