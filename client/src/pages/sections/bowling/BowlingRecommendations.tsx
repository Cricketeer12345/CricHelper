import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BowlingRecommendationsProps {
  data: {
    goodLines: string[];
    weakLines: string[];
    goodLengths: string[];
    weakLengths: string[];
    masterVariations: string[];
    hardVariations: string[];
    improvementAreas: string[];
    bowlingType: string;
  };
  onReset: () => void;
}

export function BowlingRecommendations({ data, onReset }: BowlingRecommendationsProps) {
  const formatLabel = (id: string) => {
    return id.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getImprovementAdvice = () => {
    const advice = [];
    const bowlingType = data.bowlingType;
    
    data.improvementAreas.forEach(area => {
      let technique = '';
      let practice = '';
      
      if (bowlingType === 'fast' || bowlingType === 'medium-fast') {
        switch (area) {
          case 'more_pace':
            technique = 'Focus on explosive action with strong core rotation. Use your entire body, not just your arm.';
            practice = 'Practice with lighter cricket balls, work on fitness drills like plyometrics, and strengthen your bowling shoulder and core.';
            break;
          case 'more_swing':
            technique = 'Keep seam upright, release with wrist behind ball. Use the shine side effectively.';
            practice = 'Practice with new balls daily. Work on consistent seam position and release point. Experiment with grip pressure.';
            break;
          case 'more_turn':
            technique = 'For cutters, roll fingers across the seam at release. Vary the degree of cut.';
            practice = 'Practice cutting the ball on different surfaces. Start slow and gradually increase pace while maintaining cut.';
            break;
          case 'straighter_seam':
            technique = 'Focus on keeping seam vertical throughout delivery. Use fingertips to maintain seam position.';
            practice = 'Practice releasing ball with consistent wrist position. Use target practice to check seam presentation.';
            break;
        }
      } else if (bowlingType === 'off-break' || bowlingType === 'leg-break') {
        switch (area) {
          case 'bowl_faster':
            technique = 'Maintain spin while increasing arm speed. Focus on quicker release without losing revolutions.';
            practice = 'Practice with metronome for rhythm. Gradually increase pace while maintaining spin and accuracy.';
            break;
          case 'have_more_spin':
            technique = 'Use more finger and wrist action. Get maximum revolutions on the ball at release.';
            practice = 'Practice spinning ball from hand to hand. Work on finger strength and wrist flexibility exercises.';
            break;
        }
      }
      
      if (technique && practice) {
        advice.push({
          improvement: formatLabel(area),
          technique,
          practice
        });
      }
    });
    
    return advice;
  };

  const getVariationTechniques = () => {
    const techniques = [];
    
    data.hardVariations.forEach(variation => {
      let technique = '';
      let practice = '';
      
      switch (variation) {
        case 'slow_ball':
          technique = 'Reduce pace by 15-20 kmph while maintaining same action. Hold ball deeper in palm.';
          practice = 'Practice with tennis ball first. Focus on consistent release point and follow-through.';
          break;
        case 'off_cutter':
          technique = 'Use first two fingers to cut across the ball from left to right (for right-handers).';
          practice = 'Practice against a wall, focusing on wrist position at release. Use stumps as target.';
          break;
        case 'leg_cutter':
          technique = 'Use first two fingers to cut across the ball from right to left (for right-handers).';
          practice = 'Start with slower pace, focus on consistent seam position and wrist snap.';
          break;
        case 'in_swinger':
          technique = 'Angle seam towards leg slip, release with wrist behind the ball.';
          practice = 'Bowl to a right-handed batsman, aim for leg stump line. Focus on seam position.';
          break;
        case 'out_swinger':
          technique = 'Angle seam towards slip, release with wrist slightly behind and to the side.';
          practice = 'Practice with new ball. Bowl wide of off stump to start, gradually bring closer.';
          break;
        case 'reverse_swinger':
          technique = 'Keep one side rough, one side shiny. Bowl with conventional swing action.';
          practice = 'Practice with old ball. Focus on maintaining seam position and pace.';
          break;
        case 'doosra':
          technique = 'Flick fingers in opposite direction to off-spin, use back of hand.';
          practice = 'Start with slow pace. Practice wrist position extensively before adding pace.';
          break;
        case 'arm_ball':
          technique = 'Deliver with same action as off-spin but with seam upright.';
          practice = 'Focus on consistent seam position. Practice targeting stumps directly.';
          break;
        case 'carrom_ball':
          technique = 'Flick ball with middle finger like carrom striker.';
          practice = 'Start close to stumps. Practice finger position and follow-through daily.';
          break;
        case 'googly':
          technique = 'Turn wrist over and spin with back of hand towards batsman.';
          practice = 'Practice wrist position slowly. Start with underarm practice, then overarm.';
          break;
        case 'flipper':
          technique = 'Squeeze ball out from front of hand with thumb and forefinger.';
          practice = 'Practice on concrete first for bounce. Focus on consistent release.';
          break;
        case 'top_spin':
          technique = 'Impart forward rotation, making ball dip and bounce higher.';
          practice = 'Practice with exaggerated follow-through. Focus on ball trajectory.';
          break;
        default:
          technique = 'Work with coach on proper grip and release technique.';
          practice = 'Regular practice with focus on consistency and accuracy.';
      }
      
      techniques.push({
        variation: formatLabel(variation),
        technique,
        practice
      });
    });
    
    return techniques;
  };

  const getBatsmanStrategies = () => {
    const strategies = [];
    const bowlingType = data.bowlingType;
    
    if (bowlingType === 'fast' || bowlingType === 'medium-fast') {
      strategies.push(
        {
          batsman: 'Right-handed batsman weak against pace',
          strategy: 'Bowl 4th stump line, good length with out-swinger',
          reason: 'Forces batsman to play at deliveries outside off stump, increasing chance of edges'
        },
        {
          batsman: 'Left-handed batsman',
          strategy: 'Bowl leg stump line, yorker length with in-swinger',
          reason: 'Targets stumps and makes it difficult for left-hander to get under the ball'
        },
        {
          batsman: 'Aggressive batsman',
          strategy: 'Bowl off stump line, short ball with leg cutter',
          reason: 'Variation in pace and bounce disrupts timing and forces mistimed shots'
        }
      );
    } else if (bowlingType === 'off-break') {
      strategies.push(
        {
          batsman: 'Right-handed batsman weak against spin',
          strategy: 'Bowl 4th stump line, good length with off-spin',
          reason: 'Natural turn into the batsman creates LBW opportunities and forces inside edges'
        },
        {
          batsman: 'Left-handed batsman',
          strategy: 'Bowl off stump line, full length with arm ball',
          reason: 'Straight delivery surprises left-hander expecting turn, targets stumps directly'
        },
        {
          batsman: 'Attacking batsman',
          strategy: 'Bowl leg stump line, good length with doosra',
          reason: 'Surprise variation turns away from batsman, creates false shots and edges'
        }
      );
    } else if (bowlingType === 'leg-break') {
      strategies.push(
        {
          batsman: 'Right-handed batsman weak against leg-spin',
          strategy: 'Bowl 4th stump line, good length with leg-spin',
          reason: 'Turn away from batsman creates edges and beat the bat regularly'
        },
        {
          batsman: 'Left-handed batsman',
          strategy: 'Bowl off stump line, good length with googly',
          reason: 'Surprise turn into left-hander creates LBW and bowled opportunities'
        },
        {
          batsman: 'Defensive batsman',
          strategy: 'Bowl middle stump line, full length with top-spin',
          reason: 'Extra bounce and dip forces batsman to play shots, creates catching opportunities'
        }
      );
    } else {
      strategies.push(
        {
          batsman: 'Right-handed batsman',
          strategy: 'Bowl 4th stump line, good length consistently',
          reason: 'Forces batsman to make decisions and creates opportunities for edges'
        },
        {
          batsman: 'Left-handed batsman',
          strategy: 'Bowl leg stump line, yorker length',
          reason: 'Targets stumps and limits scoring opportunities'
        },
        {
          batsman: 'Aggressive batsman',
          strategy: 'Bowl off stump line, short length with variations',
          reason: 'Change of pace and length disrupts timing and rhythm'
        }
      );
    }
    
    return strategies;
  };

  const improvementAdvice = getImprovementAdvice();
  const variationTechniques = getVariationTechniques();
  const batsmanStrategies = getBatsmanStrategies();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Bowling Analysis</h2>
        <Button variant="outline" onClick={onReset}>
          Retake Assessment
        </Button>
      </div>

      {improvementAdvice.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🎯 Priority Improvements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {improvementAdvice.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <h4 className="font-medium text-primary">{item.improvement}</h4>
                <p className="text-sm"><strong>Technique:</strong> {item.technique}</p>
                <p className="text-sm text-muted-foreground"><strong>Practice:</strong> {item.practice}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {variationTechniques.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🎯 Master These Variations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {variationTechniques.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <h4 className="font-medium text-primary">{item.variation}</h4>
                <p className="text-sm"><strong>Technique:</strong> {item.technique}</p>
                <p className="text-sm text-muted-foreground"><strong>Practice:</strong> {item.practice}</p>
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
            <div className="space-y-2">
              <h4 className="font-medium">Strong Lines</h4>
              <p className="text-sm text-muted-foreground">
                {data.goodLines.map(formatLabel).join(', ')}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Strong Lengths</h4>
              <p className="text-sm text-muted-foreground">
                {data.goodLengths.map(formatLabel).join(', ')}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Mastered Variations</h4>
              <p className="text-sm text-muted-foreground">
                {data.masterVariations.map(formatLabel).join(', ')}
              </p>
              <p className="text-sm text-blue-600">
                Use these variations strategically to surprise batsmen and take wickets.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🎯 Areas to Practice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Lines to Practice</h4>
              <p className="text-sm text-muted-foreground">
                {data.weakLines.map(formatLabel).join(', ')}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Lengths to Practice</h4>
              <p className="text-sm text-muted-foreground">
                {data.weakLengths.map(formatLabel).join(', ')}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Variations to Learn</h4>
              <p className="text-sm text-muted-foreground">
                {data.hardVariations.map(formatLabel).join(', ')}
              </p>
              <p className="text-sm text-orange-600">
                Focus on one variation at a time. Master the basics before adding pace.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🎯 Strategies Against Different Batsmen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {batsmanStrategies.map((strategy, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-2">
              <h4 className="font-medium text-primary">{strategy.batsman}</h4>
              <p className="text-sm"><strong>Bowl:</strong> {strategy.strategy}</p>
              <p className="text-sm text-muted-foreground"><strong>Why:</strong> {strategy.reason}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">⚾ General Bowling Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-medium">Practice Routine</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Spend 60% of practice time on weak areas and 40% on maintaining strengths</li>
              <li>Practice line and length with target practice daily</li>
              <li>Work on one new variation at a time</li>
              <li>Record yourself bowling to analyze action and release point</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Match Strategy</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Bowl to your strengths when under pressure</li>
              <li>Set up batsmen with consistent line and length before trying variations</li>
              <li>Study batsmen's weaknesses and bowl accordingly</li>
              <li>Maintain consistent pace and rhythm throughout your spell</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
