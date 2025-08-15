import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BattingSection } from './sections/BattingSection';
import { BowlingSection } from './sections/BowlingSection';
import { FieldingSection } from './sections/FieldingSection';
import { TeamBuilderSection } from './sections/TeamBuilderSection';

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = React.useState('batting');

  const handleLogout = () => {
    logout();
  };

  const handleAccountSettings = () => {
    navigate('/account-settings');
  };

  const formatRole = (role: string) => {
    switch (role) {
      case 'batter':
        return 'Batter';
      case 'bowler':
        return 'Bowler';
      case 'allrounder':
        return 'All-rounder';
      case 'wicketkeeper':
        return 'Wicket-keeper';
      default:
        return role;
    }
  };

  const availableSections = [
    { id: 'batting', name: '🏏 Batting', component: BattingSection },
    { id: 'bowling', name: '⚾ Bowling', component: BowlingSection },
    { id: 'fielding', name: '🥅 Fielding', component: FieldingSection },
    { id: 'team-builder', name: '🏆 Team Builder', component: TeamBuilderSection },
  ];

  const ActiveComponent = availableSections.find(section => section.id === activeSection)?.component;

  return (
    <div className="cricket-field min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="bg-gradient-to-r from-amber-100/40 to-green-100/40 p-6 rounded-xl border-2 border-amber-200">
            <h1 className="text-4xl font-bold text-amber-900 mb-2 tracking-wide">🏏 CricHelper</h1>
            <p className="text-amber-700 font-medium">Your cricket improvement companion</p>
          </div>
          <div className="flex items-center gap-4 bg-amber-50/60 p-4 rounded-xl border border-amber-200">
            <div className="text-center">
              <div className="text-sm text-amber-700 font-medium">Welcome,</div>
              <div className="text-lg font-bold text-amber-900">{user?.username}</div>
              <div className="text-xs text-amber-600">({formatRole(user?.role || '')})</div>
            </div>
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleAccountSettings} 
                className="border-2 border-amber-300 text-amber-900 hover:bg-amber-100"
              >
                ⚙️ Settings
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout} 
                className="border-2 border-amber-300 text-amber-900 hover:bg-amber-100"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-64">
            <Card className="bg-gradient-to-b from-green-100/80 to-amber-100/80 border-2 border-amber-300">
              <CardHeader className="bg-gradient-to-r from-amber-200/50 to-green-200/50">
                <CardTitle className="text-amber-900 flex items-center gap-2">
                  🏟️ Cricket Sections
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-6">
                {availableSections.map((section) => (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? 'default' : 'ghost'}
                    className={cn(
                      'w-full justify-start font-medium transition-all',
                      activeSection === section.id 
                        ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg transform scale-[1.02]' 
                        : 'text-amber-800 hover:bg-amber-100/60 hover:text-amber-900'
                    )}
                    onClick={() => setActiveSection(section.id)}
                  >
                    {section.name}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">
            <div className="bg-gradient-to-br from-green-50/60 to-amber-50/60 rounded-xl p-6 border-2 border-green-200/50">
              {ActiveComponent && <ActiveComponent />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
