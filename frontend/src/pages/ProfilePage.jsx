import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Avatar,
  Divider,
  Chip
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    companySize: '',
    industry: '',
    country: '',
    website: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        companyName: user.companyName || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update basic user info
      await api.put('/auth/profile', {
        companyName: formData.companyName,
        email: formData.email
      });

      // Update Company Profile Details
      const profileData = {
        companySize: formData.companySize,
        industry: formData.industry,
        country: formData.country,
        website: formData.website
      };

      await api.post('/profile', profileData);
      
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Company Profile
      </Typography>

      <Grid container spacing={3}>
        {/* User Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center', height: '100%' }}>
            <CardContent>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: '#667eea',
                  fontSize: 40,
                  margin: '0 auto 16px auto'
                }}
              >
                {user?.companyName?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {user?.companyName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {user?.email}
              </Typography>
              <Chip 
                label={`${user?.subscriptionPlan?.toUpperCase()} PLAN`} 
                color="primary" 
                size="small" 
                variant="outlined" 
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Edit Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <BusinessIcon sx={{ mr: 1, color: '#667eea' }} /> Edit Details
            </Typography>
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <BusinessIcon color="action" sx={{ mr: 1 }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Industry"
                    name="industry"
                    select
                    SelectProps={{ native: true }}
                    value={formData.industry}
                    onChange={handleChange}
                  >
                    <option value="">Select Industry</option>
                    <option value="FinTech">FinTech</option>
                    <option value="Banking">Banking</option>
                    <option value="Insurance">Insurance</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Other">Other</option>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                   <TextField
                    fullWidth
                    label="Company Size"
                    name="companySize"
                    select
                    SelectProps={{ native: true }}
                    value={formData.companySize}
                    onChange={handleChange}
                  >
                    <option value="">Select Size</option>
                    <option value="1-10">1-10 Employees</option>
                    <option value="11-50">11-50 Employees</option>
                    <option value="51-200">51-200 Employees</option>
                    <option value="201-1000">201-1000 Employees</option>
                    <option value="1000+">1000+ Employees</option>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Website URL"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    startIcon={<SaveIcon />}
                    sx={{ 
                      mt: 2,
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    }}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;