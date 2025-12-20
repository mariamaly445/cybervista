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
  TableRow
} from '@mui/material';
import {
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import api from '../services/api';
import toast from 'react-hot-toast';

const SecurityScorePage = () => {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScore();
  }, []);

  const fetchScore = async () => {
    try {
      const response = await api.post('/scores');
      setScore(response.data.data.score);
    } catch (error) {
      toast.error('Failed to calculate security score');
    } finally {
      setLoading(false);
    }
  };

  const calculateScore = async () => {
    setLoading(true);
    try {
      const response = await api.post('/scores');
      setScore(response.data.data.score);
      toast.success('Security score calculated successfully');
    } catch (error) {
      toast.error('Failed to calculate security score');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      case 'critical': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return <TrendingUpIcon sx={{ color: '#10b981' }} />;
      case 'declining': return <TrendingDownIcon sx={{ color: '#ef4444' }} />;
      default: return <TrendingFlatIcon sx={{ color: '#6b7280' }} />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Loading security score...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Security Score Analysis
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive assessment of your security posture
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={calculateScore}
          disabled={loading}
        >
          Calculate Score
        </Button>
      </Box>

      {score && (
        <>
          {/* Overall Score */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <SecurityIcon sx={{ color: '#667eea', mr: 2, fontSize: 40 }} />
                        <Box>
                          <Typography variant="h5">Overall Security Score</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Last calculated: {new Date(score.calculatedAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                        <Typography variant="h2" sx={{ fontWeight: 'bold', mr: 1 }}>
                          {score.overallScore}
                        </Typography>
                        <Typography variant="h4" color="text.secondary">
                          /100
                        </Typography>
                        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                          {getTrendIcon(score.trend)}
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {score.trend.toUpperCase()}
                          </Typography>
                        </Box>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={score.overallScore}
                        sx={{
                          height: 12,
                          borderRadius: 6,
                          mb: 2,
                          backgroundColor: '#e5e7eb',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getRiskColor(score.riskLevel),
                          },
                        }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Chip
                          label={`Risk Level: ${score.riskLevel.toUpperCase()}`}
                          sx={{
                            backgroundColor: getRiskColor(score.riskLevel) + '20',
                            color: getRiskColor(score.riskLevel),
                            fontWeight: 'bold'
                          }}
                        />
                        <Chip
                          label={`Trend: ${score.trend}`}
                          icon={getTrendIcon(score.trend)}
                          variant="outlined"
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ pl: { md: 4 }, borderLeft: { md: '1px solid #e5e7eb' } }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Category Scores</Typography>
                        {Object.entries(score.categoryScores || {}).map(([category, catScore]) => (
                          <Box key={category} sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2">
                                {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {catScore}/100
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={catScore}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: '#e5e7eb',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: catScore >= 80 ? '#10b981' : 
                                                catScore >= 60 ? '#f59e0b' : '#ef4444',
                                },
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Recommendations */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>Security Recommendations</Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Priority</TableCell>
                        <TableCell>Recommendation</TableCell>
                        <TableCell>Impact</TableCell>
                        <TableCell>Estimated Effort</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[
                        {
                          priority: 'High',
                          recommendation: 'Implement multi-factor authentication for all user accounts',
                          impact: 'High',
                          effort: 'Medium'
                        },
                        {
                          priority: 'High',
                          recommendation: 'Enable data encryption for sensitive information',
                          impact: 'High',
                          effort: 'Low'
                        },
                        {
                          priority: 'Medium',
                          recommendation: 'Conduct regular security awareness training for employees',
                          impact: 'Medium',
                          effort: 'Medium'
                        },
                        {
                          priority: 'Medium',
                          recommendation: 'Implement regular vulnerability scanning schedule',
                          impact: 'Medium',
                          effort: 'Low'
                        },
                        {
                          priority: 'Low',
                          recommendation: 'Establish incident response plan and team',
                          impact: 'High',
                          effort: 'High'
                        }
                      ].map((rec, index) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            <Chip
                              label={rec.priority}
                              size="small"
                              color={
                                rec.priority === 'High' ? 'error' :
                                rec.priority === 'Medium' ? 'warning' : 'success'
                              }
                            />
                          </TableCell>
                          <TableCell>{rec.recommendation}</TableCell>
                          <TableCell>
                            <Chip
                              label={rec.impact}
                              size="small"
                              variant="outlined"
                              color={
                                rec.impact === 'High' ? 'error' :
                                rec.impact === 'Medium' ? 'warning' : 'success'
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={rec.effort}
                              size="small"
                              variant="outlined"
                              color={
                                rec.effort === 'High' ? 'error' :
                                rec.effort === 'Medium' ? 'warning' : 'success'
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default SecurityScorePage;