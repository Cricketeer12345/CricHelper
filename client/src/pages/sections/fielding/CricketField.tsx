import React from 'react';

export function CricketField() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="border rounded-lg overflow-hidden">
        <img
          src="/assets/cricket-field-positions.jpg"
          alt="Cricket field positions diagram showing all fielding positions including slip, point, cover, mid-off, mid-on, square leg, fine leg, and deep positions"
          className="w-full h-auto"
        />
      </div>
      
      <div className="mt-4 text-sm text-muted-foreground">
        <p className="font-medium">Cricket Field Positions Diagram</p>
        <p>Image courtesy of <a href="https://www.zapcricket.com/blogs/newsroom/cricket-fielding-positions" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ZAP Cricket</a></p>
        <p>This diagram shows the standard fielding positions used in cricket, helping players understand where to position themselves based on the game situation and bowling strategy.</p>
      </div>
    </div>
  );
}
