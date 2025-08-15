import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BattingRecommendationsProps {
  data: {
    goodLines: string[];
    weakLines: string[];
    goodLengths: string[];
    weakLengths: string[];
    masterShots: string[];
    hardShots: string[];
  };
  onReset: () => void;
}

export function BattingRecommendations({ data, onReset }: BattingRecommendationsProps) {
  const formatLabel = (id: string) => {
    return id.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getShotRecommendations = () => {
    const recommendations = [];
    
    // Recommendations for weak lines and lengths
    data.weakLines.forEach(line => {
      data.weakLengths.forEach(length => {
        const combo = `${line}_${length}`;
        let suggestedShots = [];
        
        // Line and length specific shot recommendations
        if (line === 'leg_stump' && length === 'full_ball') {
          suggestedShots = ['flick', 'on_drive', 'sweep'];
        } else if (line === 'leg_stump' && length === 'good_length') {
          suggestedShots = ['flick', 'glance', 'pull_shot'];
        } else if (line === 'leg_stump' && length === 'short_ball') {
          suggestedShots = ['pull_shot', 'hook_shot'];
        } else if (line === 'off_stump' && length === 'full_ball') {
          suggestedShots = ['cover_drive', 'straight_drive'];
        } else if (line === 'off_stump' && length === 'good_length') {
          suggestedShots = ['cover_drive', 'square_drive'];
        } else if (line === 'off_stump' && length === 'short_ball') {
          suggestedShots = ['cut_shot', 'late_cut'];
        } else if (line === 'fourth_stump' && length === 'full_ball') {
          suggestedShots = ['cover_drive', 'square_drive'];
        } else if (line === 'fourth_stump' && length === 'good_length') {
          suggestedShots = ['cover_drive', 'cut_shot'];
        } else if (line === 'fourth_stump' && length === 'short_ball') {
          suggestedShots = ['cut_shot', 'late_cut'];
        } else if (line === 'fifth_stump' && length === 'full_ball') {
          suggestedShots = ['square_drive', 'cover_drive'];
        } else if (line === 'fifth_stump' && length === 'good_length') {
          suggestedShots = ['cut_shot', 'late_cut'];
        } else if (line === 'fifth_stump' && length === 'short_ball') {
          suggestedShots = ['cut_shot', 'late_cut'];
        } else if (line === 'middle_stump' && length === 'full_ball') {
          suggestedShots = ['straight_drive', 'on_drive'];
        } else if (line === 'middle_stump' && length === 'good_length') {
          suggestedShots = ['straight_drive', 'flick'];
        } else if (line === 'middle_stump' && length === 'short_ball') {
          suggestedShots = ['pull_shot', 'hook_shot'];
        } else if (length === 'yorker') {
          suggestedShots = ['straight_drive', 'flick'];
        } else if (length === 'bouncer') {
          suggestedShots = ['hook_shot', 'pull_shot'];
        }
        
        // Filter out shots that are already difficult for the user
        const practicalShots = suggestedShots.filter(shot => !data.hardShots.includes(shot));
        
        if (practicalShots.length > 0) {
          recommendations.push({
            line: formatLabel(line),
            length: formatLabel(length),
            shots: practicalShots.map(formatLabel)
          });
        }
      });
    });
    
    return recommendations;
  };

  const getPracticeAdvice = () => {
    const advice = [];
    
    // Advice for mastering difficult shots
    if (data.hardShots.length > 0) {
      advice.push({
        title: "Focus on These Shots",
        content: data.hardShots.map(formatLabel).join(', '),
        tip: "Practice these shots in the nets with specific drills. Start with a stationary ball and gradually move to moving deliveries."
      });
    }
    
    // Advice for weak lines
    if (data.weakLines.length > 0) {
      advice.push({
        title: "Line Practice",
        content: data.weakLines.map(formatLabel).join(', '),
        tip: "Ask your bowler to consistently bowl to these lines during practice. Focus on your stance and head position."
      });
    }
    
    // Advice for weak lengths
    if (data.weakLengths.length > 0) {
      advice.push({
        title: "Length Practice",
        content: data.weakLengths.map(formatLabel).join(', '),
        tip: "Practice judging these lengths early. Work on your footwork - forward for full balls, back for short balls."
      });
    }
    
    return advice;
  };

  const getStrengthAdvice = () => {
    const advice = [];
    
    // Advice for using strengths
    if (data.masterShots.length > 0) {
      advice.push({
        title: "Your Scoring Shots",
        content: data.masterShots.map(formatLabel).join(', '),
        tip: "Use these shots to score runs confidently. Look for opportunities to play these shots during matches."
      });
    }
    
    // Advice for strong lines and lengths
    const strongCombos = [];
    data.goodLines.forEach(line => {
      data.goodLengths.forEach(length => {
        strongCombos.push(`${formatLabel(line)} + ${formatLabel(length)}`);
      });
    });
    
    if (strongCombos.length > 0) {
      advice.push({
        title: "Your Strong Areas",
        content: strongCombos.slice(0, 5).join(', '),
        tip: "Be patient and wait for balls in these areas. Score freely when the ball is in your strong zones."
      });
    }
    
    return advice;
  };

  const shotRecommendations = getShotRecommendations();
  const practiceAdvice = getPracticeAdvice();
  const strengthAdvice = getStrengthAdvice();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Batting Analysis</h2>
        <Button variant="outline" onClick={onReset}>
          Retake Assessment
        </Button>
      </div>

      {shotRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📋 Shot Recommendations for Weak Areas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {shotRecommendations.map((rec, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">
                  {rec.line} line, {rec.length} length
                </h4>
                <p className="text-sm text-muted-foreground">
                  Practice these shots: <span className="font-medium">{rec.shots.join(', ')}</span>
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">💪 Your Strengths</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {strengthAdvice.map((advice, index) => (
              <div key={index} className="space-y-2">
                <h4 className="font-medium">{advice.title}</h4>
                <p className="text-sm text-muted-foreground">{advice.content}</p>
                <p className="text-sm text-blue-600">{advice.tip}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🎯 Areas to Improve</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {practiceAdvice.map((advice, index) => (
              <div key={index} className="space-y-2">
                <h4 className="font-medium">{advice.title}</h4>
                <p className="text-sm text-muted-foreground">{advice.content}</p>
                <p className="text-sm text-orange-600">{advice.tip}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🏏 General Batting Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-medium">Practice Routine</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Spend 70% of practice time on weak areas and 30% on maintaining strengths</li>
              <li>Practice shot selection - know when to attack and when to defend</li>
              <li>Work on footwork drills daily</li>
              <li>Practice with different bowling speeds and styles</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Match Strategy</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Be patient for balls in your strong areas</li>
              <li>Leave balls in your weak areas unless you must score</li>
              <li>Use your mastered shots to build confidence</li>
              <li>Focus on playing the ball late and with soft hands</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
