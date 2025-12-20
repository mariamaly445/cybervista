import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Block as BlockIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

// Mock Data for Visuals (Simulating an external Fraud API)
const mockTransactions = [
  { id: 'TRX-9821', amount: '$12,500.00', user: 'John Doe', status: 'flagged', risk: 85, date: '2023-10-25' },
  { id: 'TRX-9822', amount: '$450.00', user: 'Alice Smith', status: 'cleared', risk: 12, date: '2023-10-24' },
  { id: 'TRX-9823', amount: '$2,100.00', user: 'Bob Wilson', status: 'blocked', risk: 92, date: '2023-10-24' },
  { id: 'TRX-9824', amount: '$55.00', user: 'Jane Cooper', status: 'cleared', risk: 5, date: '2023-10-23' },
  { id: 'TRX-9825', amount: '$8,900.00', user: 'Mike Brown', status: 'flagged', risk: 78, date: '2023-10-23' },
];

const FraudDetectionPage = () => {
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
       {/* Header */}
       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Fraud Detection
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor transactions and detect suspicious activities
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
        >
          {loading ? 'Analyzing...' : 'Refresh Data'}
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalanceIcon sx={{ color: '#667eea', mr: 1 }} />
                <Typography variant="h6">Total Volume</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>$1.2M</Typography>
              <Typography variant="body2" color="text.secondary">Last 30 days</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
           <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WarningIcon sx={{ color: '#f59e0b', mr: 1 }} />
                <Typography variant="h6">Suspicious</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>23</Typography>
              <Typography variant="body2" color="text.secondary">Flagged transactions</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
           <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BlockIcon sx={{ color: '#ef4444', mr: 1 }} />
                <Typography variant="h6">Fraud Blocked</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>$45k</Typography>
              <Typography variant="body2" color="text.secondary">Saved this month</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Transaction Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>Recent Transactions Analysis</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Transaction ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="center">Risk Score</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockTransactions.map((trx) => (
                <TableRow key={trx.id} hover>
                  <TableCell sx={{ fontWeight: 'bold' }}>{trx.id}</TableCell>
                  <TableCell>{trx.user}</TableCell>
                  <TableCell>{trx.amount}</TableCell>
                  <TableCell>{trx.date}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography 
                        sx={{ 
                          fontWeight: 'bold', 
                          color: trx.risk > 80 ? '#ef4444' : trx.risk > 50 ? '#f59e0b' : '#10b981',
                          mr: 1 
                        }}
                      >
                        {trx.risk}/100
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={trx.status.toUpperCase()} 
                      size="small"
                      color={
                        trx.status === 'blocked' ? 'error' : 
                        trx.status === 'flagged' ? 'warning' : 'success'
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button size="small">Details</Button>
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

export default FraudDetectionPage;