import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface BattingAssessmentProps {
  onComplete: (data: any) => void;
}

export function BattingAssessment({ onComplete }: BattingAssessmentProps) {
  const [goodLines, setGoodLines] = React.useState<string[]>([]);
  const [weakLines, setWeakLines] = React.useState<string[]>([]);
  const [goodLengths, setGoodLengths] = React.useState<string[]>([]);
  const [weakLengths, setWeakLengths] = React.useState<string[]>([]);
  const [masterShots, setMasterShots] = React.useState<string[]>([]);
  const [hardShots, setHardShots] = React.useState<string[]>([]);

  const lines = [
    { id: 'leg_stump', label: 'Leg Stump' },
    { id: 'middle_stump', label: 'Middle Stump' },
    { id: 'off_stump', label: 'Off Stump' },
    { id: 'fourth_stump', label: '4th Stump' },
    { id: 'fifth_stump', label: '5th Stump' },
  ];

  const lengths = [
    { id: 'full_ball', label: 'Full Ball' },
    { id: 'good_length', label: 'Good Length' },
    { id: 'short_ball', label: 'Short Ball' },
    { id: 'yorker', label: 'Yorker' },
    { id: 'bouncer', label: 'Bouncer' },
  ];

  const shots = [
    { id: 'straight_drive', label: 'Straight Drive' },
    { id: 'cover_drive', label: 'Cover Drive' },
    { id: 'on_drive', label: 'On Drive' },
    { id: 'square_drive', label: 'Square Drive' },
    { id: 'sweep', label: 'Sweep' },
    { id: 'reverse_sweep', label: 'Reverse Sweep' },
    { id: 'pull_shot', label: 'Pull Shot' },
    { id: 'hook_shot', label: 'Hook Shot' },
    { id: 'cut_shot', label: 'Cut Shot' },
    { id: 'late_cut', label: 'Late Cut' },
    { id: 'flick', label: 'Flick' },
    { id: 'glance', label: 'Glance' },
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
      goodLines,
      weakLines,
      goodLengths,
      weakLengths,
      masterShots,
      hardShots,
    };
    onComplete(data);
  };

  const isFormComplete = goodLines.length > 0 && weakLines.length > 0 && 
                       goodLengths.length > 0 && weakLengths.length > 0 && 
                       masterShots.length > 0 && hardShots.length > 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lines You Play Well</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lines.map((line) => (
              <div key={line.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`good-line-${line.id}`}
                  checked={goodLines.includes(line.id)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange(line.id, checked as boolean, setGoodLines)
                  }
                />
                <Label htmlFor={`good-line-${line.id}`}>{line.label}</Label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lines You Need to Practice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lines.map((line) => (
              <div key={line.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`weak-line-${line.id}`}
                  checked={weakLines.includes(line.id)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange(line.id, checked as boolean, setWeakLines)
                  }
                />
                <Label htmlFor={`weak-line-${line.id}`}>{line.label}</Label>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lengths You Play Well</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lengths.map((length) => (
              <div key={length.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`good-length-${length.id}`}
                  checked={goodLengths.includes(length.id)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange(length.id, checked as boolean, setGoodLengths)
                  }
                />
                <Label htmlFor={`good-length-${length.id}`}>{length.label}</Label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lengths You Need to Practice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lengths.map((length) => (
              <div key={length.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`weak-length-${length.id}`}
                  checked={weakLengths.includes(length.id)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange(length.id, checked as boolean, setWeakLengths)
                  }
                />
                <Label htmlFor={`weak-length-${length.id}`}>{length.label}</Label>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Shots You've Mastered</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {shots.map((shot) => (
              <div key={shot.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`master-shot-${shot.id}`}
                  checked={masterShots.includes(shot.id)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange(shot.id, checked as boolean, setMasterShots)
                  }
                />
                <Label htmlFor={`master-shot-${shot.id}`}>{shot.label}</Label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Shots You Find Difficult</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {shots.map((shot) => (
              <div key={shot.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`hard-shot-${shot.id}`}
                  checked={hardShots.includes(shot.id)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange(shot.id, checked as boolean, setHardShots)
                  }
                />
                <Label htmlFor={`hard-shot-${shot.id}`}>{shot.label}</Label>
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
          Get My Batting Analysis
        </Button>
      </div>
    </div>
  );
}
