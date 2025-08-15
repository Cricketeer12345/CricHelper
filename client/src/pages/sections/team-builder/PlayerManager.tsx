import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  batting: number;
  bowling: number;
  captaincy: number;
  isWicketkeeper: boolean;
  notes: string;
}

interface PlayerManagerProps {
  players: Player[];
  onAddPlayer: (player: Omit<Player, 'id'>) => void;
  onUpdatePlayer: (id: string, updates: Partial<Player>) => void;
  onRemovePlayer: (id: string) => void;
}

export function PlayerManager({ players, onAddPlayer, onUpdatePlayer, onRemovePlayer }: PlayerManagerProps) {
  const [newPlayerName, setNewPlayerName] = React.useState('');

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      onAddPlayer({
        name: newPlayerName.trim(),
        batting: 3,
        bowling: 3,
        captaincy: 3,
        isWicketkeeper: false,
        notes: '',
      });
      setNewPlayerName('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddPlayer();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter player name"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button onClick={handleAddPlayer} disabled={!newPlayerName.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {players.map((player) => (
          <Card key={player.id} className="p-4">
            <CardContent className="p-0 space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-lg">{player.name}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemovePlayer(player.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Batting: {player.batting}/5
                  </Label>
                  <Slider
                    value={[player.batting]}
                    onValueChange={(value) => 
                      onUpdatePlayer(player.id, { batting: value[0] })
                    }
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Bowling: {player.bowling}/5
                  </Label>
                  <Slider
                    value={[player.bowling]}
                    onValueChange={(value) => 
                      onUpdatePlayer(player.id, { bowling: value[0] })
                    }
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Captaincy: {player.captaincy}/5
                  </Label>
                  <Slider
                    value={[player.captaincy]}
                    onValueChange={(value) => 
                      onUpdatePlayer(player.id, { captaincy: value[0] })
                    }
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`wk-${player.id}`}
                    checked={player.isWicketkeeper}
                    onCheckedChange={(checked) => 
                      onUpdatePlayer(player.id, { isWicketkeeper: checked as boolean })
                    }
                  />
                  <Label htmlFor={`wk-${player.id}`} className="text-sm">
                    Wicketkeeper
                  </Label>
                </div>

                <div className="flex-1">
                  <Input
                    placeholder="Notes (e.g., out of form, new player)"
                    value={player.notes}
                    onChange={(e) => 
                      onUpdatePlayer(player.id, { notes: e.target.value })
                    }
                    className="text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {players.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            Add players to start building teams
          </div>
        )}
      </div>
    </div>
  );
}
