import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Player {
  id: string;
  name: string;
  batting: number;
  bowling: number;
  captaincy: number;
  isWicketkeeper: boolean;
  notes: string;
}

interface Team {
  name: string;
  players: Player[];
  totalRating: number;
  wicketkeepers: number;
  description: string;
  captain?: Player;
  viceCaptain?: Player;
  wicketkeeper?: Player;
}

interface TeamDisplayProps {
  teams: Team[];
}

export function TeamDisplay({ teams }: TeamDisplayProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-100 text-green-800';
    if (rating >= 3) return 'bg-blue-100 text-blue-800';
    if (rating >= 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getRatingEmoji = (rating: number) => {
    if (rating >= 4) return '⭐';
    if (rating >= 3) return '👍';
    if (rating >= 2) return '👌';
    return '📈';
  };

  const getPlayerRole = (player: Player, team: Team) => {
    const roles = [];
    if (team.captain?.id === player.id) roles.push('Captain');
    if (team.viceCaptain?.id === player.id) roles.push('Vice-Captain');
    if (team.wicketkeeper?.id === player.id) roles.push('Wicketkeeper');
    return roles;
  };

  return (
    <div className="space-y-4">
      {teams.map((team, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{team.name}</span>
              <div className="flex items-center gap-2 text-sm">
                <span>Fairness Rating: {(team.totalRating / (team.players.length * 2)).toFixed(1)}/5</span>
                {team.wicketkeepers > 0 && (
                  <Badge variant="secondary">
                    🧤 {team.wicketkeepers} WK
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {team.description}
            </p>

            {/* Leadership Summary */}
            <div className="bg-muted/50 p-3 rounded-lg">
              <h4 className="font-medium mb-2">Leadership</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="font-medium">👑 Captain:</span> {team.captain?.name || 'Not assigned'}
                </div>
                <div>
                  <span className="font-medium">🥈 Vice-Captain:</span> {team.viceCaptain?.name || 'Not assigned'}
                </div>
                <div>
                  <span className="font-medium">🧤 Wicketkeeper:</span> {team.wicketkeeper?.name || 'Not assigned'}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Players ({team.players.length})</h4>
              <div className="space-y-2">
                {team.players
                  .sort((a, b) => (b.batting + b.bowling + b.captaincy) - (a.batting + a.bowling + a.captaincy))
                  .map((player) => {
                    const playerRoles = getPlayerRole(player, team);
                    return (
                      <div key={player.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{player.name}</span>
                          {playerRoles.map(role => (
                            <Badge key={role} variant="outline" className="text-xs">
                              {role === 'Captain' && '👑'}
                              {role === 'Vice-Captain' && '🥈'}
                              {role === 'Wicketkeeper' && '🧤'}
                              {' '}{role}
                            </Badge>
                          ))}
                          {player.notes && (
                            <Badge variant="secondary" className="text-xs">
                              {player.notes}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex items-center gap-1">
                            <span>🏏</span>
                            <Badge className={getRatingColor(player.batting)} variant="secondary">
                              {player.batting}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>⚾</span>
                            <Badge className={getRatingColor(player.bowling)} variant="secondary">
                              {player.bowling}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>👑</span>
                            <Badge className={getRatingColor(player.captaincy)} variant="secondary">
                              {player.captaincy}
                            </Badge>
                          </div>
                          <span className="ml-1">
                            {getRatingEmoji(Math.round((player.batting + player.bowling + player.captaincy) / 3))}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2 border-t">
              <div className="text-center">
                <div className="text-lg font-medium">
                  {(team.players.reduce((sum, p) => sum + p.batting, 0) / team.players.length).toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Avg Batting</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium">
                  {(team.players.reduce((sum, p) => sum + p.bowling, 0) / team.players.length).toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Avg Bowling</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium">
                  {(team.players.reduce((sum, p) => sum + p.captaincy, 0) / team.players.length).toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Avg Leadership</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
