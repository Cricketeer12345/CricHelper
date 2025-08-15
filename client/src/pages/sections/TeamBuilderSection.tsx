import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamBuilderManager } from './team-builder/TeamBuilderManager';

export function TeamBuilderSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🏆 Team Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Add players with their ratings and notes, then let AI create balanced teams for fair matches.
          </p>
          
          <TeamBuilderManager />
        </CardContent>
      </Card>
    </div>
  );
}
