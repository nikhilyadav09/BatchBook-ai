import React, { useState } from 'react';

// Add type for result
interface Result {
  message: string;
  type: 'info' | 'success' | 'error';
}

const AuthTest = () => {
  const [email, setEmail] = useState('test@example.com');
  const [otp, setOtp] = useState('');
  const [results, setResults] = useState<Result[]>([]);

  const addResult = (message: string, type: Result['type'] = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setResults(prev => [...prev, { message: `${timestamp}: ${message}`, type }]);
  };

  const testRequestOTP = async () => {
    try {
      addResult('🔄 Requesting OTP...', 'info');
      
      const response = await fetch('http://localhost:5000/api/auth/request-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        addResult(`✅ OTP Request Success: ${data.message}`, 'success');
      } else {
        addResult(`❌ OTP Request Failed: ${data.message}`, 'error');
      }
    } catch (error) {
      addResult(`❌ Network Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`, 'error');
    }
  };

  const testVerifyOTP = async () => {
    try {
      addResult('🔄 Verifying OTP...', 'info');
      
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      
      if (response.ok) {
        addResult(`✅ OTP Verify Success: ${data.message}`, 'success');
        
        // Check if tokens are in response
        if (data.data?.accessToken) {
          localStorage.setItem('batchbook_access_token', data.data.accessToken);
          addResult('✅ Access token stored', 'success');
        }
        if (data.data?.refreshToken) {
          localStorage.setItem('batchbook_refresh_token', data.data.refreshToken);
          addResult('✅ Refresh token stored', 'success');
        }
      } else {
        addResult(`❌ OTP Verify Failed: ${data.message}`, 'error');
      }
    } catch (error) {
      addResult(`❌ Network Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`, 'error');
    }
  };

  const testGetUser = async () => {
    try {
      addResult('🔄 Getting current user...', 'info');
      
      const token = localStorage.getItem('batchbook_access_token');
      if (!token) {
        addResult('❌ No access token found', 'error');
        return;
      }

      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        addResult(`✅ User Data: ${data.data?.user?.email || 'No email'}`, 'success');
      } else {
        addResult(`❌ Get User Failed: ${data.message}`, 'error');
      }
    } catch (error) {
      addResult(`❌ Network Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`, 'error');
    }
  };

  const checkTokens = () => {
    const accessToken = localStorage.getItem('batchbook_access_token');
    const refreshToken = localStorage.getItem('batchbook_refresh_token');
    
    addResult(`Access Token: ${accessToken ? 'Present' : 'Missing'}`, accessToken ? 'success' : 'error');
    addResult(`Refresh Token: ${refreshToken ? 'Present' : 'Missing'}`, refreshToken ? 'success' : 'error');
  };

  const clearTokens = () => {
    localStorage.removeItem('batchbook_access_token');
    localStorage.removeItem('batchbook_refresh_token');
    localStorage.removeItem('batchbook_token_expiry');
    addResult('🗑️ All tokens cleared', 'info');
  };

  const getResultColor = (type: Result['type']) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">🧪 Auth System Test</h1>
        
        {/* Test Controls */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Test Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="Enter email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="Enter OTP from server logs"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
            <button
              onClick={testRequestOTP}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
            >
              Request OTP
            </button>
            
            <button
              onClick={testVerifyOTP}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium"
            >
              Verify OTP
            </button>
            
            <button
              onClick={testGetUser}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-medium"
            >
              Get User
            </button>
            
            <button
              onClick={checkTokens}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded font-medium"
            >
              Check Tokens
            </button>
            
            <button
              onClick={clearTokens}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium"
            >
              Clear Tokens
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Test Results</h2>
            <button
              onClick={() => setResults([])}
              className="text-gray-400 hover:text-white text-sm"
            >
              Clear Results
            </button>
          </div>
          
          <div className="bg-black rounded p-4 font-mono text-sm max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-gray-500">No test results yet. Run some tests above.</p>
            ) : (
              results.map((result, index) => (
                <div key={index} className={`mb-1 ${getResultColor(result.type)}`}>
                  {result.message}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mt-6">
          <h3 className="text-blue-300 font-semibold mb-2">📋 Testing Steps:</h3>
          <ol className="text-blue-200 text-sm space-y-1">
            <li>1. Make sure your backend server is running on port 5000</li>
            <li>2. Enter an email and click "Request OTP"</li>
            <li>3. Check your server console for the OTP code</li>
            <li>4. Enter the OTP and click "Verify OTP"</li>
            <li>5. Click "Get User" to test authenticated requests</li>
            <li>6. Use "Check Tokens" to verify token storage</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AuthTest;