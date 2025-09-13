import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  Save,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Mail,
  Database,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PageHeader = styled.div`
  .header-left {
    h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 8px;
    }

    p {
      color: #6b7280;
    }
  }
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const SettingsNav = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
  height: fit-content;

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 4px;
    color: #6b7280;
    font-weight: 500;

    &.active {
      background: #f0f4ff;
      color: #667eea;
    }

    &:hover:not(.active) {
      background: #f9fafb;
      color: #374151;
    }
  }
`;

const SettingsContent = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const FormSection = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 16px;
  }

  .section-description {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 20px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
    font-size: 14px;
  }

  input, textarea, select {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.3s ease;
    font-size: 14px;

    &:focus {
      border-color: #667eea;
    }

    &::placeholder {
      color: #9ca3af;
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .password-input {
    position: relative;

    .password-toggle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      padding: 4px;

      &:hover {
        color: #6b7280;
      }
    }
  }
`;

const ToggleSwitch = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }

  .toggle-info {
    .toggle-label {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 4px;
    }

    .toggle-description {
      font-size: 14px;
      color: #6b7280;
    }
  }

  .toggle-switch {
    position: relative;
    width: 48px;
    height: 24px;
    background: ${props => props.checked ? '#667eea' : '#d1d5db'};
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.3s ease;

    .toggle-slider {
      position: absolute;
      top: 2px;
      left: ${props => props.checked ? '26px' : '2px'};
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      transition: left 0.3s ease;
    }
  }
`;

const SaveButton = styled(motion.button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailOrders: true,
    emailMarketing: false,
    pushNotifications: true,
    smsNotifications: false
  });

  const updateProfileMutation = useMutation(
    async (data) => {
      await axios.put('/api/auth/profile', data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user');
        toast.success('Profile updated successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update profile');
      }
    }
  );

  const updatePasswordMutation = useMutation(
    async (data) => {
      await axios.put('/api/auth/password', data);
    },
    {
      onSuccess: () => {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        toast.success('Password updated successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update password');
      }
    }
  );

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileData);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    updatePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
  };

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const navItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'system', label: 'System', icon: Database }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <form onSubmit={handleProfileSubmit}>
            <FormSection>
              <div className="section-title">Personal Information</div>
              <div className="section-description">
                Update your personal details and contact information.
              </div>
              
              <FormGroup>
                <div className="form-row">
                  <div>
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
              </FormGroup>

              <FormGroup>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter your phone number"
                />
              </FormGroup>
            </FormSection>

            <SaveButton
              type="submit"
              disabled={updateProfileMutation.isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save size={16} />
              {updateProfileMutation.isLoading ? 'Saving...' : 'Save Changes'}
            </SaveButton>
          </form>
        );

      case 'security':
        return (
          <form onSubmit={handlePasswordSubmit}>
            <FormSection>
              <div className="section-title">Change Password</div>
              <div className="section-description">
                Update your password to keep your account secure.
              </div>

              <FormGroup>
                <label htmlFor="currentPassword">Current Password</label>
                <div className="password-input">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    id="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </FormGroup>

              <FormGroup>
                <label htmlFor="newPassword">New Password</label>
                <div className="password-input">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    id="newPassword"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </FormGroup>

              <FormGroup>
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <div className="password-input">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </FormGroup>
            </FormSection>

            <SaveButton
              type="submit"
              disabled={updatePasswordMutation.isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save size={16} />
              {updatePasswordMutation.isLoading ? 'Updating...' : 'Update Password'}
            </SaveButton>
          </form>
        );

      case 'notifications':
        return (
          <FormSection>
            <div className="section-title">Notification Preferences</div>
            <div className="section-description">
              Choose how you want to be notified about important updates.
            </div>

            <ToggleSwitch checked={notifications.emailOrders} onClick={() => handleNotificationToggle('emailOrders')}>
              <div className="toggle-info">
                <div className="toggle-label">Order Notifications</div>
                <div className="toggle-description">Get notified about new orders and status updates</div>
              </div>
              <div className="toggle-switch">
                <div className="toggle-slider" />
              </div>
            </ToggleSwitch>

            <ToggleSwitch checked={notifications.emailMarketing} onClick={() => handleNotificationToggle('emailMarketing')}>
              <div className="toggle-info">
                <div className="toggle-label">Marketing Emails</div>
                <div className="toggle-description">Receive promotional emails and newsletters</div>
              </div>
              <div className="toggle-switch">
                <div className="toggle-slider" />
              </div>
            </ToggleSwitch>

            <ToggleSwitch checked={notifications.pushNotifications} onClick={() => handleNotificationToggle('pushNotifications')}>
              <div className="toggle-info">
                <div className="toggle-label">Push Notifications</div>
                <div className="toggle-description">Get browser notifications for important updates</div>
              </div>
              <div className="toggle-switch">
                <div className="toggle-slider" />
              </div>
            </ToggleSwitch>

            <ToggleSwitch checked={notifications.smsNotifications} onClick={() => handleNotificationToggle('smsNotifications')}>
              <div className="toggle-info">
                <div className="toggle-label">SMS Notifications</div>
                <div className="toggle-description">Receive text messages for critical alerts</div>
              </div>
              <div className="toggle-switch">
                <div className="toggle-slider" />
              </div>
            </ToggleSwitch>

            <SaveButton
              style={{ marginTop: '24px' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save size={16} />
              Save Preferences
            </SaveButton>
          </FormSection>
        );

      case 'appearance':
        return (
          <FormSection>
            <div className="section-title">Appearance Settings</div>
            <div className="section-description">
              Customize the look and feel of your admin dashboard.
            </div>

            <FormGroup>
              <label htmlFor="theme">Theme</label>
              <select id="theme">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto (System)</option>
              </select>
            </FormGroup>

            <FormGroup>
              <label htmlFor="language">Language</label>
              <select id="language">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </FormGroup>

            <SaveButton
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save size={16} />
              Save Changes
            </SaveButton>
          </FormSection>
        );

      case 'system':
        return (
          <FormSection>
            <div className="section-title">System Information</div>
            <div className="section-description">
              View system status and configuration details.
            </div>

            <div style={{ 
              background: '#f9fafb', 
              padding: '16px', 
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <div style={{ marginBottom: '12px' }}>
                <strong>Version:</strong> 1.0.0
              </div>
              <div style={{ marginBottom: '12px' }}>
                <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
              </div>
              <div style={{ marginBottom: '12px' }}>
                <strong>Database Status:</strong> <span style={{ color: '#10b981' }}>Connected</span>
              </div>
              <div>
                <strong>Storage Used:</strong> 2.3 GB / 10 GB
              </div>
            </div>

            <SaveButton
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Database size={16} />
              Run System Check
            </SaveButton>
          </FormSection>
        );

      default:
        return null;
    }
  };

  return (
    <SettingsContainer>
      <PageHeader>
        <div className="header-left">
          <h1>Settings</h1>
          <p>Manage your account and system preferences</p>
        </div>
      </PageHeader>

      <SettingsGrid>
        <SettingsNav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={18} />
                {item.label}
              </div>
            );
          })}
        </SettingsNav>

        <SettingsContent>
          <h3>
            {navItems.find(item => item.id === activeTab)?.icon && 
              React.createElement(navItems.find(item => item.id === activeTab).icon, { size: 20 })
            }
            {navItems.find(item => item.id === activeTab)?.label}
          </h3>
          {renderContent()}
        </SettingsContent>
      </SettingsGrid>
    </SettingsContainer>
  );
};

export default Settings;
