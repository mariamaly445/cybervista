import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button
} from '@mui/material';
import {
  Security as SecurityIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Timeline as TimelineIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/overview');
      setDashboardData(response.data.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await fetchDashboardData();
    toast.success('Dashboard refreshed');
  };

  const getRiskColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#ef4444';
    return '#dc2626';
  };

  const getRiskLevel = (score) => {
    if (score >= 80) return 'Low';
    if (score >= 60) return 'Medium';
    if (score >= 40) return 'High';
    return 'Critical';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Loading dashboard...</Typography>
      </Box>
    );
  }

  if (!dashboardData) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Unable to load dashboard data
        </Typography>
        <Button onClick={refreshData} variant="outlined" sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  const { metrics, alerts, recentActivity, userInfo } = dashboardData;
  const securityScore = metrics.securityScore || 50;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Dashboard Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {userInfo?.companyName || user?.companyName}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={refreshData}
        >
          Refresh
        </Button>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SecurityIcon sx={{ color: '#667eea', mr: 1 }} />
                <Typography variant="h6">Security Score</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {securityScore}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                  /100
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Chip
                  label={getRiskLevel(securityScore)}
                  size="small"
                  sx={{
                    backgroundColor: getRiskColor(securityScore) + '20',
                    color: getRiskColor(securityScore),
                  }}
                />
              </Box>
              <LinearProgress
                variant="determinate"
                value={securityScore}
                sx={{
                  mt: 2,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#e5e7eb',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getRiskColor(securityScore),
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ color: '#10b981', mr: 1 }} />
                <Typography variant="h6">Scans Completed</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {metrics.completedScans || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                of {metrics.totalScans || 0} total scans
              </Typography>
              <LinearProgress
                variant="determinate"
                value={metrics.totalScans ? (metrics.completedScans / metrics.totalScans) * 100 : 0}
                sx={{
                  mt: 2,
                  height: 8,
                  borderRadius: 4,
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WarningIcon sx={{ color: '#ef4444', mr: 1 }} />
                <Typography variant="h6">Vulnerabilities</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {metrics.vulnerabilities || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {metrics.criticalVulnerabilities || 0} critical
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip
                  label="Action Required"
                  size="small"
                  color="error"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TimelineIcon sx={{ color: '#8b5cf6', mr: 1 }} />
                <Typography variant="h6">Active Alerts</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {alerts.unreadCount || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {alerts.criticalCount || 0} critical
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip
                  label="View Alerts"
                  size="small"
                  color="warning"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Recent Security Alerts</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Alert</TableCell>
                    <TableCell align="center">Level</TableCell>
                    <TableCell align="center">Time</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alerts.recent?.slice(0, 5).map((alert, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: alert.isRead ? 'normal' : 'bold' }}>
                          {alert.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {alert.message.substring(0, 50)}...
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={alert.alertLevel}
                          size="small"
                          sx={{
                            backgroundColor: 
                              alert.alertLevel === 'critical' ? '#dc262620' :
                              alert.alertLevel === 'high' ? '#ef444420' :
                              alert.alertLevel === 'medium' ? '#f59e0b20' : '#10b98120',
                            color: 
                              alert.alertLevel === 'critical' ? '#dc2626' :
                              alert.alertLevel === 'high' ? '#ef4444' :
                              alert.alertLevel === 'medium' ? '#f59e0b' : '#10b981',
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {new Date(alert.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="center">
                        {alert.isRead ? (
                          <Chip label="Read" size="small" color="default" />
                        ) : (
                          <Chip label="Unread" size="small" color="error" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Recent Scans</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Scan Name</TableCell>
                    <TableCell align="center">Target</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Findings</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentActivity.scans?.slice(0, 5).map((scan, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Typography variant="body2">
                          {scan.scanName}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">
                          {scan.targetUrl?.replace('https://', '').replace('http://', '').split('/')[0]}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={scan.status}
                          size="small"
                          color={
                            scan.status === 'completed' ? 'success' :
                            scan.status === 'failed' ? 'error' :
                            scan.status === 'in_progress' ? 'warning' : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {scan.results?.total || 0}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;