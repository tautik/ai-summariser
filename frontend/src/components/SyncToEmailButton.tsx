import { useState } from 'react';
import { FaEnvelope, FaSync } from 'react-icons/fa';
import EmailModal from './EmailModal';

interface SyncToEmailButtonProps {
  serviceName: string;
  summaryData: {
    summary: string;
    details?: any;
  };
}

const SyncToEmailButton = ({ serviceName, summaryData }: SyncToEmailButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <>
      <button
        style={{
          position: 'fixed',
          top: '16px',
          right: '80px',
          zIndex: 1000,
          background: isHovered 
            ? 'linear-gradient(90deg, #3182ce, #63b3ed)' 
            : 'linear-gradient(90deg, #4299e1, #63b3ed)',
          color: 'white',
          borderRadius: '9999px',
          boxShadow: '0 2px 10px rgba(66, 153, 225, 0.2)',
          padding: '12px 16px',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s ease',
          transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
          animation: 'fadeIn 0.5s ease-out'
        }}
        onClick={onOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="animate-fadeIn"
      >
        <FaEnvelope /> Sync to Email <FaSync />
      </button>

      <EmailModal
        isOpen={isOpen}
        onClose={onClose}
        serviceName={serviceName}
        summaryData={summaryData}
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
        `}
      </style>
    </>
  );
};

export default SyncToEmailButton; 