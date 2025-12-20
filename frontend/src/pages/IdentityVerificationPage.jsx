import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Fingerprint as FingerprintIcon,
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import api from '../services/api';
import toast from 'react-hot-toast';

const IdentityVerificationPage = () => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newVerification, setNewVerification] = useState({
    verificationType: 'company_registration',
    documentNumber: '',
    issuingAuthority: '',
    country: ''
  });

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      const response = await api.get('/identity');
      setVerifications(response.data.data.verifications);
    } catch (error) {
      toast.error('Failed to load verifications');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newVerification.documentNumber) {
      toast.error('Document Number is required');
      return;
    }

    try {
      // Create a mock document object for the API payload
      const payload = {
        verificationType: newVerification.verificationType,
        documents: [{
          name: `${newVerification.verificationType}_doc.pdf`,
          type: 'application/pdf',
          url: 'https://example.com/doc.pdf' // Simulated upload
        }],
        metadata: {
          documentNumber: newVerification.documentNumber,
          issuingAuthority: newVerification.issuingAuthority,
          country: newVerification.country
        }
      };

      await api.post('/identity', payload);
      toast.success('Verification request submitted');
      setOpen(false);
      fetchVerifications();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Submission failed');
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'verified': return <CheckCircleIcon sx={{ color: '#10b981' }} />;
      case 'pending': return <HourglassEmptyIcon sx={{ color: '#f59e0b' }} />;
      case 'rejected': return <CancelIcon sx={{ color: '#ef4444' }} />;
      default: return <HourglassEmptyIcon />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Identity Verification (KYC)
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage company and director identity verification documents
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<CloudUploadIcon />}
          onClick={() => setOpen(true)}
          sx={{ background: 'linear-gradient(45deg, #667eea, #764ba2)' }}
        >
          Submit New Document
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <FingerprintIcon sx={{ fontSize: 40, color: '#667eea', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{verifications.length}</Typography>
              <Typography variant="body2" color="text.secondary">Total Submissions</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
             <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 40, color: '#10b981', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {verifications.filter(v => v.status === 'verified').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">Verified Documents</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
             <CardContent sx={{ textAlign: 'center' }}>
              <HourglassEmptyIcon sx={{ fontSize: 40, color: '#f59e0b', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {verifications.filter(v => v.status === 'pending').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">Pending Review</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Table */}
      <Paper sx={{ p: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Date Submitted</TableCell>
                <TableCell>Document ID</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Risk Level</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {verifications.map((item) => (
                <TableRow key={item._id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                      {item.verificationType.replace('_', ' ')}
                    </Typography>
                  </TableCell>
                  <TableCell>{new Date(item.submittedAt).toLocaleDateString()}</TableCell>
                  <TableCell>{item.metadata?.documentNumber || 'N/A'}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      icon={getStatusIcon(item.status)}
                      label={item.status.toUpperCase()}
                      size="small"
                      color={item.status === 'verified' ? 'success' : item.status === 'rejected' ? 'error' : 'warning'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={item.riskLevel.toUpperCase()} size="small" />
                  </TableCell>
                </TableRow>
              ))}
              {verifications.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={5} align="center">No verifications submitted yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Upload Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Submit Verification Document</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Document Type</InputLabel>
              <Select
                value={newVerification.verificationType}
                label="Document Type"
                onChange={(e) => setNewVerification({...newVerification, verificationType: e.target.value})}
              >
                <MenuItem value="company_registration">Company Registration</MenuItem>
                <MenuItem value="tax_id">Tax ID Certificate</MenuItem>
                <MenuItem value="director_id">Director ID / Passport</MenuItem>
                <MenuItem value="bank_account">Bank Account Statement</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Document Number / ID"
              value={newVerification.documentNumber}
              onChange={(e) => setNewVerification({...newVerification, documentNumber: e.target.value})}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Issuing Authority"
              value={newVerification.issuingAuthority}
              onChange={(e) => setNewVerification({...newVerification, issuingAuthority: e.target.value})}
              sx={{ mb: 3 }}
            />

             <TextField
              fullWidth
              label="Country"
              value={newVerification.country}
              onChange={(e) => setNewVerification({...newVerification, country: e.target.value})}
              sx={{ mb: 3 }}
            />
            
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<CloudUploadIcon />}
            >
              Upload Document File (PDF/JPG)
              <input type="file" hidden />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Submit for Verification</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default IdentityVerificationPage;