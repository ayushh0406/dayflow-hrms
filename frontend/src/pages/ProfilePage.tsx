import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { employeeService, type Employee } from '@/features/employees/services';
import styles from './ProfilePage.module.css';

interface SkillItem {
  id: string;
  name: string;
}

interface CertificationItem {
  id: string;
  name: string;
  issuer?: string;
  date?: string;
}

export const ProfilePage: FC = () => {
  const [activeTab, setActiveTab] = useState<'resume' | 'private' | 'salary' | 'security'>('resume');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [skills, setSkills] = useState<SkillItem[]>([
    { id: '1', name: 'JavaScript' },
    { id: '2', name: 'React' },
    { id: '3', name: 'TypeScript' },
  ]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([
    { id: '1', name: 'AWS Solutions Architect', issuer: 'Amazon', date: '2023' },
  ]);

  const [profileData, setProfileData] = useState({
    name: '',
    loginId: '',
    email: '',
    mobile: '',
    company: 'Dayflow', // Default or fetch from somewhere
    department: '',
    manager: 'N/A',
    location: '',
    designation: '',
    joiningDate: '',
    about: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
    jobLove: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
    interests: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const searchParams = new URLSearchParams(window.location.search);
        const employeeId = searchParams.get('id');

        let response;
        if (employeeId) {
          response = await employeeService.getById(employeeId);
        } else {
          response = await employeeService.getMe();
        }

        if (response.success && response.data) {
          const emp = response.data;
          setProfileData(prev => ({
            ...prev,
            name: `${emp.firstName} ${emp.lastName}`,
            loginId: emp.employeeId,
            email: emp.email,
            mobile: emp.phoneNumber || '',
            department: emp.department,
            designation: emp.designation,
            location: [emp.city, emp.state, emp.zipCode].filter(Boolean).join(', ') || emp.address || '',
            joiningDate: new Date(emp.joiningDate).toLocaleDateString(),
          }));
        } else {
          setError(response.message || 'Failed to fetch profile');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    const skillName = prompt('Enter skill name:');
    if (skillName && skillName.trim()) {
      const newSkill: SkillItem = {
        id: Date.now().toString(),
        name: skillName.trim()
      };
      setSkills(prev => [...prev, newSkill]);
    }
  };

  const addCertification = () => {
    const certName = prompt('Enter certification name:');
    if (certName && certName.trim()) {
      const newCert: CertificationItem = {
        id: Date.now().toString(),
        name: certName.trim()
      };
      setCertifications(prev => [...prev, newCert]);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleBack = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className={styles.profileContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backButton} onClick={handleBack}>
            ← Back
          </button>
          <h1 className={styles.pageTitle}>My Profile</h1>
        </div>
        <div className={styles.headerRight}>
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              onClick={() => setIsEditing(true)}
              className={styles.editButton}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className={styles.profileContent}>
        <div className={styles.profileInfo}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {/* Profile Info Card */}
            <div className={styles.profileCard}>
              <div className={styles.avatarSection}>
                <div className={styles.avatarContainer}>
                  <div className={styles.avatar}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 14v6m-3-3h6M6 10h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2Z" />
                      <path d="M14 11V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
                    </svg>
                  </div>
                  {isEditing && (
                    <button className={styles.editAvatarButton}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className={styles.basicInfo}>
                <div className={styles.infoGroup}>
                  <label>Name</label>
                  {isEditing ? (
                    <Input
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={styles.editInput}
                    />
                  ) : (
                    <div className={styles.infoValue}>{profileData.name}</div>
                  )}
                </div>

                <div className={styles.infoGroup}>
                  <label>Job Position</label>
                  <div className={styles.infoValue}>Software Engineer</div>
                </div>

                <div className={styles.infoGroup}>
                  <label>Email</label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={styles.editInput}
                    />
                  ) : (
                    <div className={styles.infoValue}>{profileData.email}</div>
                  )}
                </div>

                <div className={styles.infoGroup}>
                  <label>Mobile</label>
                  {isEditing ? (
                    <Input
                      type="tel"
                      value={profileData.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      className={styles.editInput}
                    />
                  ) : (
                    <div className={styles.infoValue}>{profileData.mobile}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Company Info */}
          <div className={styles.rightColumn}>
            <div className={styles.companyInfo}>
              <div className={styles.infoRow}>
                <div className={styles.infoGroup}>
                  <label>Company</label>
                  {isEditing ? (
                    <Input
                      value={profileData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className={styles.editInput}
                    />
                  ) : (
                    <div className={styles.infoValue}>{profileData.company}</div>
                  )}
                </div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoGroup}>
                  <label>Department</label>
                  {isEditing ? (
                    <Input
                      value={profileData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className={styles.editInput}
                    />
                  ) : (
                    <div className={styles.infoValue}>{profileData.department}</div>
                  )}
                </div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoGroup}>
                  <label>Manager</label>
                  {isEditing ? (
                    <Input
                      value={profileData.manager}
                      onChange={(e) => handleInputChange('manager', e.target.value)}
                      className={styles.editInput}
                    />
                  ) : (
                    <div className={styles.infoValue}>{profileData.manager}</div>
                  )}
                </div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoGroup}>
                  <label>Location</label>
                  {isEditing ? (
                    <Input
                      value={profileData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className={styles.editInput}
                    />
                  ) : (
                    <div className={styles.infoValue}>{profileData.location}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Centered Tabs */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'resume' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('resume')}
            >
              Resume
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'private' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('private')}
            >
              Private Info
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'salary' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('salary')}
            >
              Salary Info
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'security' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('security')}
            >
              Security
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content - Full Width Below */}
      <div className={styles.tabContent}>
        {/* Resume Tab */}
        {activeTab === 'resume' && (
          <div className={styles.contentSections}>
            {/* About Section */}
            <div className={styles.section}>
              <h3>About</h3>
              {isEditing ? (
                <textarea
                  className={styles.textArea}
                  value={profileData.about}
                  onChange={(e) => handleInputChange('about', e.target.value)}
                  rows={4}
                />
              ) : (
                <p className={styles.sectionText}>{profileData.about}</p>
              )}
            </div>

            {/* Skills Section */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3>Skills</h3>
                {isEditing && (
                  <button className={styles.addButton} onClick={addSkill}>
                    + Add Skills
                  </button>
                )}
              </div>
              <div className={styles.skillsList}>
                {skills.map(skill => (
                  <span key={skill.id} className={styles.skillTag}>
                    {skill.name}
                  </span>
                ))}
                {skills.length === 0 && (
                  <p className={styles.emptyText}>No skills added yet</p>
                )}
              </div>
            </div>

            {/* What I love about my job */}
            <div className={styles.section}>
              <h3>What I love about my job</h3>
              {isEditing ? (
                <textarea
                  className={styles.textArea}
                  value={profileData.jobLove}
                  onChange={(e) => handleInputChange('jobLove', e.target.value)}
                  rows={4}
                />
              ) : (
                <p className={styles.sectionText}>{profileData.jobLove}</p>
              )}
            </div>

            {/* Certification Section */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3>Certification</h3>
                {isEditing && (
                  <button className={styles.addButton} onClick={addCertification}>
                    + Add Skills
                  </button>
                )}
              </div>
              <div className={styles.certificationsList}>
                {certifications.map(cert => (
                  <div key={cert.id} className={styles.certificationItem}>
                    <span className={styles.certName}>{cert.name}</span>
                    {cert.issuer && <span className={styles.certIssuer}>by {cert.issuer}</span>}
                    {cert.date && <span className={styles.certDate}>{cert.date}</span>}
                  </div>
                ))}
                {certifications.length === 0 && (
                  <p className={styles.emptyText}>No certifications added yet</p>
                )}
              </div>
            </div>

            {/* My interests and hobbies */}
            <div className={styles.section}>
              <h3>My interests and hobbies</h3>
              {isEditing ? (
                <textarea
                  className={styles.textArea}
                  value={profileData.interests}
                  onChange={(e) => handleInputChange('interests', e.target.value)}
                  rows={4}
                />
              ) : (
                <p className={styles.sectionText}>{profileData.interests}</p>
              )}
            </div>
          </div>
        )}

        {/* Private Info Tab */}
        {activeTab === 'private' && (
          <div className={styles.privateInfoContent}>
            <div className={styles.privateInfoGrid}>
              <div className={styles.privateInfoLeft}>
                <div className={styles.section}>
                  <h3>Personal Information</h3>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>Date of Birth</label>
                      {isEditing ? (
                        <Input
                          type="date"
                          value="1990-01-15"
                          className={styles.editInput}
                        />
                      ) : (
                        <div className={styles.infoValue}>January 15, 1990</div>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label>Residing Address</label>
                      {isEditing ? (
                        <textarea
                          className={styles.textArea}
                          defaultValue="123 Main Street, Apartment 4B, New York, NY 10001"
                          rows={2}
                        />
                      ) : (
                        <div className={styles.infoValue}>123 Main Street, Apartment 4B, New York, NY 10001</div>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label>Nationality</label>
                      {isEditing ? (
                        <Input
                          value="American"
                          className={styles.editInput}
                        />
                      ) : (
                        <div className={styles.infoValue}>American</div>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label>Personal Email</label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value="john.doe.personal@email.com"
                          className={styles.editInput}
                        />
                      ) : (
                        <div className={styles.infoValue}>john.doe.personal@email.com</div>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label>Gender</label>
                      {isEditing ? (
                        <select className={styles.selectInput}>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      ) : (
                        <div className={styles.infoValue}>Male</div>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label>Marital Status</label>
                      {isEditing ? (
                        <select className={styles.selectInput}>
                          <option value="single">Single</option>
                          <option value="married">Married</option>
                          <option value="divorced">Divorced</option>
                        </select>
                      ) : (
                        <div className={styles.infoValue}>Single</div>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label>Date of Joining</label>
                      {isEditing ? (
                        <Input
                          type="date"
                          value="2022-03-15"
                          className={styles.editInput}
                        />
                      ) : (
                        <div className={styles.infoValue}>March 15, 2022</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.privateInfoRight}>
                <div className={styles.section}>
                  <h3>Bank Details</h3>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>Account Number</label>
                      {isEditing ? (
                        <Input
                          value="1234567890123456"
                          className={styles.editInput}
                        />
                      ) : (
                        <div className={styles.infoValue}>****-****-****-3456</div>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label>Bank Name</label>
                      {isEditing ? (
                        <Input
                          value="State Bank of India"
                          className={styles.editInput}
                        />
                      ) : (
                        <div className={styles.infoValue}>State Bank of India</div>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label>IFSC Code</label>
                      {isEditing ? (
                        <Input
                          value="SBIN0001234"
                          className={styles.editInput}
                        />
                      ) : (
                        <div className={styles.infoValue}>SBIN0001234</div>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label>PAN No</label>
                      {isEditing ? (
                        <Input
                          value="ABCDE1234F"
                          className={styles.editInput}
                        />
                      ) : (
                        <div className={styles.infoValue}>ABCDE1234F</div>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label>UAN NO</label>
                      {isEditing ? (
                        <Input
                          value="123456789012"
                          className={styles.editInput}
                        />
                      ) : (
                        <div className={styles.infoValue}>123456789012</div>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label>Emp Code</label>
                      {isEditing ? (
                        <Input
                          value="EMP001"
                          className={styles.editInput}
                        />
                      ) : (
                        <div className={styles.infoValue}>EMP001</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Salary Info Tab */}
        {activeTab === 'salary' && (
          <div className={styles.salarySection}>
            {/* Salary Overview */}
            <div className={styles.salaryOverview}>
              <div className={styles.salaryCard}>
                <div className={styles.salaryItem}>
                  <span className={styles.salaryLabel}>Month Wage</span>
                  <div className={styles.salaryValue}>
                    <span className={styles.amount}>50000</span>
                    <span className={styles.period}>/ Month</span>
                  </div>
                </div>
                <div className={styles.salaryItem}>
                  <span className={styles.salaryLabel}>Yearly Wage</span>
                  <div className={styles.salaryValue}>
                    <span className={styles.amount}>600000</span>
                    <span className={styles.period}>/ Yearly</span>
                  </div>
                </div>
              </div>

              <div className={styles.workingDays}>
                <div className={styles.workingDaysItem}>
                  <span className={styles.workingDaysLabel}>No of working days in a week:</span>
                  <div className={styles.workingDaysValue}>
                    <input type="number" defaultValue="5" className={styles.daysInput} />
                  </div>
                </div>
                <div className={styles.workingDaysItem}>
                  <span className={styles.workingDaysLabel}>Break Time:</span>
                  <div className={styles.workingDaysValue}>
                    <input type="text" defaultValue="1" className={styles.hoursInput} />
                    <span className={styles.hoursLabel}>hrs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Salary Components */}
            <div className={styles.section}>
              <h3>Salary Components</h3>

              <div className={styles.salaryComponentsList}>
                <div className={styles.salaryComponent}>
                  <div className={styles.componentInfo}>
                    <span className={styles.componentName}>Basic Salary</span>
                    <p className={styles.componentDesc}>Define Basic salary from company cost compute it based on monthly wages</p>
                  </div>
                  <div className={styles.componentValue}>
                    <span className={styles.componentAmount}>250000.00</span>
                    <span className={styles.componentCurrency}>₹ / month</span>
                  </div>
                  <div className={styles.componentPercentage}>50.00 %</div>
                </div>

                <div className={styles.salaryComponent}>
                  <div className={styles.componentInfo}>
                    <span className={styles.componentName}>House Rent Allowance</span>
                    <p className={styles.componentDesc}>HRA provided to employees 50% of the basic salary</p>
                  </div>
                  <div className={styles.componentValue}>
                    <span className={styles.componentAmount}>12500.00</span>
                    <span className={styles.componentCurrency}>₹ / month</span>
                  </div>
                  <div className={styles.componentPercentage}>50.00 %</div>
                </div>

                <div className={styles.salaryComponent}>
                  <div className={styles.componentInfo}>
                    <span className={styles.componentName}>Standard Allowance</span>
                    <p className={styles.componentDesc}>A standard allowance is a predetermined, fixed amount provided to employee as part of their salary</p>
                  </div>
                  <div className={styles.componentValue}>
                    <span className={styles.componentAmount}>4167.00</span>
                    <span className={styles.componentCurrency}>₹ / month</span>
                  </div>
                  <div className={styles.componentPercentage}>8.67 %</div>
                </div>

                <div className={styles.salaryComponent}>
                  <div className={styles.componentInfo}>
                    <span className={styles.componentName}>Performance Bonus</span>
                    <p className={styles.componentDesc}>Variable amount paid during payroll. The value defined by the company and calculated as a % of the basic salary</p>
                  </div>
                  <div className={styles.componentValue}>
                    <span className={styles.componentAmount}>2083.50</span>
                    <span className={styles.componentCurrency}>₹ / month</span>
                  </div>
                  <div className={styles.componentPercentage}>8.33 %</div>
                </div>

                <div className={styles.salaryComponent}>
                  <div className={styles.componentInfo}>
                    <span className={styles.componentName}>Leave Travel Allowance</span>
                    <p className={styles.componentDesc}>LTA is paid by the company to employees to cover their travel expenses, and calculated as a % of the basic salary</p>
                  </div>
                  <div className={styles.componentValue}>
                    <span className={styles.componentAmount}>2083.50</span>
                    <span className={styles.componentCurrency}>₹ / month</span>
                  </div>
                  <div className={styles.componentPercentage}>8.33 %</div>
                </div>

                <div className={styles.salaryComponent}>
                  <div className={styles.componentInfo}>
                    <span className={styles.componentName}>Fixed Allowance</span>
                    <p className={styles.componentDesc}>Fixed allowance portion of wages is determined after calculating all salary components</p>
                  </div>
                  <div className={styles.componentValue}>
                    <span className={styles.componentAmount}>2919.00</span>
                    <span className={styles.componentCurrency}>₹ / month</span>
                  </div>
                  <div className={styles.componentPercentage}>11.67 %</div>
                </div>
              </div>
            </div>

            {/* Right Column - PF and Tax */}
            <div className={styles.rightSalaryColumn}>
              {/* Provident Fund */}
              <div className={styles.section}>
                <h3>Provident Fund (PF) Contribution</h3>

                <div className={styles.pfSection}>
                  <div className={styles.pfItem}>
                    <span className={styles.pfLabel}>Employee</span>
                    <p className={styles.pfDesc}>PF is calculated based on the basic salary</p>
                    <div className={styles.pfValue}>
                      <span className={styles.pfAmount}>3000.00</span>
                      <span className={styles.pfCurrency}>₹ / month</span>
                      <span className={styles.pfPercentage}>12.00 %</span>
                    </div>
                  </div>

                  <div className={styles.pfItem}>
                    <span className={styles.pfLabel}>Employer</span>
                    <p className={styles.pfDesc}>PF is calculated based on the basic salary</p>
                    <div className={styles.pfValue}>
                      <span className={styles.pfAmount}>3000.00</span>
                      <span className={styles.pfCurrency}>₹ / month</span>
                      <span className={styles.pfPercentage}>12.00 %</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tax Deductions */}
              <div className={styles.section}>
                <h3>Tax Deductions</h3>

                <div className={styles.taxItem}>
                  <span className={styles.taxLabel}>Professional Tax</span>
                  <p className={styles.taxDesc}>Professional Tax deducted from the Gross salary</p>
                  <div className={styles.taxValue}>
                    <span className={styles.taxAmount}>200.00</span>
                    <span className={styles.taxCurrency}>₹ / month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className={styles.securityContent}>
            <div className={styles.securityGrid}>
              <div className={styles.section}>
                <h3>Change Password</h3>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Current Password</label>
                    <Input
                      type="password"
                      placeholder="Enter current password"
                      className={styles.editInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>New Password</label>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      className={styles.editInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Confirm New Password</label>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      className={styles.editInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <Button variant="primary" className={styles.changePasswordBtn}>
                      Change Password
                    </Button>
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <h3>Two-Factor Authentication</h3>
                <div className={styles.securityOption}>
                  <div className={styles.securityOptionInfo}>
                    <h4>SMS Authentication</h4>
                    <p>Receive verification codes via SMS</p>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>

                <div className={styles.securityOption}>
                  <div className={styles.securityOptionInfo}>
                    <h4>App Authentication</h4>
                    <p>Use authenticator app for verification</p>
                  </div>
                  <Button variant="outline" size="sm">Setup</Button>
                </div>
              </div>

              <div className={styles.section}>
                <h3>Login History</h3>
                <div className={styles.loginHistory}>
                  <div className={styles.loginItem}>
                    <div className={styles.loginDetails}>
                      <span className={styles.loginDevice}>Chrome on Windows</span>
                      <span className={styles.loginTime}>2 hours ago</span>
                    </div>
                    <span className={styles.loginStatus}>Current Session</span>
                  </div>

                  <div className={styles.loginItem}>
                    <div className={styles.loginDetails}>
                      <span className={styles.loginDevice}>Safari on iPhone</span>
                      <span className={styles.loginTime}>1 day ago</span>
                    </div>
                    <Button variant="text" size="sm" className={styles.logoutBtn}>
                      Logout
                    </Button>
                  </div>

                  <div className={styles.loginItem}>
                    <div className={styles.loginDetails}>
                      <span className={styles.loginDevice}>Chrome on Mac</span>
                      <span className={styles.loginTime}>3 days ago</span>
                    </div>
                    <span className={styles.loginExpired}>Expired</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};