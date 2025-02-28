import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

/**
 * Component to check and display RunPod API connection status
 */
const RunpodStatus = () => {
  const [status, setStatus] = useState('checking'); // 'checking', 'connected', 'error'
  const [errorDetails, setErrorDetails] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      const runpodUrl = import.meta.env.VITE_RUNPOD_URL;
      const runpodToken = import.meta.env.VITE_RUNPOD_TOKEN;

      // Check if environment variables are set
      if (!runpodUrl || runpodUrl.includes('YOUR_ENDPOINT_ID') || 
          !runpodToken || runpodToken.includes('YOUR_API_TOKEN')) {
        throw new Error('API configuration is missing or incomplete. Please check your .env file.');
      }

      // Make a simple ping to the RunPod API
      // Note: This is just a status check, not a real API call
      const response = await fetch(`${runpodUrl}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${runpodToken}`
        }
      });

      if (response.ok) {
        setStatus('connected');
      } else {
        throw new Error(`API returned status: ${response.status}`);
      }
    } catch (error) {
      setStatus('error');
      setErrorDetails(error.message || 'Unknown error connecting to RunPod API');
      console.error('RunPod API check failed:', error);
    }
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // Render troubleshooting steps if there's an error
  const renderTroubleshooting = () => {
    return (
      <div className="runpod-troubleshooting">
        <h4>Troubleshooting Steps:</h4>
        <ol>
          <li>Check that you have a valid RunPod account and API token</li>
          <li>Verify your .env file has the correct values for VITE_RUNPOD_URL and VITE_RUNPOD_TOKEN</li>
          <li>Ensure your RunPod endpoint is deployed and running</li>
          <li>Check that your RunPod credits/balance is sufficient</li>
          <li>Try refreshing the page</li>
        </ol>
      </div>
    );
  };

  return (
    <div className={`runpod-status ${status}`}>
      <div className="status-indicator" onClick={toggleDetails}>
        {status === 'connected' && <FaCheckCircle className="status-icon connected" />}
        {status === 'checking' && <FaInfoCircle className="status-icon checking" />}
        {status === 'error' && <FaExclamationTriangle className="status-icon error" />}
        
        <span className="status-text">
          {status === 'connected' && 'RunPod API: Connected'}
          {status === 'checking' && 'RunPod API: Checking connection...'}
          {status === 'error' && 'RunPod API: Connection Error'}
        </span>
      </div>

      {(showDetails && status === 'error') && (
        <div className="runpod-error-details">
          <p className="error-message">{errorDetails}</p>
          {renderTroubleshooting()}
          <button className="retry-button" onClick={checkApiStatus}>
            Retry Connection
          </button>
        </div>
      )}
    </div>
  );
};

export default RunpodStatus; 