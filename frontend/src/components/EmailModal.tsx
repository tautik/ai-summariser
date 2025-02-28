import { useState, useEffect } from 'react';
import { sendSummaryEmail } from '../services/emailService';
import { FaEnvelope, FaSpinner, FaTimes } from 'react-icons/fa';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  summaryData: {
    summary: string;
    details?: any;
  };
}

const EmailModal = ({ isOpen, onClose, serviceName, summaryData }: EmailModalProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError('');
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleSubmit = async () => {
    // Validate email
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await sendSummaryEmail({
        email,
        serviceName,
        summaryData
      });

      if (result.success) {
        showSuccessToast('Summary report has been sent to your email');
        onClose();
      } else {
        setError(result.message || 'Failed to send email');
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Error sending email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div>
      {/* Toast notification */}
      {showToast && (
        <div 
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#48BB78',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 9999,
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Modal backdrop */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
        onClick={onClose}
      >
        {/* Modal content */}
        <div 
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            width: '100%',
            maxWidth: '500px',
            margin: '0 16px',
            overflow: 'hidden',
            animation: 'fadeIn 0.3s ease-out'
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Modal header */}
          <div 
            style={{
              background: 'linear-gradient(90deg, #4299e1, #63b3ed)',
              color: 'white',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FaEnvelope style={{ marginRight: '10px' }} />
              <span style={{ fontWeight: 'bold' }}>Send Summary Report</span>
            </div>
            <button 
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px'
              }}
              onClick={onClose}
            >
              <FaTimes />
            </button>
          </div>
          
          {/* Modal body */}
          <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <label 
                style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'medium' 
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email address"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '16px',
                  borderRadius: '6px',
                  border: error ? '1px solid #E53E3E' : '1px solid #CBD5E0',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              {error && (
                <div style={{ color: '#E53E3E', marginTop: '8px', fontSize: '14px' }}>
                  {error}
                </div>
              )}
            </div>
            
            <div>
              <label 
                style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'medium' 
                }}
              >
                Service
              </label>
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#F7FAFC',
                  borderRadius: '6px',
                  fontWeight: 'medium'
                }}
              >
                {serviceName}
              </div>
            </div>
          </div>

          {/* Modal footer */}
          <div 
            style={{
              padding: '16px',
              display: 'flex',
              justifyContent: 'flex-end',
              borderTop: '1px solid #E2E8F0'
            }}
          >
            <button
              style={{
                padding: '8px 16px',
                marginRight: '12px',
                backgroundColor: 'white',
                color: '#4A5568',
                border: '1px solid #CBD5E0',
                borderRadius: '6px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1
              }}
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              style={{
                padding: '8px 16px',
                background: 'linear-gradient(90deg, #4299e1, #63b3ed)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1
              }}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <FaSpinner style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
              ) : (
                <FaEnvelope style={{ marginRight: '8px' }} />
              )}
              {isLoading ? 'Sending...' : 'Send Report'}
            </button>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default EmailModal; 