import React, { useState, useEffect } from 'react';
import { identityAPI, handleApiError } from '../services/api';

const IdentityVerificationPage = () => {
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchVerificationData = async () => {
    try {
      setLoading(true);
      const response = await identityAPI.getStatus();
      console.log('Identity API response:', response.data);
      
      if (response.data) {
        setVerificationStatus(response.data);
        if (response.data.documents) {
          setDocuments(response.data.documents.map((doc, index) => ({
            id: index + 1,
            name: typeof doc === 'string' ? doc : doc.name || `Document ${index + 1}`,
            type: typeof doc === 'string' ? 'unknown' : doc.type || 'passport',
            status: typeof doc === 'string' ? 'pending' : doc.status || 'pending',
            uploadedAt: new Date().toISOString()
          })));
        }
      } else {
        // Demo data
        setVerificationStatus({
          status: 'pending',
          riskScore: 65,
          lastUpdated: new Date().toISOString()
        });
        setDocuments([
          { id: 1, name: 'passport.jpg', type: 'passport', status: 'verified', uploadedAt: '2025-01-19T10:30:00Z' },
          { id: 2, name: 'utility_bill.pdf', type: 'utility-bill', status: 'pending', uploadedAt: '2025-01-19T11:15:00Z' }
        ]);
      }
    } catch (err) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      console.error('Error fetching verification data:', err);
      
      // Fallback demo data
      setVerificationStatus({
        status: 'pending',
        riskScore: 65,
        lastUpdated: new Date().toISOString()
      });
      setDocuments([
        { id: 1, name: 'demo_passport.jpg', type: 'passport', status: 'pending' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File too large. Maximum size is 10MB.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    try {
      setUploading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('document', selectedFile);
      formData.append('type', 'identity-verification');
      formData.append('description', 'Identity verification document');

      console.log('Uploading file:', selectedFile.name);
      const response = await identityAPI.uploadDocument(formData);
      console.log('Upload response:', response.data);
      
      alert('✅ Document uploaded successfully!');
      
      // Add to local documents list
      const newDocument = {
        id: documents.length + 1,
        name: selectedFile.name,
        type: selectedFile.type.includes('image') ? 'photo' : 'document',
        status: 'pending',
        uploadedAt: new Date().toISOString()
      };
      setDocuments([...documents, newDocument]);
      setSelectedFile(null);
      
      // Refresh verification status
      fetchVerificationData();
    } catch (err) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      console.error('Error uploading document:', err);
      
      // Demo success
      const newDocument = {
        id: documents.length + 1,
        name: selectedFile.name,
        type: 'demo-document',
        status: 'pending',
        uploadedAt: new Date().toISOString()
      };
      setDocuments([...documents, newDocument]);
      setSelectedFile(null);
      alert('Demo: Document uploaded (using demo data)');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitVerification = async () => {
    try {
      setSubmitting(true);
      setError('');
      
      console.log('Submitting verification...');
      const response = await identityAPI.submitVerification();
      console.log('Submit verification response:', response.data);
      
      alert('✅ Verification submitted for review!');
      fetchVerificationData(); // Refresh status
    } catch (err) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      console.error('Error submitting verification:', err);
      
      // Demo success
      setVerificationStatus({
        ...verificationStatus,
        status: 'under-review',
        lastUpdated: new Date().toISOString()
      });
      alert('Demo: Verification submitted (using demo data)');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchVerificationData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return '#28a745';
      case 'under-review': return '#ffc107';
      case 'rejected': return '#dc3545';
      case 'pending': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'verified': return 'Verified';
      case 'under-review': return 'Under Review';
      case 'rejected': return 'Rejected';
      case 'pending': return 'Pending';
      default: return status;
    }
  };

  const getDocumentIcon = (type) => {
    switch (type) {
      case 'passport': return '📘';
      case 'driver-license': return '🚗';
      case 'utility-bill': return '🏠';
      case 'photo': return '📸';
      default: return '📄';
    }
  };

  const getRiskColor = (score) => {
    if (score >= 80) return '#dc3545';
    if (score >= 60) return '#ffc107';
    return '#28a745';
  };

  const getRiskLevel = (score) => {
    if (score >= 80) return 'High Risk';
    if (score >= 60) return 'Medium Risk';
    return 'Low Risk';
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Identity Verification</h1>
      <p style={{ color: '#6c757d', marginBottom: '30px' }}>Use Case 6: Secure digital identity verification with risk assessment</p>
      
      {error && (
        <div style={{ background: '#fff3cd', color: '#856404', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Status Overview */}
      <div style={{ 
        background: 'white',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
        marginBottom: '40px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h2 style={{ color: '#2c3e50', margin: '0 0 10px' }}>Verification Status</h2>
            <p style={{ color: '#6c757d', margin: 0 }}>Current identity verification progress</p>
          </div>
          
          {verificationStatus && (
            <div style={{
              padding: '15px 30px',
              background: getStatusColor(verificationStatus.status),
              color: 'white',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              {getStatusText(verificationStatus.status)}
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading verification status...</div>
        ) : verificationStatus && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            {/* Risk Assessment */}
            <div>
              <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Risk Assessment</h3>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '180px', 
                  height: '180px', 
                  borderRadius: '50%',
                  background: `conic-gradient(${getRiskColor(verificationStatus.riskScore)} 0% ${verificationStatus.riskScore}%, #e9ecef ${verificationStatus.riskScore}% 100%)`,
                  margin: '0 auto 20px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{ 
                    width: '140px', 
                    height: '140px', 
                    borderRadius: '50%',
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}>
                    <span style={{ fontSize: '36px', fontWeight: 'bold', color: getRiskColor(verificationStatus.riskScore) }}>
                      {verificationStatus.riskScore}
                    </span>
                    <span style={{ fontSize: '14px', color: '#6c757d' }}>/100</span>
                  </div>
                </div>
                <div style={{
                  padding: '10px 25px',
                  background: getRiskColor(verificationStatus.riskScore),
                  color: 'white',
                  borderRadius: '20px',
                  display: 'inline-block',
                  fontWeight: 'bold'
                }}>
                  {getRiskLevel(verificationStatus.riskScore)}
                </div>
                <p style={{ color: '#6c757d', marginTop: '15px' }}>
                  {verificationStatus.riskScore >= 80 ? 'Requires manual review' :
                   verificationStatus.riskScore >= 60 ? 'Additional documents recommended' :
                   'Low risk - automatic approval likely'}
                </p>
              </div>
            </div>

            {/* Verification Steps */}
            <div>
              <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Verification Steps</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {[
                  { step: 1, name: 'Document Upload', status: documents.length > 0 ? 'completed' : 'pending', icon: '📄' },
                  { step: 2, name: 'Automated Checks', status: 'in-progress', icon: '🤖' },
                  { step: 3, name: 'Risk Assessment', status: verificationStatus.riskScore > 0 ? 'completed' : 'pending', icon: '📊' },
                  { step: 4, name: 'Final Review', status: verificationStatus.status === 'verified' ? 'completed' : 'pending', icon: '👁️' }
                ].map((step) => (
                  <div key={step.step} style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    padding: '15px',
                    background: step.status === 'completed' ? '#d4edda' : 
                              step.status === 'in-progress' ? '#fff3cd' : '#f8f9fa',
                    borderRadius: '10px',
                    borderLeft: `5px solid ${step.status === 'completed' ? '#28a745' : 
                                step.status === 'in-progress' ? '#ffc107' : '#6c757d'}`
                  }}>
                    <div style={{ fontSize: '24px', marginRight: '15px' }}>{step.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>{step.name}</div>
                      <div style={{ fontSize: '14px', color: '#6c757d' }}>
                        {step.status === 'completed' ? 'Completed' :
                         step.status === 'in-progress' ? 'In Progress' : 'Pending'}
                      </div>
                    </div>
                    <div style={{
                      padding: '5px 15px',
                      background: step.status === 'completed' ? '#28a745' : 
                                step.status === 'in-progress' ? '#ffc107' : '#6c757d',
                      color: 'white',
                      borderRadius: '15px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      Step {step.step}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Document Upload Section */}
      <div style={{ 
        background: 'white',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
        marginBottom: '40px'
      }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '25px' }}>Document Upload</h2>
        
        <div style={{ 
          border: '2px dashed #007bff',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          marginBottom: '30px',
          background: '#f8f9fa'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📤</div>
          <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>Upload Identity Documents</h3>
          <p style={{ color: '#6c757d', marginBottom: '25px' }}>
            Supported: Passport, Driver's License, Utility Bills, National ID (PDF, JPG, PNG up to 10MB)
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <input
              type="file"
              id="document-upload"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <label
              htmlFor="document-upload"
              style={{
                padding: '15px 30px',
                background: '#007bff',
                color: 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                display: 'inline-block'
              }}
            >
              Select File
            </label>
            
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              style={{
                padding: '15px 30px',
                background: !selectedFile || uploading ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: !selectedFile || uploading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              {uploading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
          
          {selectedFile && (
            <div style={{ 
              marginTop: '20px', 
              padding: '15px', 
              background: '#d4edda', 
              borderRadius: '8px',
              display: 'inline-block'
            }}>
              📄 Selected: <strong>{selectedFile.name}</strong> ({Math.round(selectedFile.size / 1024)} KB)
            </div>
          )}
        </div>

        {/* Uploaded Documents */}
        <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Uploaded Documents</h3>
        {documents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
            No documents uploaded yet
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {documents.map((doc) => (
              <div key={doc.id} style={{ 
                display: 'flex', 
                alignItems: 'center',
                padding: '20px',
                background: '#f8f9fa',
                borderRadius: '10px',
                borderLeft: `5px solid ${doc.status === 'verified' ? '#28a745' : 
                            doc.status === 'rejected' ? '#dc3545' : '#ffc107'}`
              }}>
                <div style={{ fontSize: '32px', marginRight: '20px' }}>
                  {getDocumentIcon(doc.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', color: '#2c3e50', marginBottom: '5px' }}>
                    {doc.name}
                  </div>
                  <div style={{ color: '#6c757d', fontSize: '14px' }}>
                    Type: {doc.type} • Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{
                  padding: '8px 20px',
                  background: doc.status === 'verified' ? '#d4edda' : 
                            doc.status === 'rejected' ? '#f8d7da' : '#fff3cd',
                  color: doc.status === 'verified' ? '#155724' : 
                        doc.status === 'rejected' ? '#721c24' : '#856404',
                  borderRadius: '20px',
                  fontWeight: 'bold'
                }}>
                  {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '15px',
        padding: '30px',
        color: 'white'
      }}>
        <div>
          <h3 style={{ margin: '0 0 10px' }}>Ready to Submit?</h3>
          <p style={{ opacity: 0.9, margin: 0 }}>Submit all documents for verification review</p>
        </div>
        
        <button
          onClick={handleSubmitVerification}
          disabled={submitting || documents.length === 0}
          style={{
            padding: '15px 40px',
            background: submitting || documents.length === 0 ? 'rgba(255,255,255,0.3)' : 'white',
            color: submitting || documents.length === 0 ? 'rgba(255,255,255,0.7)' : '#667eea',
            border: 'none',
            borderRadius: '10px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: submitting || documents.length === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          {submitting ? 'Submitting...' : 'Submit for Verification'}
        </button>
      </div>

      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        background: '#f8f9fa', 
        borderRadius: '10px',
        fontSize: '14px',
        color: '#6c757d'
      }}>
        <strong>API Connection:</strong> GET http://localhost:5001/api/identity/status
        {error && <div style={{ marginTop: '10px', color: '#856404' }}>Using demo data</div>}
      </div>
    </div>
  );
};

export default IdentityVerificationPage;
