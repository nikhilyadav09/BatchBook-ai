// client/src/components/auth/AuthContainer.tsx
import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { OTPForm } from './OTPForm';

type AuthMode = 'login' | 'register' | 'otp';

export const AuthContainer: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {mode === 'login' && (
          <LoginForm
            onSwitchToRegister={() => setMode('register')}
            onSwitchToOTP={() => setMode('otp')}
          />
        )}
        {mode === 'register' && (
          <RegisterForm onSwitchToLogin={() => setMode('login')} />
        )}
        {mode === 'otp' && (
          <OTPForm onSwitchToLogin={() => setMode('login')} />
        )}
      </div>
    </div>
  );
};