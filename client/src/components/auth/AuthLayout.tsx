// client/src/components/auth/AuthLayout.tsx
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { OTPForm } from './OTPForm';
import { Users, Sparkles, Shield, Heart } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  const [authMode, setAuthMode] = useState<'welcome' | 'otp'>('welcome');
  const { user, isLoading } = useAuth();

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show loading if checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (authMode === 'otp') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <OTPForm onBack={() => setAuthMode('welcome')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Branding */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
          <div className="max-w-md text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-8">
              <div className="bg-blue-600 rounded-2xl p-3 mr-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                BatchBook AI
              </h1>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Relive Your Memories with AI
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Share, discover, and cherish your batch memories with intelligent AI assistance that brings your stories to life.
            </p>

            <div className="space-y-4">
              <div className="flex items-center">
                <Sparkles className="h-6 w-6 text-blue-600 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">
                  AI-powered memory captions and insights
                </span>
              </div>
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-green-600 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">
                  Secure and private batch communities
                </span>
              </div>
              <div className="flex items-center">
                <Heart className="h-6 w-6 text-pink-600 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">
                  Connect with your batch mates forever
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome Back!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Sign in to access your memories
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setAuthMode('otp')}
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Users className="h-5 w-5 mr-2" />
                  Sign in with OTP
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                      Quick & Secure
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No passwords required. We'll send you a secure one-time code.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};