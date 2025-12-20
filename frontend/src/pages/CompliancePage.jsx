import React, { useState, useEffect } from 'react';
import { complianceAPI, handleApiError } from '../services/api';

const CompliancePage = () => {
  const [checklist, setChecklist] = useState([]);
  const [standard, setStandard] = useState('PCI-DSS');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const fetchChecklist = async (std) => {
    try {
      setLoading(true);
      setError('');
      const response = await complianceAPI.getChecklist(std);
      console.log('Compliance API response:', response.data);
      
      if (response.data.checklist && Array.isArray(response.data.checklist)) {
        setChecklist(response.data.checklist);
        setProgress(response.data.progress || calculateProgress(response.data.checklist));
      } else if (response.data.data) {
        setChecklist(response.data.data);
        setProgress(response.data.progress || 0);
      } else {
        // Demo data
        const demoChecklist = [
          { id: 1, requirement: 'Firewall Configuration', description: 'Install and maintain firewall', status: 'completed' },
          { id: 2, requirement: 'Data Encryption', description: 'Encrypt cardholder data', status: 'in-progress' },
          { id: 3, requirement: 'Access Control', description: 'Restrict access by need-to-know', status: 'not-started' },
          { id: 4, requirement: 'Regular Testing', description: 'Test security systems', status: 'not-started' },
          { id: 5, requirement: 'Security Policies', description: 'Maintain information security policy', status: 'completed' }
        ];
        setChecklist(demoChecklist);
        setProgress(calculateProgress(demoChecklist));
      }
    } catch (err) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      console.error('Error fetching compliance:', err);
      
      // Fallback demo data
      const demoChecklist = [
        { id: 1, requirement: 'Demo Firewall Config', description: 'Install firewall', status: 'completed' },
        { id: 2, requirement: 'Demo Data Encryption', description: 'Encrypt data', status: 'in-progress' }
      ];
      setChecklist(demoChecklist);
      setProgress(calculateProgress(demoChecklist));
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (items) => {
    if (!items.length) return 0;
    const completed = items.filter(item => item.status === 'completed').length;
    return Math.round((completed / items.length) * 100);
  };

  const updateItemStatus = async (itemId, newStatus) => {
    try {
      setSaving(true);
      
      // Update locally first for instant feedback
      const updatedChecklist = checklist.map(item =>
        item.id === itemId ? { ...item, status: newStatus } : item
      );
      setChecklist(updatedChecklist);
      setProgress(calculateProgress(updatedChecklist));
      
      // Send to API
      const updateData = { status: newStatus };
      console.log('Updating item:', itemId, updateData);
      
      try {
        await complianceAPI.updateItem(standard, itemId, updateData);
        console.log('Item updated successfully');
      } catch (apiErr) {
        console.warn('API update failed, using local update:', apiErr);
        // Keep local changes even if API fails
      }
      
    } catch (err) {
      console.error('Error updating item:', err);
      alert('Failed to update item. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleStandardChange = (newStandard) => {
    setStandard(newStandard);
    fetchChecklist(newStandard);
  };

  useEffect(() => {
    fetchChecklist(standard);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#28a745';
      case 'in-progress': return '#ffc107';
      case 'not-started': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'not-started': return 'Not Started';
      default: return status;
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Compliance Manager</h1>
      <p style={{ color: '#6c757d', marginBottom: '30px' }}>Use Case 4: Track regulatory compliance standards</p>
      
      {error && (
        <div style={{ background: '#fff3cd', color: '#856404', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Standard Selection */}
      <div style={{ 
        background: 'white',
        borderRadius: '15px',
        padding: '25px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
        marginBottom: '30px'
      }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Select Compliance Standard</h2>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          {['PCI-DSS', 'ISO-27001', 'GDPR', 'HIPAA'].map((std) => (
            <button
              key={std}
              onClick={() => handleStandardChange(std)}
              style={{
                padding: '15px 25px',
                background: standard === std ? '#007bff' : '#f8f9fa',
                color: standard === std ? 'white' : '#495057',
                border: `2px solid ${standard === std ? '#007bff' : '#e9ecef'}`,
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                minWidth: '120px'
              }}
            >
              {std}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
        borderRadius: '15px',
        padding: '30px',
        marginBottom: '40px',
        color: 'white'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ margin: '0 0 10px', fontSize: '24px' }}>{standard} Compliance</h2>
            <p style={{ opacity: 0.9, margin: 0 }}>Overall completion progress</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold' }}>{progress}%</div>
            <div style={{ opacity: 0.8 }}>Complete</div>
          </div>
        </div>
        
        <div style={{ 
          height: '15px', 
          background: 'rgba(255, 255, 255, 0.2)', 
          borderRadius: '10px',
          overflow: 'hidden'
        }}>
          <div 
            style={{ 
              height: '100%', 
              width: `${progress}%`, 
              background: 'white',
              borderRadius: '10px',
              transition: 'width 0.5s ease'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontSize: '14px', opacity: 0.8 }}>
          <div>{checklist.filter(item => item.status === 'completed').length} completed</div>
          <div>{checklist.filter(item => item.status === 'in-progress').length} in progress</div>
          <div>{checklist.filter(item => item.status === 'not-started').length} not started</div>
        </div>
      </div>

      {/* Checklist */}
      <div style={{ 
        background: 'white',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.08)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h2 style={{ color: '#2c3e50', margin: 0 }}>Checklist Items</h2>
          <div style={{ color: '#6c757d' }}>
            {loading ? 'Loading...' : `${checklist.length} requirements`}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading checklist...</div>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {checklist.map((item) => (
              <div 
                key={item.id} 
                style={{ 
                  border: `2px solid ${getStatusColor(item.status)}40`,
                  background: `${getStatusColor(item.status)}10`,
                  borderRadius: '12px',
                  padding: '25px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 10px', color: '#2c3e50' }}>{item.requirement}</h3>
                  <p style={{ margin: '0', color: '#6c757d' }}>{item.description}</p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{
                    padding: '8px 20px',
                    background: getStatusColor(item.status),
                    color: 'white',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    minWidth: '120px',
                    textAlign: 'center'
                  }}>
                    {getStatusText(item.status)}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => updateItemStatus(item.id, 'not-started')}
                      disabled={saving || item.status === 'not-started'}
                      style={{
                        padding: '8px 15px',
                        background: item.status === 'not-started' ? '#6c757d' : '#e9ecef',
                        color: item.status === 'not-started' ? 'white' : '#495057',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: item.status === 'not-started' ? 'default' : 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => updateItemStatus(item.id, 'in-progress')}
                      disabled={saving || item.status === 'in-progress'}
                      style={{
                        padding: '8px 15px',
                        background: item.status === 'in-progress' ? '#ffc107' : '#fff3cd',
                        color: item.status === 'in-progress' ? 'white' : '#856404',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: item.status === 'in-progress' ? 'default' : 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Start
                    </button>
                    <button
                      onClick={() => updateItemStatus(item.id, 'completed')}
                      disabled={saving || item.status === 'completed'}
                      style={{
                        padding: '8px 15px',
                        background: item.status === 'completed' ? '#28a745' : '#d4edda',
                        color: item.status === 'completed' ? 'white' : '#155724',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: item.status === 'completed' ? 'default' : 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Complete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Export Section */}
      <div style={{ 
        marginTop: '40px',
        background: '#f8f9fa',
        borderRadius: '15px',
        padding: '30px',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>Export Compliance Report</h3>
        <p style={{ color: '#6c757d', marginBottom: '25px' }}>Generate detailed compliance reports for auditors</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <button
            onClick={() => alert(`Generating ${standard} PDF report... (Demo)`)}
            style={{
              padding: '15px 30px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <span style={{ marginRight: '10px' }}>📄</span>
            Export as PDF
          </button>
          
          <button
            onClick={() => alert(`Generating ${standard} Excel report... (Demo)`)}
            style={{
              padding: '15px 30px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <span style={{ marginRight: '10px' }}>📊</span>
            Export as Excel
          </button>
        </div>
      </div>

      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        background: '#e8f4fd', 
        borderRadius: '10px',
        fontSize: '14px',
        color: '#004085'
      }}>
        <strong>API Connection:</strong> GET http://localhost:5001/api/compliance/{standard}
        {error && <div style={{ marginTop: '10px', color: '#856404' }}>Using demo data</div>}
      </div>
    </div>
  );
};

export default CompliancePage;
