import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Paper
} from '@mui/material';
import {
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  Search as SearchIcon,
  Checklist as ChecklistIcon,
  AccountBalance as AccountBalanceIcon,
  Fingerprint as FingerprintIcon
} from '@mui/icons-material';

const HomePage = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
              CyberVista
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
              Comprehensive Cybersecurity Platform for FinTech Companies
            </Typography>
            <Typography variant="body1" sx={{ mb: 5, maxWidth: 800, mx: 'auto' }}>
              Automated security scoring, compliance management, vulnerability assessment, 
              and fraud detection in one unified platform.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                component={Link}
                to="/register"
                sx={{
                  backgroundColor: 'white',
                  color: '#667eea',
                  '&:hover': {
                    backgroundColor: '#f8f9fa'
                  }
                }}
                size="large"
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                component={Link}
                to="/login"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
                size="large"
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 6, fontWeight: 'bold' }}>
          Key Features
        </Typography>
        <Grid container spacing={4}>
          {[
            {
              icon: <AnalyticsIcon sx={{ fontSize: 40, color: '#667eea' }} />,
              title: 'Security Scoring',
              description: 'Get real-time security scores based on comprehensive assessments'
            },
            {
              icon: <SearchIcon sx={{ fontSize: 40, color: '#667eea' }} />,
              title: 'Vulnerability Scans',
              description: 'Automated scanning for security vulnerabilities'
            },
            {
              icon: <ChecklistIcon sx={{ fontSize: 40, color: '#667eea' }} />,
              title: 'Compliance Management',
              description: 'Track and manage regulatory compliance requirements'
            },
            {
              icon: <AccountBalanceIcon sx={{ fontSize: 40, color: '#667eea' }} />,
              title: 'Fraud Detection',
              description: 'Advanced algorithms to detect fraudulent activities'
            },
            {
              icon: <FingerprintIcon sx={{ fontSize: 40, color: '#667eea' }} />,
              title: 'Identity Verification',
              description: 'Secure identity verification and authentication'
            },
            {
              icon: <SecurityIcon sx={{ fontSize: 40, color: '#667eea' }} />,
              title: 'Security Alerts',
              description: 'Real-time alerts for security incidents'
            }
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

     
      
    </Box>
  );
};

export default HomePage;