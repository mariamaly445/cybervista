import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Checklist as ChecklistIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Add as AddIcon
} from '@mui/icons-material';
import api from '../services/api';
import toast from 'react-hot-toast';

const CompliancePage = () => {
  const [compliance, setCompliance] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompliance();
  }, []);

  const fetchCompliance = async () => {
    try {
      const response = await api.get('/compliance');
      setCompliance(response.data.data.compliance);
      setMetrics(response.data.data.metrics);
    } catch (error) {
      toast.error('Failed to load compliance data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'compliant': return '#10b981';
      case 'in_progress': return '#f59e0b';
      case 'non_compliant': return '#ef4444';
      case 'not_started': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'compliant': return <CheckCircleIcon sx={{ color: '#10b981' }} />;
      case 'in_progress': return <WarningIcon sx={{ color: '#f59e0b' }} />;
      case 'non_compliant': return <ErrorIcon sx={{ color: '#ef4444' }} />;
      default: return <ChecklistIcon />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Loading compliance data...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Compliance Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and manage regulatory compliance standards
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            '&:hover': {
              background: 'linear-gradient(45deg, #5a67d8, #6b46c1)',
            },
          }}
        >
          Add Standard
        </Button>
      </Box>

      {/* Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ChecklistIcon sx={{ color: '#667eea', mr: 1 }} />
                <Typography variant="h6">Compliance Rate</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {metrics?.compliancePercentage || 0}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {metrics?.compliantStandards || 0} of {metrics?.totalStandards || 0} standards
              </Typography>
              <LinearProgress
                variant="determinate"
                value={metrics?.compliancePercentage || 0}
                sx={{ mt: 2, height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ color: '#10b981', mr: 1 }} />
                <Typography variant="h6">Compliant</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {metrics?.compliantStandards || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fully compliant standards
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WarningIcon sx={{ color: '#f59e0b', mr: 1 }} />
                <Typography variant="h6">In Progress</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {compliance.filter(c => c.status === 'in_progress').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Standards being implemented
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ErrorIcon sx={{ color: '#ef4444', mr: 1 }} />
                <Typography variant="h6">Non-Compliant</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {compliance.filter(c => c.status === 'non_compliant').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Requires attention
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Compliance Standards */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Compliance Standards</Typography>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select label="Filter by Status" defaultValue="all">
              <MenuItem value="all">All Standards</MenuItem>
              <MenuItem value="compliant">Compliant</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="non_compliant">Non-Compliant</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Standard</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Score</TableCell>
                <TableCell align="center">Requirements</TableCell>
                <TableCell align="center">Last Audit</TableCell>
                <TableCell align="center">Next Audit</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {compliance.map((standard) => (
                <TableRow key={standard._id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {standard.standardName}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      icon={getStatusIcon(standard.status)}
                      label={standard.status.replace('_', ' ').toUpperCase()}
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(standard.status) + '20',
                        color: getStatusColor(standard.status),
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', mr: 1 }}>
                        {standard.overallScore}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={standard.overallScore}
                        sx={{
                          width: 60,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#e5e7eb',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getStatusColor(standard.status),
                          },
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">
                      {standard.requirements?.filter(r => r.status === 'fully_implemented').length || 0} / {standard.requirements?.length || 0}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">
                      {standard.lastAuditDate ? new Date(standard.lastAuditDate).toLocaleDateString() : 'Never'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">
                      {standard.nextAuditDate ? new Date(standard.nextAuditDate).toLocaleDateString() : 'Not set'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Button size="small" variant="outlined">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default CompliancePage;