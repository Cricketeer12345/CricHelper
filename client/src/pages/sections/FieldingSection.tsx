import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldingAssessment } from './fielding/FieldingAssessment';
import { FieldingRecommendations } from './fielding/FieldingRecommendations';
import { useAuth } from '../../contexts/AuthContext';

export function FieldingSection() {
  const { user } = useAuth();
  const [hasAssessment, setHasAssessment] = React.useState(false);
  const [assessmentData, setAssessmentData] = React.useState(null);

  React.useEffect(() => {
    const loadAssessment = async () => {
      if (!user?.id) return;
      
      try {
        const response = await fetch(`/api/assessments/fielding/${user.id}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          setAssessmentData(result.data);
          setHasAssessment(true);
        }
      } catch (error) {
        console.error('Error loading fielding assessment:', error);
      }
    };
    
    loadAssessment();
  }, [user?.id]);

  const handleAssessmentComplete = async (data: any) => {
    if (!user?.id) return;
    
    try {
      const response = await fetch('/api/assessments/fielding', {
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
      console.error('Error saving fielding assessment:', error);
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
          <CardTitle>🥅 Fielding Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Analyze your fielding positions and skills to get personalized recommendations for improvement.
          </p>
          
          {!hasAssessment ? (
            <FieldingAssessment onComplete={handleAssessmentComplete} />
          ) : (
            <FieldingRecommendations 
              data={assessmentData} 
              onReset={handleResetAssessment} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
