import { useState } from 'react';
import { FaEnvelope, FaSync } from 'react-icons/fa';
import EmailModal from './EmailModal';

interface SyncToEmailButtonProps {
  serviceName: string;
  summaryData: {
    summary: string;
    details?: any;
  } | null;
}

const SyncToEmailButton = ({ serviceName, summaryData }: SyncToEmailButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const onOpen = () => {
    if (summaryData) {
      setIsOpen(true);
    } else {
      alert("No summary data available to send. Please connect to a service first.");
    }
  };
  
  const onClose = () => setIsOpen(false);

  // Default summary data if none is provided
  const defaultSummaryData = {
    summary: `No detailed summary available for ${serviceName}. Please connect to a service to generate insights.`,
    details: {
      service: serviceName,
      timestamp: new Date().toISOString(),
      metrics: {}
    }
  };

  // Use provided summary data or default if null/undefined
  const safeData = summaryData || defaultSummaryData;

  return (
    <>
      <button
        style={{
          position: 'fixed',
          top: '20px',
          right: '100px',
          zIndex: 1000,
          background: isHovered 
            ? 'linear-gradient(90deg, #2563eb, #3b82f6)' 
            : 'linear-gradient(90deg, #3b82f6, #60a5fa)',
          color: 'white',
          borderRadius: '9999px',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
          padding: '12px 20px',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          transition: 'all 0.3s ease',
          transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
          animation: 'fadeIn 0.5s ease-out',
          fontSize: '15px',
          fontWeight: '500'
        }}
        onClick={onOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="animate-fadeIn"
      >
        <FaEnvelope style={{ fontSize: '16px' }} /> 
        <span>Sync to Email</span> 
        <FaSync style={{ fontSize: '14px' }} />
      </button>

      <EmailModal
        isOpen={isOpen}
        onClose={onClose}
        serviceName={serviceName}
        summaryData={safeData}
      />

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
          
          @media (max-width: 768px) {
            button.animate-fadeIn {
              top: 16px;
              right: 70px;
              padding: 10px 16px;
              font-size: 14px;
            }
          }
        `}
      </style>
    </>
  );
};

export default SyncToEmailButton; 