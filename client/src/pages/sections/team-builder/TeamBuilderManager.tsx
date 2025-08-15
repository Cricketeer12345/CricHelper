import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlayerManager } from './PlayerManager';
import { TeamDisplay } from './TeamDisplay';
import { useAuth } from '../../../contexts/AuthContext';

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

export function TeamBuilderManager() {
  const { user } = useAuth();
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [teams, setTeams] = React.useState<Team[]>([]);
  const [numberOfTeams, setNumberOfTeams] = React.useState(2);
  const [sessionName, setSessionName] = React.useState('My Team Session');
  const [isGeneratingTeams, setIsGeneratingTeams] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    const loadSession = async () => {
      if (!user?.id) return;
      
      try {
        console.log('Loading team builder session for user:', user.id);
        const response = await fetch(`/api/team-builder/load/${user.id}`);
        const result = await response.json();
        
        console.log('Load session result:', result);
        
        if (result.success && result.data) {
          setSessionName(result.data.sessionName);
          setNumberOfTeams(result.data.numberOfTeams);
          setPlayers(result.data.players);
          setTeams(result.data.teams);
          console.log('Session loaded successfully');
        } else {
          console.log('No existing session found, starting fresh');
        }
      } catch (error) {
        console.error('Error loading team builder session:', error);
      }
    };
    
    loadSession();
  }, [user?.id]);

  const addPlayer = (player: Omit<Player, 'id'>) => {
    const newPlayer: Player = {
      ...player,
      id: Date.now().toString(),
    };
    console.log('Adding player:', newPlayer);
    setPlayers(prev => [...prev, newPlayer]);
  };

  const updatePlayer = (id: string, updates: Partial<Player>) => {
    console.log('Updating player:', id, updates);
    setPlayers(prev => prev.map(player => 
      player.id === id ? { ...player, ...updates } : player
    ));
  };

  const removePlayer = (id: string) => {
    console.log('Removing player:', id);
    setPlayers(prev => prev.filter(player => player.id !== id));
    // Clear teams when players are removed
    setTeams([]);
  };

  const generateTeams = async () => {
    if (players.length === 0) return;

    console.log('Generating teams with algorithm for', players.length, 'players into', numberOfTeams, 'teams');
    setIsGeneratingTeams(true);

    try {
      const balancedTeams = createBalancedTeams(players, numberOfTeams);
      console.log('Generated balanced teams:', balancedTeams);
      setTeams(balancedTeams);
    } catch (error) {
      console.error('Error generating teams:', error);
    }

    setIsGeneratingTeams(false);
  };

  const createBalancedTeams = (players: Player[], numTeams: number): Team[] => {
    console.log('Creating balanced teams - Input players:', players);
    console.log('Number of teams requested:', numTeams);

    // Step 1: Select captains based on highest captaincy ratings
    const sortedByCaptaincy = [...players].sort((a, b) => b.captaincy - a.captaincy);
    console.log('Players sorted by captaincy:', sortedByCaptaincy.map(p => ({ name: p.name, captaincy: p.captaincy })));
    
    const captains = sortedByCaptaincy.slice(0, numTeams);
    const nonCaptains = sortedByCaptaincy.slice(numTeams);
    
    console.log('Selected captains:', captains.map(c => c.name));
    console.log('Non-captains:', nonCaptains.map(nc => nc.name));

    // Initialize teams with captains
    const teams: Team[] = captains.map((captain, index) => ({
      name: `Team ${index + 1}`,
      players: [captain],
      totalRating: captain.batting + captain.bowling,
      wicketkeepers: captain.isWicketkeeper ? 1 : 0,
      description: '',
      captain,
    }));

    console.log('Teams initialized with captains:', teams.map(t => ({ name: t.name, captain: t.captain?.name, rating: t.totalRating })));

    // Step 2: Separate wicketkeepers and other players from non-captains
    const nonCaptainWicketkeepers = nonCaptains.filter(p => p.isWicketkeeper);
    const nonCaptainRegularPlayers = nonCaptains.filter(p => !p.isWicketkeeper);
    
    console.log('Non-captain wicketkeepers:', nonCaptainWicketkeepers.map(wk => wk.name));
    console.log('Non-captain regular players:', nonCaptainRegularPlayers.map(rp => rp.name));

    // Step 3: Distribute wicketkeepers first (round-robin)
    nonCaptainWicketkeepers.forEach((wk, index) => {
      const teamIndex = index % numTeams;
      teams[teamIndex].players.push(wk);
      teams[teamIndex].totalRating += wk.batting + wk.bowling;
      teams[teamIndex].wicketkeepers++;
      console.log(`Assigned wicketkeeper ${wk.name} to ${teams[teamIndex].name}`);
    });

    // Step 4: Sort remaining players by combined batting + bowling skill
    const sortedRegularPlayers = nonCaptainRegularPlayers.sort((a, b) => 
      (b.batting + b.bowling) - (a.batting + a.bowling)
    );
    
    console.log('Regular players sorted by skill:', sortedRegularPlayers.map(p => ({ 
      name: p.name, 
      total: p.batting + p.bowling,
      batting: p.batting,
      bowling: p.bowling 
    })));

    // Step 5: Distribute remaining players using snake draft for balance
    let currentTeam = 0;
    let direction = 1; // 1 for forward, -1 for backward

    sortedRegularPlayers.forEach((player, playerIndex) => {
      teams[currentTeam].players.push(player);
      teams[currentTeam].totalRating += player.batting + player.bowling;
      
      console.log(`Snake draft - Player ${player.name} (skill: ${player.batting + player.bowling}) assigned to ${teams[currentTeam].name} (Team ${currentTeam + 1})`);

      // Move to next team using snake pattern
      if (direction === 1) {
        currentTeam++;
        if (currentTeam >= numTeams) {
          currentTeam = numTeams - 1;
          direction = -1;
          console.log('Snake draft direction changed to backward');
        }
      } else {
        currentTeam--;
        if (currentTeam < 0) {
          currentTeam = 0;
          direction = 1;
          console.log('Snake draft direction changed to forward');
        }
      }
    });

    // Step 6: Assign vice-captains and wicketkeepers
    teams.forEach(team => {
      // Sort team players by captaincy (excluding captain)
      const nonCaptainPlayers = team.players.filter(p => p.id !== team.captain?.id);
      const playersByCaptaincy = nonCaptainPlayers.sort((a, b) => b.captaincy - a.captaincy);
      
      // Assign vice-captain (best captaincy among non-captains)
      if (playersByCaptaincy.length > 0) {
        team.viceCaptain = playersByCaptaincy[0];
        console.log(`${team.name} vice-captain: ${team.viceCaptain.name} (captaincy: ${team.viceCaptain.captaincy})`);
      }
      
      // Assign wicketkeeper (best wicketkeeper in team)
      const wicketkeepers = team.players.filter(p => p.isWicketkeeper);
      if (wicketkeepers.length > 0) {
        // Choose wicketkeeper with best captaincy rating
        team.wicketkeeper = wicketkeepers.sort((a, b) => b.captaincy - a.captaincy)[0];
        console.log(`${team.name} wicketkeeper: ${team.wicketkeeper.name}`);
      }
      
      // Generate team description
      team.description = generateTeamDescription(team);
    });

    // Log final team balance
    teams.forEach(team => {
      const avgBatting = (team.players.reduce((sum, p) => sum + p.batting, 0) / team.players.length).toFixed(1);
      const avgBowling = (team.players.reduce((sum, p) => sum + p.bowling, 0) / team.players.length).toFixed(1);
      console.log(`${team.name} final stats - Players: ${team.players.length}, Avg Batting: ${avgBatting}, Avg Bowling: ${avgBowling}, Total Rating: ${team.totalRating}`);
    });

    return teams;
  };

  const generateTeamDescription = (team: Team): string => {
    const totalPlayers = team.players.length;
    const avgBatting = (team.players.reduce((sum, p) => sum + p.batting, 0) / totalPlayers).toFixed(1);
    const avgBowling = (team.players.reduce((sum, p) => sum + p.bowling, 0) / totalPlayers).toFixed(1);
    const avgCaptaincy = (team.players.reduce((sum, p) => sum + p.captaincy, 0) / totalPlayers).toFixed(1);
    
    let description = `Balanced team with ${totalPlayers} players. `;
    description += `Batting average: ${avgBatting}/5, Bowling average: ${avgBowling}/5, Leadership average: ${avgCaptaincy}/5. `;

    // Leadership info
    if (team.captain) {
      description += `Led by ${team.captain.name} (Captain, ${team.captain.captaincy}/5 leadership)`;
      if (team.viceCaptain && team.viceCaptain.id !== team.captain.id) {
        description += ` and ${team.viceCaptain.name} (Vice-Captain, ${team.viceCaptain.captaincy}/5 leadership)`;
      }
      description += '. ';
    }

    // Wicketkeeper info
    if (team.wicketkeeper) {
      description += `${team.wicketkeeper.name} keeps wickets. `;
    }

    // Special players with notes
    const playersWithNotes = team.players.filter(p => p.notes.trim() !== '');
    if (playersWithNotes.length > 0) {
      description += 'Special notes: ';
      playersWithNotes.forEach((player, index) => {
        description += `${player.name} (${player.notes.toLowerCase()})`;
        if (index < playersWithNotes.length - 1) description += ', ';
      });
      description += '. ';
    }

    // Team balance assessment
    const battingStrength = parseFloat(avgBatting);
    const bowlingStrength = parseFloat(avgBowling);
    
    if (battingStrength >= 3.5 && bowlingStrength >= 3.5) {
      description += 'Well-balanced team with strong batting and bowling.';
    } else if (battingStrength >= 3.5) {
      description += 'Strong batting lineup with developing bowling attack.';
    } else if (bowlingStrength >= 3.5) {
      description += 'Solid bowling attack with developing batting order.';
    } else {
      description += 'Developing team with growth potential in all areas.';
    }

    return description.trim();
  };

  const handleNumberOfTeamsChange = (value: string) => {
    const num = parseInt(value);
    if (!isNaN(num) && num >= 2 && num <= players.length) {
      console.log('Number of teams changed to:', num);
      setNumberOfTeams(num);
      // Clear teams when number changes
      setTeams([]);
    }
  };

  const saveSession = async () => {
    if (!user?.id || teams.length === 0) {
      console.log('Cannot save - missing user ID or no teams generated');
      return;
    }

    setIsSaving(true);
    console.log('Saving team builder session...');

    try {
      const response = await fetch('/api/team-builder/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          sessionName,
          numberOfTeams,
          players,
          teams,
        }),
      });

      const result = await response.json();
      console.log('Save session result:', result);

      if (response.ok && result.success) {
        console.log('Team builder session saved successfully');
      } else {
        console.error('Failed to save session:', result);
      }
    } catch (error) {
      console.error('Error saving team builder session:', error);
    }

    setIsSaving(false);
  };

  const canGenerateTeams = players.length >= numberOfTeams;
  const maxTeams = Math.min(players.length, 10); // Cap at 10 teams max

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <Label htmlFor="session-name">Session Name:</Label>
          <Input
            id="session-name"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            placeholder="Enter session name"
          />
        </div>
        <div>
          <Label htmlFor="num-teams">Number of Teams:</Label>
          <Input
            id="num-teams"
            type="number"
            min="2"
            max={maxTeams}
            value={numberOfTeams}
            onChange={(e) => handleNumberOfTeamsChange(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <div className="text-sm text-muted-foreground">
            <div className="font-medium">Players: {players.length}</div>
            <div>Max teams: {maxTeams}</div>
          </div>
        </div>
        <div className="flex items-end">
          <div className="text-sm text-muted-foreground">
            {teams.length > 0 && (
              <div>
                <div className="font-medium">Teams generated</div>
                <div>Avg players per team: {(players.length / numberOfTeams).toFixed(1)}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Button 
          onClick={generateTeams}
          disabled={!canGenerateTeams || isGeneratingTeams}
          className="px-6"
        >
          {isGeneratingTeams ? 'Generating...' : 'Generate Fair Teams'}
        </Button>
        
        <Button 
          onClick={saveSession}
          disabled={teams.length === 0 || isSaving}
          variant="outline"
          className="px-6"
        >
          {isSaving ? 'Saving...' : 'Save Session'}
        </Button>
      </div>

      {!canGenerateTeams && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-800">
            You need at least {numberOfTeams} players to generate {numberOfTeams} teams. 
            Currently you have {players.length} players.
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>👥 Players ({players.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <PlayerManager
              players={players}
              onAddPlayer={addPlayer}
              onUpdatePlayer={updatePlayer}
              onRemovePlayer={removePlayer}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🏆 Generated Teams ({teams.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {teams.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium mb-2">🎯 Fairness Analysis</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Batting Range:</span>
                      <div>
                        {Math.min(...teams.map(t => parseFloat((t.players.reduce((sum, p) => sum + p.batting, 0) / t.players.length).toFixed(1)))).toFixed(1)} - {Math.max(...teams.map(t => parseFloat((t.players.reduce((sum, p) => sum + p.batting, 0) / t.players.length).toFixed(1)))).toFixed(1)} avg
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Bowling Range:</span>
                      <div>
                        {Math.min(...teams.map(t => parseFloat((t.players.reduce((sum, p) => sum + p.bowling, 0) / t.players.length).toFixed(1)))).toFixed(1)} - {Math.max(...teams.map(t => parseFloat((t.players.reduce((sum, p) => sum + p.bowling, 0) / t.players.length).toFixed(1)))).toFixed(1)} avg
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    ✅ Lower range difference = more balanced teams
                  </p>
                  <div className="mt-2 text-xs">
                    <span className="font-medium">Algorithm:</span> Captain selection by leadership → Snake draft distribution → Role assignments
                  </div>
                </div>
                <TeamDisplay teams={teams} />
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <div className="mb-2">🏏</div>
                <p>Add players and generate teams to see balanced team suggestions</p>
                <p className="text-xs mt-2">Algorithm ensures fair distribution based on batting, bowling & leadership skills</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}