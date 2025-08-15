import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CricketField } from './CricketField';
import { useAuth } from '../../../contexts/AuthContext';

interface FieldingAssessmentProps {
  onComplete: (data: any) => void;
}

export function FieldingAssessment({ onComplete }: FieldingAssessmentProps) {
  const { user } = useAuth();
  const [currentPositions, setCurrentPositions] = React.useState<string[]>([]);
  const [desiredPositions, setDesiredPositions] = React.useState<string[]>([]);
  const [goodSkills, setGoodSkills] = React.useState<string[]>([]);
  const [weakSkills, setWeakSkills] = React.useState<string[]>([]);

  React.useEffect(() => {
    // Auto-select wicketkeeping for wicketkeepers
    if (user?.role === 'wicketkeeper') {
      setCurrentPositions(prev => 
        prev.includes('wicketkeeper') ? prev : [...prev, 'wicketkeeper']
      );
      setDesiredPositions(prev => 
        prev.includes('wicketkeeper') ? prev : [...prev, 'wicketkeeper']
      );
    }
  }, [user?.role]);

  const fieldingPositions = [
    { id: 'wicketkeeper', label: 'Wicketkeeper' },
    { id: 'slip', label: 'Slip' },
    { id: 'point', label: 'Point' },
    { id: 'back_point', label: 'Back Point' },
    { id: 'cover', label: 'Cover' },
    { id: 'extra_cover', label: 'Extra Cover' },
    { id: 'mid_off', label: 'Mid Off' },
    { id: 'mid_on', label: 'Mid On' },
    { id: 'mid_wicket', label: 'Mid Wicket' },
    { id: 'square_leg', label: 'Square Leg' },
    { id: 'fine_leg', label: 'Fine Leg' },
    { id: 'third_man', label: 'Third Man' },
    { id: 'deep_point', label: 'Deep Point' },
    { id: 'deep_cover', label: 'Deep Cover' },
    { id: 'deep_extra_cover', label: 'Deep Extra Cover' },
    { id: 'deep_mid_off', label: 'Deep Mid Off' },
    { id: 'deep_mid_on', label: 'Deep Mid On' },
    { id: 'deep_mid_wicket', label: 'Deep Mid Wicket' },
    { id: 'deep_square_leg', label: 'Deep Square Leg' },
    { id: 'deep_fine_leg', label: 'Deep Fine Leg' },
    { id: 'long_off', label: 'Long Off' },
    { id: 'long_on', label: 'Long On' },
  ];

  const fieldingSkills = [
    { id: 'high_catches', label: 'High Catches' },
    { id: 'low_catches', label: 'Low Catches' },
    { id: 'fast_catches', label: 'Fast Catches' },
    { id: 'reflex_catches', label: 'Reflex Catches' },
    { id: 'hitting_stumps', label: 'Hitting the Stumps for Run Out' },
    { id: 'stopping_ball', label: 'Stopping the Ball Quickly' },
  ];

  const handleCheckboxChange = (
    value: string,
    checked: boolean,
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (checked) {
      setState(prev => [...prev, value]);
    } else {
      setState(prev => prev.filter(item => item !== value));
    }
  };

  const handleSubmit = () => {
    const data = {
      currentPositions,
      desiredPositions,
      goodSkills,
      weakSkills,
    };
    onComplete(data);
  };

  const isFormComplete = currentPositions.length > 0 && desiredPositions.length > 0 && 
                       goodSkills.length > 0 && weakSkills.length > 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cricket Field Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <CricketField />
          <p className="text-sm text-muted-foreground mt-4">
            Reference the field diagram above when selecting your fielding positions below.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Positions You Usually Field In</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-64 overflow-y-auto">
            {fieldingPositions.map((position) => (
              <div key={position.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`current-position-${position.id}`}
                  checked={currentPositions.includes(position.id)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange(position.id, checked as boolean, setCurrentPositions)
                  }
                />
                <Label htmlFor={`current-position-${position.id}`}>{position.label}</Label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Positions You'd Like to Field In</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-64 overflow-y-auto">
            {fieldingPositions.map((position) => (
              <div key={position.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`desired-position-${position.id}`}
                  checked={desiredPositions.includes(position.id)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange(position.id, checked as boolean, setDesiredPositions)
                  }
                />
                <Label htmlFor={`desired-position-${position.id}`}>{position.label}</Label>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">What You're Good At</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {fieldingSkills.map((skill) => (
              <div key={skill.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`good-skill-${skill.id}`}
                  checked={goodSkills.includes(skill.id)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange(skill.id, checked as boolean, setGoodSkills)
                  }
                />
                <Label htmlFor={`good-skill-${skill.id}`}>{skill.label}</Label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">What You Need to Work On</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {fieldingSkills.map((skill) => (
              <div key={skill.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`weak-skill-${skill.id}`}
                  checked={weakSkills.includes(skill.id)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange(skill.id, checked as boolean, setWeakSkills)
                  }
                />
                <Label htmlFor={`weak-skill-${skill.id}`}>{skill.label}</Label>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={handleSubmit}
          disabled={!isFormComplete}
          className="w-full md:w-auto"
        >
          Get My Fielding Analysis
        </Button>
      </div>
    </div>
  );
}
