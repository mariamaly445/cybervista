import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  Alert
} from '@mui/material';
import {
  Lock as LockIcon,
  DeleteForever as DeleteIcon,
  NotificationsActive as NotificationIcon
} from '@mui/icons-material';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const [passData, setPassData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const handlePassChange = (e) => {
    setPassData({ ...passData, [e.target.name]: e.target.value });
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      await api.put('/auth/change-password', {
        currentPassword: passData.currentPassword,
        newPassword: passData.newPassword
      });
      toast.success('Password updated successfully');
      setPassData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    }
  };

  const handleDeactivate = async () => {
    if (window.confirm('Are you sure you want to deactivate your account? This action cannot be undone.')) {
      try {
        await api.delete('/auth/deactivate');
        toast.success('Account deactivated');
        logout();
        navigate('/login');
      } catch (error) {
        toast.error('Failed to deactivate account');
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Security Settings */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LockIcon sx={{ mr: 1, color: '#667eea' }} />
              <Typography variant="h6">Security</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <form onSubmit={handleUpdatePassword}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    type="password"
                    name="currentPassword"
                    value={passData.currentPassword}
                    onChange={handlePassChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    name="newPassword"
                    value={passData.newPassword}
                    onChange={handlePassChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type="password"
                    name="confirmNewPassword"
                    value={passData.confirmNewPassword}
                    onChange={handlePassChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">
                    Update Password
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Notifications (Placeholder) */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
             <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <NotificationIcon sx={{ mr: 1, color: '#f59e0b' }} />
              <Typography variant="h6">Notifications</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="body2" color="text.secondary">
              Email alerts for Critical Vulnerabilities and Login attempts are currently <strong>Enabled</strong> by default.
            </Typography>
          </Paper>
        </Grid>

        {/* Danger Zone */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, border: '1px solid #ef4444' }}>
             <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <DeleteIcon sx={{ mr: 1, color: '#ef4444' }} />
              <Typography variant="h6" color="error">Danger Zone</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">Deactivate Account</Typography>
                <Typography variant="body2" color="text.secondary">
                  This will shut down your profile and remove access to all data.
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                color="error"
                onClick={handleDeactivate}
              >
                Deactivate
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SettingsPage;