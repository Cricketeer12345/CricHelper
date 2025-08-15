import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function RegisterForm() {
  const [formData, setFormData] = React.useState({
    username: '',
    password: '',
    role: '',
    batting_type: '',
    batting_position: '',
    bowling_hand: '',
    bowling_type: '',
    security_question: '',
    security_answer: '',
  });
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const securityQuestions = [
    "What is your best friend's name?",
    "What is your pet's name?",
    "What is your mother's maiden name?",
    "What city were you born in?",
    "What is your favorite cricket team?",
    "What is your first school's name?",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate required fields based on role
    if (!formData.username || !formData.password || !formData.role || !formData.security_question || !formData.security_answer) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    const success = await register(formData);
    
    if (success) {
      navigate('/login');
    } else {
      setError('Registration failed. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      role: value,
      batting_type: '',
      batting_position: '',
      bowling_hand: '',
      bowling_type: '',
    }));
  };

  const needsBattingInfo = formData.role === 'batter' || formData.role === 'allrounder' || formData.role === 'wicketkeeper';
  const needsBowlingInfo = formData.role === 'bowler' || formData.role === 'allrounder';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Player Role</Label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
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

          {needsBattingInfo && (
            <>
              <div className="space-y-2">
                <Label htmlFor="batting_type">Batting Type</Label>
                <Select value={formData.batting_type} onValueChange={(value) => setFormData(prev => ({ ...prev, batting_type: value }))}>
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
                <Select value={formData.batting_position} onValueChange={(value) => setFormData(prev => ({ ...prev, batting_position: value }))}>
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
            </>
          )}

          {needsBowlingInfo && (
            <>
              <div className="space-y-2">
                <Label htmlFor="bowling_hand">Bowling Hand</Label>
                <Select value={formData.bowling_hand} onValueChange={(value) => setFormData(prev => ({ ...prev, bowling_hand: value }))}>
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
                <Select value={formData.bowling_type} onValueChange={(value) => setFormData(prev => ({ ...prev, bowling_type: value }))}>
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
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="security_question">Security Question</Label>
            <Select value={formData.security_question} onValueChange={(value) => setFormData(prev => ({ ...prev, security_question: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a security question" />
              </SelectTrigger>
              <SelectContent>
                {securityQuestions.map((question) => (
                  <SelectItem key={question} value={question}>
                    {question}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="security_answer">Security Answer</Label>
            <Input
              id="security_answer"
              type="text"
              value={formData.security_answer}
              onChange={(e) => setFormData(prev => ({ ...prev, security_answer: e.target.value }))}
              placeholder="Enter your answer"
              required
            />
          </div>
          
          {error && (
            <div className="text-sm text-destructive">{error}</div>
          )}
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
