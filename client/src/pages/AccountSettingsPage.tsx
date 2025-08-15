import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AccountSettingsForm } from './account/AccountSettingsForm';

export function AccountSettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="cricket-field min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="bg-gradient-to-r from-amber-100/40 to-green-100/40 p-6 rounded-xl border-2 border-amber-200">
            <h1 className="text-4xl font-bold text-amber-900 mb-2 tracking-wide">⚙️ Account Settings</h1>
            <p className="text-amber-700 font-medium">Update your cricket profile and preferences</p>
          </div>
          <div className="flex items-center gap-4 bg-amber-50/60 p-4 rounded-xl border border-amber-200">
            <div className="text-center">
              <div className="text-sm text-amber-700 font-medium">Signed in as</div>
              <div className="text-lg font-bold text-amber-900">{user?.username}</div>
            </div>
            <Button variant="outline" onClick={handleGoBack} className="border-2 border-amber-300 text-amber-900 hover:bg-amber-100">
              Back to Dashboard
            </Button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-gradient-to-br from-green-50/60 to-amber-50/60 border-2 border-green-200/50">
            <CardHeader className="bg-gradient-to-r from-amber-200/50 to-green-200/50">
              <CardTitle className="text-amber-900 flex items-center gap-2">
                👤 Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <AccountSettingsForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
