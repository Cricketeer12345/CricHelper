import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAuth } from '../../../contexts/AuthContext';

interface BowlingAssessmentProps {
  onComplete: (data: any) => void;
}

export function BowlingAssessment({ onComplete }: BowlingAssessmentProps) {
  const { user } = useAuth();
  const [goodLines, setGoodLines] = React.useState<string[]>([]);
  const [weakLines, setWeakLines] = React.useState<string[]>([]);
  const [goodLengths, setGoodLengths] = React.useState<string[]>([]);
  const [weakLengths, setWeakLengths] = React.useState<string[]>([]);
  const [masterVariations, setMasterVariations] = React.useState<string[]>([]);
  const [hardVariations, setHardVariations] = React.useState<string[]>([]);
  const [improvementAreas, setImprovementAreas] = React.useState<string[]>([]);

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

  const getVariationsForBowlingType = () => {
    const bowlingType = user?.bowling_type;
    
    if (bowlingType === 'fast' || bowlingType === 'medium-fast') {
      return [
        { id: 'straight_ball', label: 'Straight Ball' },
        { id: 'slow_ball', label: 'Slow Ball' },
        { id: 'off_cutter', label: 'Off Cutter' },
        { id: 'leg_cutter', label: 'Leg Cutter' },
        { id: 'in_swinger', label: 'In Swinger' },
        { id: 'out_swinger', label: 'Out Swinger' },
        { id: 'reverse_swinger', label: 'Reverse Swinger' },
      ];
    } else if (bowlingType === 'off-break') {
      return [
        { id: 'off_spin', label: 'Off-spin' },
        { id: 'doosra', label: 'Doosra' },
        { id: 'arm_ball', label: 'Arm Ball' },
        { id: 'carrom_ball', label: 'Carrom Ball' },
      ];
    } else if (bowlingType === 'leg-break') {
      return [
        { id: 'leg_spin', label: 'Leg-spin' },
        { id: 'googly', label: 'Googly' },
        { id: 'flipper', label: 'Flipper' },
        { id: 'top_spin', label: 'Top-spin' },
      ];
    }
    
    // Default for users without bowling type
    return [
      { id: 'straight_ball', label: 'Straight Ball' },
      { id: 'slow_ball', label: 'Slow Ball' },
      { id: 'off_cutter', label: 'Off Cutter' },
      { id: 'leg_cutter', label: 'Leg Cutter' },
    ];
  };

  const getImprovementOptionsForBowlingType = () => {
    const bowlingType = user?.bowling_type;
    
    if (bowlingType === 'fast' || bowlingType === 'medium-fast') {
      return [
        { id: 'more_pace', label: 'More Pace' },
        { id: 'more_swing', label: 'More Swing' },
        { id: 'more_turn', label: 'More Turn (Cutters)' },
        { id: 'straighter_seam', label: 'Straighter Seam' },
      ];
    } else if (bowlingType === 'off-break' || bowlingType === 'leg-break') {
      return [
        { id: 'bowl_faster', label: 'Bowl Faster' },
        { id: 'have_more_spin', label: 'Have More Spin' },
      ];
    }
    
    // Default for users without bowling type
    return [
      { id: 'more_pace', label: 'More Pace' },
      { id: 'more_swing', label: 'More Swing' },
      { id: 'more_turn', label: 'More Turn (Cutters)' },
      { id: 'straighter_seam', label: 'Straighter Seam' },
    ];
  };

  const variations = getVariationsForBowlingType();
  const improvementOptions = getImprovementOptionsForBowlingType();

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
      masterVariations,
      hardVariations,
      improvementAreas,
      bowlingType: user?.bowling_type,
    };
    onComplete(data);
  };

  const isFormComplete = goodLines.length > 0 && weakLines.length > 0 && 
                       goodLengths.length > 0 && weakLengths.length > 0 && 
                       masterVariations.length > 0 && hardVariations.length > 0 &&
                       improvementAreas.length > 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lines You Bowl Well</CardTitle>
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
            <CardTitle className="text-lg">Lines You Need to Learn</CardTitle>
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
            <CardTitle className="text-lg">Lengths You Bowl Well</CardTitle>
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
            <CardTitle className="text-lg">Lengths You Need to Learn</CardTitle>
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
            <CardTitle className="text-lg">Variations You've Mastered</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {variations.map((variation) => (
              <div key={variation.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`master-variation-${variation.id}`}
                  checked={masterVariations.includes(variation.id)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange(variation.id, checked as boolean, setMasterVariations)
                  }
                />
                <Label htmlFor={`master-variation-${variation.id}`}>{variation.label}</Label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Variations You Need to Learn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {variations.map((variation) => (
              <div key={variation.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`hard-variation-${variation.id}`}
                  checked={hardVariations.includes(variation.id)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange(variation.id, checked as boolean, setHardVariations)
                  }
                />
                <Label htmlFor={`hard-variation-${variation.id}`}>{variation.label}</Label>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What Do You Need to Improve?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {improvementOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={`improvement-${option.id}`}
                checked={improvementAreas.includes(option.id)}
                onCheckedChange={(checked) => 
                  handleCheckboxChange(option.id, checked as boolean, setImprovementAreas)
                }
              />
              <Label htmlFor={`improvement-${option.id}`}>{option.label}</Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button 
          onClick={handleSubmit}
          disabled={!isFormComplete}
          className="w-full md:w-auto"
        >
          Get My Bowling Analysis
        </Button>
      </div>
    </div>
  );
}
