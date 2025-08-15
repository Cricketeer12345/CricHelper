import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ForgotPasswordForm } from './components/ForgotPasswordForm';

export function ForgotPasswordPage() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="cricket-field min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-green-100 to-green-200">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center bg-gradient-to-r from-amber-100/80 to-green-100/80 p-8 rounded-2xl border-4 border-amber-300 shadow-2xl">
          <div className="mb-4">
            <div className="text-6xl mb-2">🔐</div>
            <h1 className="text-3xl font-bold text-amber-900 tracking-wide">Reset Password</h1>
          </div>
          <p className="text-amber-700 font-medium">Answer your security question to reset your password</p>
          <div className="mt-4 text-sm text-amber-600">
            🏏 Get back to improving your cricket skills
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50/90 to-green-50/90 rounded-xl border-2 border-amber-200 shadow-xl">
          <ForgotPasswordForm />
        </div>
        
        <div className="text-center bg-white/60 p-4 rounded-xl border border-amber-200">
          <p className="text-sm text-amber-700">
            Remember your password?{' '}
            <Link to="/login" className="font-medium text-amber-800 hover:text-amber-900 hover:underline">
              🏏 Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
