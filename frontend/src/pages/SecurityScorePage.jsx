import React, { useState, useEffect } from 'react';
import { scoreAPI, handleApiError } from '../services/api';

const SecurityScorePage = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState('');

  const fetchScores = async () => {
    try {
      setLoading(true);
      const response = await scoreAPI.getScores();
      console.log('Scores API response:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setScores(response.data);
      } else if (response.data.scores) {
        setScores(response.data.scores);
      } else if (response.data.data) {
        setScores(response.data.data);
      } else {
        // Demo data if API returns unexpected format
        setScores([
          { _id: '1', overallScore: 85, riskLevel: 'Medium', calculatedAt: new Date().toISOString() },
          { _id: '2', overallScore: 82, riskLevel: 'Medium', calculatedAt: '2025-01-15T10:30:00Z' }
        ]);
      }
    } catch (err) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      console.error('Error fetching scores:', err);
      
      // Fallback demo data
      setScores([
        { _id: 'demo1', overallScore: 85, riskLevel: 'Medium', calculatedAt: new Date().toISOString() },
        { _id: 'demo2', overallScore: 82, riskLevel: 'Medium', calculatedAt: '2025-01-15T10:30:00Z' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const calculateNewScore = async () => {
    try {
      setCalculating(true);
      setError('');
      const response = await scoreAPI.calculateScore();
      console.log('Calculate score response:', response.data);
      
      if (response.data) {
        const newScore = response.data.score || response.data.data || response.data;
        alert(`✅ New security score calculated: ${newScore.overallScore}/100 (${newScore.riskLevel} Risk)`);
        fetchScores(); // Refresh the list
      }
    } catch (err) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      console.error('Error calculating score:', err);
      
      // Demo calculation
      const demoScore = {
        _id: 'demo' + Date.now(),
        overallScore: Math.floor(Math.random() * 30) + 70,
        riskLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        calculatedAt: new Date().toISOString()
      };
      setScores([demoScore, ...scores]);
      alert(`Demo calculation: ${demoScore.overallScore}/100 (${demoScore.riskLevel} Risk)`);
    } finally {
      setCalculating(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Security Score Dashboard</h1>
      <p style={{ color: '#6c757d', marginBottom: '30px' }}>Use Case 2: Live API integration with backend</p>
      
      {error && (
        <div style={{ background: '#fff3cd', color: '#856404', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ 
        background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
        color: 'white',
        borderRadius: '15px',
        padding: '40px',
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Current Security Score</h2>
        {scores.length > 0 ? (
          <>
            <div style={{ fontSize: '72px', fontWeight: 'bold', margin: '20px 0' }}>
              {scores[0].overallScore}<span style={{ fontSize: '36px', opacity: 0.8 }}>/100</span>
            </div>
            <div style={{
              display: 'inline-block',
              padding: '10px 25px',
              background: scores[0].riskLevel === 'High' ? '#dc3545' : 
                        scores[0].riskLevel === 'Medium' ? '#ffc107' : '#28a745',
              borderRadius: '25px',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              {scores[0].riskLevel} RISK
            </div>
          </>
        ) : (
          <div style={{ fontSize: '24px', opacity: 0.8 }}>No scores yet</div>
        )}
        
        <button
          onClick={calculateNewScore}
          disabled={calculating || loading}
          style={{
            padding: '15px 40px',
            background: calculating ? '#6c757d' : 'white',
            color: calculating ? 'white' : '#1a2980',
            border: 'none',
            borderRadius: '10px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: calculating ? 'not-allowed' : 'pointer',
            marginTop: '30px'
          }}
        >
          {calculating ? 'Calculating...' : 'Calculate New Score'}
        </button>
      </div>

      <div style={{ 
        background: 'white',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.08)'
      }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '25px' }}>Score History</h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading scores...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e9ecef' }}>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Score</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score) => (
                  <tr key={score._id} style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td style={{ padding: '15px' }}>
                      {new Date(score.calculatedAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ 
                        fontSize: '24px', 
                        fontWeight: 'bold',
                        color: score.overallScore >= 90 ? '#28a745' : 
                              score.overallScore >= 80 ? '#ffc107' : '#dc3545'
                      }}>
                        {score.overallScore}
                      </div>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{
                        padding: '8px 20px',
                        background: score.riskLevel === 'High' ? '#f8d7da' : 
                                  score.riskLevel === 'Medium' ? '#fff3cd' : '#d4edda',
                        color: score.riskLevel === 'High' ? '#721c24' : 
                              score.riskLevel === 'Medium' ? '#856404' : '#155724',
                        borderRadius: '20px',
                        display: 'inline-block',
                        fontWeight: 'bold'
                      }}>
                        {score.riskLevel}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        background: '#f8f9fa', 
        borderRadius: '10px',
        fontSize: '14px',
        color: '#6c757d'
      }}>
        <strong>API Connection:</strong> GET http://localhost:5001/api/scores
        {error && <div style={{ marginTop: '10px', color: '#dc3545' }}>Using demo data due to API error</div>}
      </div>
    </div>
  );
};

export default SecurityScorePage;
