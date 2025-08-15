import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function AccountSettingsForm() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [formData, setFormData] = React.useState({
    username: user?.username || '',
    role: user?.role || '',
    batting_type: user?.batting_type || '',
    batting_position: user?.batting_position || '',
    bowling_hand: user?.bowling_hand || '',
    bowling_type: user?.bowling_type || '',
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Validate passwords if changing
    if (formData.new_password) {
      if (!formData.current_password) {
        setError('Current password is required to change password');
        setIsLoading(false);
        return;
      }
      if (formData.new_password !== formData.confirm_password) {
        setError('New passwords do not match');
        setIsLoading(false);
        return;
      }
      if (formData.new_password.length < 6) {
        setError('New password must be at least 6 characters long');
        setIsLoading(false);
        return;
      }
    }

    try {
      const updateData = {
        userId: user?.id,
        username: formData.username,
        role: formData.role,
        batting_type: formData.batting_type || null,
        batting_position: formData.batting_position || null,
        bowling_hand: formData.bowling_hand || null,
        bowling_type: formData.bowling_type || null,
        current_password: formData.current_password || null,
        new_password: formData.new_password || null,
      };

      const response = await fetch('/api/auth/update-account', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Update user context with new data
        updateUser(result.user);
        setSuccess('Account updated successfully');
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          current_password: '',
          new_password: '',
          confirm_password: '',
        }));
      } else {
        setError(result.error || 'Failed to update account');
      }
    } catch (error) {
      console.error('Update account error:', error);
      setError('An error occurred while updating your account');
    }

    setIsLoading(false);
  };

  const needsBattingInfo = formData.role === 'batter' || formData.role === 'allrounder' || formData.role === 'wicketkeeper';
  const needsBowlingInfo = formData.role === 'bowler' || formData.role === 'allrounder';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role">Player Role</Label>
          <Select 
            value={formData.role} 
            onValueChange={(value) => setFormData(prev => ({
              ...prev,
              role: value,
              batting_type: '',
              batting_position: '',
              bowling_hand: '',
              bowling_type: '',
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="batter">Batter</SelectItem>
              <SelectItem value="bowler">Bowler</SelectItem>
              <SelectItem value="allrounder">All-rounder</SelectItem>
              <SelectItem value="wicketkeeper">Wicket-keeper</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {needsBattingInfo && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="batting_type">Batting Type</Label>
            <Select 
              value={formData.batting_type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, batting_type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select batting type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="righty">Right-handed</SelectItem>
                <SelectItem value="lefty">Left-handed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="batting_position">Batting Position</Label>
            <Select 
              value={formData.batting_position} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, batting_position: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select batting position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top_order">Top Order</SelectItem>
                <SelectItem value="middle_order">Middle Order</SelectItem>
                <SelectItem value="tail_ender">Tail Ender</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {needsBowlingInfo && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="bowling_hand">Bowling Hand</Label>
            <Select 
              value={formData.bowling_hand} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, bowling_hand: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select bowling hand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="right">Right-handed</SelectItem>
                <SelectItem value="left">Left-handed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bowling_type">Bowling Type</Label>
            <Select 
              value={formData.bowling_type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, bowling_type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select bowling type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fast">Fast</SelectItem>
                <SelectItem value="medium-fast">Medium-fast</SelectItem>
                <SelectItem value="off-break">Off-break</SelectItem>
                <SelectItem value="leg-break">Leg-break</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4 text-amber-900">Change Password (Optional)</h3>
        
        <div className="grid gap-4 md:grid-cols-1">
          <div className="space-y-2">
            <Label htmlFor="current_password">Current Password</Label>
            <Input
              id="current_password"
              type="password"
              value={formData.current_password}
              onChange={(e) => setFormData(prev => ({ ...prev, current_password: e.target.value }))}
              placeholder="Enter current password to change"
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new_password">New Password</Label>
              <Input
                id="new_password"
                type="password"
                value={formData.new_password}
                onChange={(e) => setFormData(prev => ({ ...prev, new_password: e.target.value }))}
                placeholder="Enter new password"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirm New Password</Label>
              <Input
                id="confirm_password"
                type="password"
                value={formData.confirm_password}
                onChange={(e) => setFormData(prev => ({ ...prev, confirm_password: e.target.value }))}
                placeholder="Confirm new password"
              />
            </div>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}
      
      <div className="flex justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate('/')}
          className="border-2 border-amber-300 text-amber-900 hover:bg-amber-100"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Account'}
        </Button>
      </div>
    </form>
  );
}
