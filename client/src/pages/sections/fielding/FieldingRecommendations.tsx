import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FieldingRecommendationsProps {
  data: {
    currentPositions: string[];
    desiredPositions: string[];
    goodSkills: string[];
    weakSkills: string[];
  };
  onReset: () => void;
}

export function FieldingRecommendations({ data, onReset }: FieldingRecommendationsProps) {
  const formatLabel = (id: string) => {
    return id.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getPositionRequirements = (position: string) => {
    const requirements = {
      wicketkeeper: ['reflex_catches', 'low_catches', 'fast_catches', 'stopping_ball'],
      slip: ['reflex_catches', 'low_catches', 'fast_catches'],
      point: ['fast_catches', 'stopping_ball', 'hitting_stumps'],
      back_point: ['fast_catches', 'stopping_ball', 'hitting_stumps'],
      cover: ['stopping_ball', 'hitting_stumps', 'fast_catches'],
      extra_cover: ['stopping_ball', 'hitting_stumps', 'fast_catches'],
      mid_off: ['stopping_ball', 'hitting_stumps', 'low_catches'],
      mid_on: ['stopping_ball', 'hitting_stumps', 'low_catches'],
      mid_wicket: ['stopping_ball', 'hitting_stumps', 'reflex_catches'],
      square_leg: ['stopping_ball', 'hitting_stumps', 'fast_catches'],
      fine_leg: ['stopping_ball', 'hitting_stumps', 'fast_catches'],
      third_man: ['stopping_ball', 'hitting_stumps', 'fast_catches'],
      deep_point: ['high_catches', 'stopping_ball', 'hitting_stumps'],
      deep_cover: ['high_catches', 'stopping_ball', 'hitting_stumps'],
      deep_extra_cover: ['high_catches', 'stopping_ball', 'hitting_stumps'],
      deep_mid_off: ['high_catches', 'stopping_ball', 'hitting_stumps'],
      deep_mid_on: ['high_catches', 'stopping_ball', 'hitting_stumps'],
      deep_mid_wicket: ['high_catches', 'stopping_ball', 'hitting_stumps'],
      deep_square_leg: ['high_catches', 'stopping_ball', 'hitting_stumps'],
      deep_fine_leg: ['high_catches', 'stopping_ball', 'hitting_stumps'],
      long_off: ['high_catches', 'stopping_ball'],
      long_on: ['high_catches', 'stopping_ball'],
    };
    
    return requirements[position] || [];
  };

  const getCurrentPositionAdvice = () => {
    const advice = [];
    
    data.currentPositions.forEach(position => {
      const requirements = getPositionRequirements(position);
      const weaknesses = requirements.filter(skill => data.weakSkills.includes(skill));
      
      if (weaknesses.length > 0) {
        let tips = '';
        
        if (position === 'wicketkeeper') {
          tips = 'Practice keeping to different bowlers - pace and spin. Work on glove work, staying low, and collecting balls cleanly. Practice stumping drills and standing up to the stumps.';
        } else if (position === 'slip') {
          tips = 'Practice catching with a cricket ball thrown from close range. Work on hand-eye coordination and reaction time. Keep your hands soft and watch the ball all the way.';
        } else if (position.includes('deep') || position.includes('long')) {
          tips = 'Practice judging high catches by having someone throw balls high. Work on positioning under the ball and secure catching technique. Practice running backwards while keeping eyes on the ball.';
        } else if (['point', 'cover', 'extra_cover'].includes(position)) {
          tips = 'Focus on quick pick-up and release. Practice stopping the ball cleanly and throwing in one motion. Work on accuracy to hit the stumps.';
        } else if (['mid_off', 'mid_on', 'mid_wicket'].includes(position)) {
          tips = 'Practice stopping drives and quick singles. Work on anticipation and getting your body behind the ball. Focus on accurate throws to the wicket-keeper.';
        }
        
        advice.push({
          position: formatLabel(position),
          weaknesses: weaknesses.map(formatLabel),
          tips
        });
      }
    });
    
    return advice;
  };

  const getDesiredPositionAdvice = () => {
    const advice = [];
    
    data.desiredPositions.forEach(position => {
      const requirements = getPositionRequirements(position);
      const strengths = requirements.filter(skill => data.goodSkills.includes(skill));
      const needsWork = requirements.filter(skill => data.weakSkills.includes(skill));
      
      let suitability = 'Good fit';
      let tips = '';
      
      if (needsWork.length > strengths.length) {
        suitability = 'Needs practice';
        tips = `Focus on improving: ${needsWork.map(formatLabel).join(', ')}. `;
      } else if (strengths.length >= requirements.length - 1) {
        suitability = 'Excellent fit';
        tips = 'You have most skills needed for this position. ';
      }
      
      if (position === 'wicketkeeper') {
        tips += 'Work on different stances for pace and spin bowling. Practice taking balls down the leg side and wide of off stump.';
      } else if (position === 'slip') {
        tips += 'Practice with slip catching cradle. Work on staying low and keeping hands soft.';
      } else if (position.includes('deep') || position.includes('long')) {
        tips += 'Work on judging the flight of the ball and positioning. Practice calling for catches clearly.';
      } else if (['point', 'cover', 'extra_cover'].includes(position)) {
        tips += 'Focus on attacking the ball and quick release. Practice one-handed pick up and throw.';
      }
      
      advice.push({
        position: formatLabel(position),
        suitability,
        requirements: requirements.map(formatLabel),
        tips
      });
    });
    
    return advice;
  };

  const getRecommendedPositions = () => {
    const recommendations = [];
    const positionScores = {};
    
    // Score each position based on user's strengths
    const allPositions = [
      'wicketkeeper', 'slip', 'point', 'back_point', 'cover', 'extra_cover', 'mid_off', 'mid_on',
      'mid_wicket', 'square_leg', 'fine_leg', 'third_man', 'deep_point', 'deep_cover',
      'deep_extra_cover', 'deep_mid_off', 'deep_mid_on', 'deep_mid_wicket',
      'deep_square_leg', 'deep_fine_leg', 'long_off', 'long_on'
    ];
    
    allPositions.forEach(position => {
      const requirements = getPositionRequirements(position);
      const matchingSkills = requirements.filter(skill => data.goodSkills.includes(skill));
      positionScores[position] = matchingSkills.length / requirements.length;
    });
    
    // Get top 5 recommended positions
    const sortedPositions = Object.entries(positionScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
    
    sortedPositions.forEach(([position, score]) => {
      if (score >= 0.5) { // At least 50% skill match
        const requirements = getPositionRequirements(position);
        recommendations.push({
          position: formatLabel(position),
          match: Math.round(score * 100),
          skills: requirements.map(formatLabel)
        });
      }
    });
    
    return recommendations;
  };

  const getSkillImprovementTips = () => {
    const tips = [];
    
    data.weakSkills.forEach(skill => {
      let tip = '';
      let practice = '';
      
      switch (skill) {
        case 'high_catches':
          tip = 'Position yourself under the ball early, keep your eye on the ball throughout its flight.';
          practice = 'Practice with high catches using tennis balls, then progress to cricket balls. Work on judging distance and positioning.';
          break;
        case 'low_catches':
          tip = 'Get your hands down early, create a good base with your body behind the ball.';
          practice = 'Practice catching balls rolled or bounced along the ground. Focus on soft hands and secure grip.';
          break;
        case 'fast_catches':
          tip = 'Keep your hands relaxed and ready, react quickly but stay balanced.';
          practice = 'Practice with slip catching cradle or have someone hit catches at varying speeds and angles.';
          break;
        case 'reflex_catches':
          tip = 'Stay alert and ready, keep your hands in catching position at all times.';
          practice = 'Practice close catching with multiple balls thrown rapidly. Work on hand-eye coordination drills.';
          break;
        case 'hitting_stumps':
          tip = 'Aim for the base of the stumps, use your whole body for power and accuracy.';
          practice = 'Set up stumps and practice hitting them from various distances and angles. Work on quick release.';
          break;
        case 'stopping_ball':
          tip = 'Get your body behind the ball, use proper technique to stop cleanly.';
          practice = 'Practice fielding ground balls, focus on getting down quickly and creating a barrier with your body.';
          break;
      }
      
      tips.push({
        skill: formatLabel(skill),
        tip,
        practice
      });
    });
    
    return tips;
  };

  const currentPositionAdvice = getCurrentPositionAdvice();
  const desiredPositionAdvice = getDesiredPositionAdvice();
  const recommendedPositions = getRecommendedPositions();
  const skillImprovementTips = getSkillImprovementTips();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Fielding Analysis</h2>
        <Button variant="outline" onClick={onReset}>
          Retake Assessment
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">💪 Your Strengths</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Current Positions</h4>
              <p className="text-sm text-muted-foreground">
                {data.currentPositions.map(formatLabel).join(', ')}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Strong Skills</h4>
              <p className="text-sm text-muted-foreground">
                {data.goodSkills.map(formatLabel).join(', ')}
              </p>
              <p className="text-sm text-blue-600">
                Use these strengths to excel in positions that require these skills.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🎯 Areas to Improve</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Desired Positions</h4>
              <p className="text-sm text-muted-foreground">
                {data.desiredPositions.map(formatLabel).join(', ')}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Skills to Work On</h4>
              <p className="text-sm text-muted-foreground">
                {data.weakSkills.map(formatLabel).join(', ')}
              </p>
              <p className="text-sm text-orange-600">
                Focus on these skills to improve your overall fielding and access new positions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {currentPositionAdvice.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📋 Improve Your Current Positions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentPositionAdvice.map((advice, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <h4 className="font-medium text-primary">{advice.position}</h4>
                <p className="text-sm"><strong>Work on:</strong> {advice.weaknesses.join(', ')}</p>
                <p className="text-sm text-muted-foreground">{advice.tips}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {desiredPositionAdvice.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🎯 Your Desired Positions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {desiredPositionAdvice.map((advice, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-primary">{advice.position}</h4>
                  <span className={`text-xs px-2 py-1 rounded ${
                    advice.suitability === 'Excellent fit' ? 'bg-green-100 text-green-800' :
                    advice.suitability === 'Good fit' ? 'bg-blue-100 text-blue-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {advice.suitability}
                  </span>
                </div>
                <p className="text-sm"><strong>Required skills:</strong> {advice.requirements.join(', ')}</p>
                <p className="text-sm text-muted-foreground">{advice.tips}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {recommendedPositions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">⭐ Recommended Positions Based on Your Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendedPositions.map((rec, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-primary">{rec.position}</h4>
                  <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
                    {rec.match}% match
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>Key skills:</strong> {rec.skills.join(', ')}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {skillImprovementTips.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">💡 Skill Improvement Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {skillImprovementTips.map((tip, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <h4 className="font-medium text-primary">{tip.skill}</h4>
                <p className="text-sm"><strong>Technique:</strong> {tip.tip}</p>
                <p className="text-sm text-muted-foreground"><strong>Practice:</strong> {tip.practice}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🥅 General Fielding Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-medium">Practice Routine</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Practice fielding drills daily - catching, stopping, and throwing</li>
              <li>Work on fitness and agility to improve reaction time</li>
              <li>Practice specific skills for your preferred positions</li>
              <li>Work on communication and calling for catches</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Match Strategy</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Stay alert and anticipate where the ball might come</li>
              <li>Communicate with teammates about field placements</li>
              <li>Back up other fielders to prevent overthrows</li>
              <li>Stay positive and encourage teammates after mistakes</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
