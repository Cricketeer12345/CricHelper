import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BowlingAssessment } from './bowling/BowlingAssessment';
import { BowlingRecommendations } from './bowling/BowlingRecommendations';
import { useAuth } from '../../contexts/AuthContext';

export function BowlingSection() {
  const { user } = useAuth();
  const [hasAssessment, setHasAssessment] = React.useState(false);
  const [assessmentData, setAssessmentData] = React.useState(null);

  React.useEffect(() => {
    const loadAssessment = async () => {
      if (!user?.id) return;
      
      try {
        const response = await fetch(`/api/assessments/bowling/${user.id}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          setAssessmentData(result.data);
          setHasAssessment(true);
        }
      } catch (error) {
        console.error('Error loading bowling assessment:', error);
      }
    };
    
    loadAssessment();
  }, [user?.id]);

  const handleAssessmentComplete = async (data: any) => {
    if (!user?.id) return;
    
    try {
      const response = await fetch('/api/assessments/bowling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          ...data,
        }),
      });
      
      if (response.ok) {
        setAssessmentData(data);
        setHasAssessment(true);
      }
    } catch (error) {
      console.error('Error saving bowling assessment:', error);
    }
  };

  const handleResetAssessment = () => {
    setHasAssessment(false);
    setAssessmentData(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>⚾ Bowling Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Analyze your bowling strengths and weaknesses to get personalized recommendations for improvement.
          </p>
          
          {!hasAssessment ? (
            <BowlingAssessment onComplete={handleAssessmentComplete} />
          ) : (
            <BowlingRecommendations 
              data={assessmentData} 
              onReset={handleResetAssessment} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
