export interface DatabaseSchema {
  users: {
    id: number;
    username: string;
    password_hash: string;
    role: 'batter' | 'bowler' | 'allrounder' | 'wicketkeeper';
    batting_type: 'righty' | 'lefty' | null;
    batting_position: 'top_order' | 'middle_order' | 'tail_ender' | null;
    bowling_hand: 'right' | 'left' | null;
    bowling_type: 'fast' | 'medium-fast' | 'off-break' | 'leg-break' | null;
    security_question: string | null;
    security_answer: string | null;
    created_at: string;
  };
  batting_assessments: {
    id: number;
    user_id: number;
    good_lines: string;
    weak_lines: string;
    good_lengths: string;
    weak_lengths: string;
    master_shots: string;
    hard_shots: string;
    created_at: string;
  };
  bowling_assessments: {
    id: number;
    user_id: number;
    good_lines: string;
    weak_lines: string;
    good_lengths: string;
    weak_lengths: string;
    master_variations: string;
    hard_variations: string;
    improvement_areas: string;
    bowling_type: string;
    created_at: string;
  };
  fielding_assessments: {
    id: number;
    user_id: number;
    current_positions: string;
    desired_positions: string;
    good_skills: string;
    weak_skills: string;
    created_at: string;
  };
  team_builder_sessions: {
    id: number;
    user_id: number;
    session_name: string;
    number_of_teams: number;
    created_at: string;
    updated_at: string;
  };
  team_builder_players: {
    id: number;
    session_id: number;
    name: string;
    batting: number;
    bowling: number;
    captaincy: number;
    is_wicketkeeper: number;
    notes: string;
    created_at: string;
  };
  team_builder_teams: {
    id: number;
    session_id: number;
    team_name: string;
    captain_player_id: number | null;
    vice_captain_player_id: number | null;
    wicketkeeper_player_id: number | null;
    total_rating: number;
    description: string;
    created_at: string;
  };
  team_builder_team_players: {
    id: number;
    team_id: number;
    player_id: number;
    created_at: string;
  };
}
