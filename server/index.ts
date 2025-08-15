import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { db } from './db/index.js';
import { setupStaticServing } from './static-serve.js';

dotenv.config();

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, role, batting_type, batting_position, bowling_hand, bowling_type, security_question, security_answer } = req.body;
    
    console.log('Registration attempt:', { username, role, batting_type, batting_position, bowling_hand, bowling_type, security_question });
    
    // Validate required fields
    if (!username || !password || !role || !security_question || !security_answer) {
      res.status(400).json({ error: 'Username, password, role, security question, and security answer are required' });
      return;
    }
    
    // Check if user already exists
    const existingUser = await db
      .selectFrom('users')
      .select('username')
      .where('username', '=', username)
      .executeTakeFirst();
    
    if (existingUser) {
      res.status(400).json({ error: 'Username already exists' });
      return;
    }
    
    // Hash password and security answer
    const passwordHash = await bcrypt.hash(password, 10);
    const securityAnswerHash = await bcrypt.hash(security_answer.toLowerCase().trim(), 10);
    
    // Insert new user
    await db
      .insertInto('users')
      .values({
        username,
        password_hash: passwordHash,
        role,
        batting_type: batting_type || null,
        batting_position: batting_position || null,
        bowling_hand: bowling_hand || null,
        bowling_type: bowling_type || null,
        security_question,
        security_answer: securityAnswerHash,
      })
      .execute();
    
    console.log('User registered successfully:', username);
    res.json({ success: true, message: 'Account created successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('Login attempt:', username);
    
    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }
    
    // Find user
    const user = await db
      .selectFrom('users')
      .select(['id', 'username', 'password_hash', 'role', 'batting_type', 'batting_position', 'bowling_hand', 'bowling_type'])
      .where('username', '=', username)
      .executeTakeFirst();
    
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    
    // Return user data (excluding password hash)
    const userData = {
      id: user.id,
      username: user.username,
      role: user.role,
      batting_type: user.batting_type,
      batting_position: user.batting_position,
      bowling_hand: user.bowling_hand,
      bowling_type: user.bowling_type,
    };
    
    console.log('Login successful:', username);
    res.json({ success: true, user: userData });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update account endpoint
app.put('/api/auth/update-account', async (req, res) => {
  try {
    const { userId, username, role, batting_type, batting_position, bowling_hand, bowling_type, current_password, new_password } = req.body;
    
    console.log('Account update attempt for user:', userId);
    
    if (!userId || !username || !role) {
      res.status(400).json({ error: 'User ID, username, and role are required' });
      return;
    }
    
    // Find user
    const user = await db
      .selectFrom('users')
      .select(['id', 'username', 'password_hash'])
      .where('id', '=', userId)
      .executeTakeFirst();
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    // Check if username is already taken by another user
    if (username !== user.username) {
      const existingUser = await db
        .selectFrom('users')
        .select('username')
        .where('username', '=', username)
        .where('id', '!=', userId)
        .executeTakeFirst();
      
      if (existingUser) {
        res.status(400).json({ error: 'Username already exists' });
        return;
      }
    }
    
    let updateData = {
      username,
      role,
      batting_type: batting_type || null,
      batting_position: batting_position || null,
      bowling_hand: bowling_hand || null,
      bowling_type: bowling_type || null,
    };
    
    // Handle password change
    if (new_password) {
      if (!current_password) {
        res.status(400).json({ error: 'Current password is required to change password' });
        return;
      }
      
      // Verify current password
      const isValidPassword = await bcrypt.compare(current_password, user.password_hash);
      
      if (!isValidPassword) {
        res.status(401).json({ error: 'Current password is incorrect' });
        return;
      }
      
      // Hash new password
      const newPasswordHash = await bcrypt.hash(new_password, 10);
      updateData = { ...updateData, password_hash: newPasswordHash };
    }
    
    // Update user
    await db
      .updateTable('users')
      .set(updateData)
      .where('id', '=', userId)
      .execute();
    
    // Get updated user data
    const updatedUser = await db
      .selectFrom('users')
      .select(['id', 'username', 'role', 'batting_type', 'batting_position', 'bowling_hand', 'bowling_type'])
      .where('id', '=', userId)
      .executeTakeFirst();
    
    console.log('Account updated successfully for user:', userId);
    res.json({ 
      success: true, 
      message: 'Account updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update account error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get security question endpoint
app.post('/api/auth/security-question', async (req, res) => {
  try {
    const { username } = req.body;
    
    console.log('Security question request for:', username);
    
    if (!username) {
      res.status(400).json({ error: 'Username is required' });
      return;
    }
    
    // Find user and get security question
    const user = await db
      .selectFrom('users')
      .select(['security_question'])
      .where('username', '=', username)
      .executeTakeFirst();
    
    if (!user || !user.security_question) {
      res.status(404).json({ error: 'User not found or no security question set' });
      return;
    }
    
    res.json({ success: true, security_question: user.security_question });
  } catch (error) {
    console.error('Security question error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset password endpoint
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { username, security_answer, new_password } = req.body;
    
    console.log('Password reset attempt for:', username);
    
    if (!username || !security_answer || !new_password) {
      res.status(400).json({ error: 'Username, security answer, and new password are required' });
      return;
    }
    
    // Find user
    const user = await db
      .selectFrom('users')
      .select(['id', 'security_answer'])
      .where('username', '=', username)
      .executeTakeFirst();
    
    if (!user || !user.security_answer) {
      res.status(404).json({ error: 'User not found or no security answer set' });
      return;
    }
    
    // Verify security answer
    const isValidAnswer = await bcrypt.compare(security_answer.toLowerCase().trim(), user.security_answer);
    
    if (!isValidAnswer) {
      res.status(401).json({ error: 'Incorrect security answer' });
      return;
    }
    
    // Hash new password
    const newPasswordHash = await bcrypt.hash(new_password, 10);
    
    // Update password
    await db
      .updateTable('users')
      .set({ password_hash: newPasswordHash })
      .where('id', '=', user.id)
      .execute();
    
    console.log('Password reset successful for:', username);
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save batting assessment endpoint
app.post('/api/assessments/batting', async (req, res) => {
  try {
    const { userId, goodLines, weakLines, goodLengths, weakLengths, masterShots, hardShots } = req.body;
    
    console.log('Saving batting assessment for user:', userId);
    
    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }
    
    // Delete existing assessment
    await db
      .deleteFrom('batting_assessments')
      .where('user_id', '=', userId)
      .execute();
    
    // Insert new assessment
    await db
      .insertInto('batting_assessments')
      .values({
        user_id: userId,
        good_lines: JSON.stringify(goodLines),
        weak_lines: JSON.stringify(weakLines),
        good_lengths: JSON.stringify(goodLengths),
        weak_lengths: JSON.stringify(weakLengths),
        master_shots: JSON.stringify(masterShots),
        hard_shots: JSON.stringify(hardShots),
      })
      .execute();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Save batting assessment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get batting assessment endpoint
app.get('/api/assessments/batting/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    console.log('Getting batting assessment for user:', userId);
    
    const assessment = await db
      .selectFrom('batting_assessments')
      .selectAll()
      .where('user_id', '=', userId)
      .orderBy('created_at', 'desc')
      .executeTakeFirst();
    
    if (!assessment) {
      res.json({ success: false, message: 'No assessment found' });
      return;
    }
    
    const data = {
      goodLines: JSON.parse(assessment.good_lines),
      weakLines: JSON.parse(assessment.weak_lines),
      goodLengths: JSON.parse(assessment.good_lengths),
      weakLengths: JSON.parse(assessment.weak_lengths),
      masterShots: JSON.parse(assessment.master_shots),
      hardShots: JSON.parse(assessment.hard_shots),
    };
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('Get batting assessment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save bowling assessment endpoint
app.post('/api/assessments/bowling', async (req, res) => {
  try {
    const { userId, goodLines, weakLines, goodLengths, weakLengths, masterVariations, hardVariations, improvementAreas, bowlingType } = req.body;
    
    console.log('Saving bowling assessment for user:', userId);
    
    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }
    
    // Delete existing assessment
    await db
      .deleteFrom('bowling_assessments')
      .where('user_id', '=', userId)
      .execute();
    
    // Insert new assessment
    await db
      .insertInto('bowling_assessments')
      .values({
        user_id: userId,
        good_lines: JSON.stringify(goodLines),
        weak_lines: JSON.stringify(weakLines),
        good_lengths: JSON.stringify(goodLengths),
        weak_lengths: JSON.stringify(weakLengths),
        master_variations: JSON.stringify(masterVariations),
        hard_variations: JSON.stringify(hardVariations),
        improvement_areas: JSON.stringify(improvementAreas),
        bowling_type: bowlingType,
      })
      .execute();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Save bowling assessment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get bowling assessment endpoint
app.get('/api/assessments/bowling/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    console.log('Getting bowling assessment for user:', userId);
    
    const assessment = await db
      .selectFrom('bowling_assessments')
      .selectAll()
      .where('user_id', '=', userId)
      .orderBy('created_at', 'desc')
      .executeTakeFirst();
    
    if (!assessment) {
      res.json({ success: false, message: 'No assessment found' });
      return;
    }
    
    const data = {
      goodLines: JSON.parse(assessment.good_lines),
      weakLines: JSON.parse(assessment.weak_lines),
      goodLengths: JSON.parse(assessment.good_lengths),
      weakLengths: JSON.parse(assessment.weak_lengths),
      masterVariations: JSON.parse(assessment.master_variations),
      hardVariations: JSON.parse(assessment.hard_variations),
      improvementAreas: JSON.parse(assessment.improvement_areas),
      bowlingType: assessment.bowling_type,
    };
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('Get bowling assessment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save fielding assessment endpoint
app.post('/api/assessments/fielding', async (req, res) => {
  try {
    const { userId, currentPositions, desiredPositions, goodSkills, weakSkills } = req.body;
    
    console.log('Saving fielding assessment for user:', userId);
    
    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }
    
    // Delete existing assessment
    await db
      .deleteFrom('fielding_assessments')
      .where('user_id', '=', userId)
      .execute();
    
    // Insert new assessment
    await db
      .insertInto('fielding_assessments')
      .values({
        user_id: userId,
        current_positions: JSON.stringify(currentPositions),
        desired_positions: JSON.stringify(desiredPositions),
        good_skills: JSON.stringify(goodSkills),
        weak_skills: JSON.stringify(weakSkills),
      })
      .execute();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Save fielding assessment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get fielding assessment endpoint
app.get('/api/assessments/fielding/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    console.log('Getting fielding assessment for user:', userId);
    
    const assessment = await db
      .selectFrom('fielding_assessments')
      .selectAll()
      .where('user_id', '=', userId)
      .orderBy('created_at', 'desc')
      .executeTakeFirst();
    
    if (!assessment) {
      res.json({ success: false, message: 'No assessment found' });
      return;
    }
    
    const data = {
      currentPositions: JSON.parse(assessment.current_positions),
      desiredPositions: JSON.parse(assessment.desired_positions),
      goodSkills: JSON.parse(assessment.good_skills),
      weakSkills: JSON.parse(assessment.weak_skills),
    };
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('Get fielding assessment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save team builder session endpoint
app.post('/api/team-builder/save', async (req, res) => {
  try {
    const { userId, sessionName, numberOfTeams, players, teams } = req.body;
    
    console.log('Saving team builder session for user:', userId);
    
    if (!userId || !sessionName || !players || !teams) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Delete existing session with same name for this user
    const existingSession = await db
      .selectFrom('team_builder_sessions')
      .select('id')
      .where('user_id', '=', userId)
      .where('session_name', '=', sessionName)
      .executeTakeFirst();

    if (existingSession) {
      await db
        .deleteFrom('team_builder_sessions')
        .where('id', '=', existingSession.id)
        .execute();
    }

    // Create new session
    const sessionResult = await db
      .insertInto('team_builder_sessions')
      .values({
        user_id: userId,
        session_name: sessionName,
        number_of_teams: numberOfTeams,
      })
      .returning('id')
      .executeTakeFirst();

    const sessionId = sessionResult.id;

    // Save players
    const playerMap = new Map();
    for (const player of players) {
      const playerResult = await db
        .insertInto('team_builder_players')
        .values({
          session_id: sessionId,
          name: player.name,
          batting: player.batting,
          bowling: player.bowling,
          captaincy: player.captaincy,
          is_wicketkeeper: player.isWicketkeeper ? 1 : 0,
          notes: player.notes || '',
        })
        .returning('id')
        .executeTakeFirst();
      
      playerMap.set(player.id, playerResult.id);
    }

    // Save teams
    for (const team of teams) {
      const teamResult = await db
        .insertInto('team_builder_teams')
        .values({
          session_id: sessionId,
          team_name: team.name,
          captain_player_id: team.captain ? playerMap.get(team.captain.id) : null,
          vice_captain_player_id: team.viceCaptain ? playerMap.get(team.viceCaptain.id) : null,
          wicketkeeper_player_id: team.wicketkeeper ? playerMap.get(team.wicketkeeper.id) : null,
          total_rating: team.totalRating,
          description: team.description,
        })
        .returning('id')
        .executeTakeFirst();

      // Save team players
      for (const player of team.players) {
        await db
          .insertInto('team_builder_team_players')
          .values({
            team_id: teamResult.id,
            player_id: playerMap.get(player.id),
          })
          .execute();
      }
    }
    
    res.json({ success: true, sessionId });
  } catch (error) {
    console.error('Save team builder session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get team builder session endpoint
app.get('/api/team-builder/load/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    console.log('Loading team builder session for user:', userId);
    
    // Get latest session
    const session = await db
      .selectFrom('team_builder_sessions')
      .selectAll()
      .where('user_id', '=', userId)
      .orderBy('updated_at', 'desc')
      .executeTakeFirst();
    
    if (!session) {
      res.json({ success: false, message: 'No session found' });
      return;
    }

    // Get players
    const players = await db
      .selectFrom('team_builder_players')
      .selectAll()
      .where('session_id', '=', session.id)
      .execute();

    // Get teams with leadership info
    const teams = await db
      .selectFrom('team_builder_teams')
      .selectAll()
      .where('session_id', '=', session.id)
      .execute();

    // Get team players
    const teamPlayers = await db
      .selectFrom('team_builder_team_players')
      .innerJoin('team_builder_players', 'team_builder_team_players.player_id', 'team_builder_players.id')
      .select([
        'team_builder_team_players.team_id',
        'team_builder_players.id',
        'team_builder_players.name',
        'team_builder_players.batting',
        'team_builder_players.bowling',
        'team_builder_players.captaincy',
        'team_builder_players.is_wicketkeeper',
        'team_builder_players.notes',
      ])
      .execute();

    // Format data
    const formattedPlayers = players.map(player => ({
      id: player.id.toString(),
      name: player.name,
      batting: player.batting,
      bowling: player.bowling,
      captaincy: player.captaincy,
      isWicketkeeper: player.is_wicketkeeper === 1,
      notes: player.notes,
    }));

    const formattedTeams = teams.map(team => {
      const playersInTeam = teamPlayers
        .filter(tp => tp.team_id === team.id)
        .map(tp => ({
          id: tp.id.toString(),
          name: tp.name,
          batting: tp.batting,
          bowling: tp.bowling,
          captaincy: tp.captaincy,
          isWicketkeeper: tp.is_wicketkeeper === 1,
          notes: tp.notes,
        }));

      const captain = team.captain_player_id ? playersInTeam.find(p => p.id === team.captain_player_id.toString()) : null;
      const viceCaptain = team.vice_captain_player_id ? playersInTeam.find(p => p.id === team.vice_captain_player_id.toString()) : null;
      const wicketkeeper = team.wicketkeeper_player_id ? playersInTeam.find(p => p.id === team.wicketkeeper_player_id.toString()) : null;

      return {
        name: team.team_name,
        players: playersInTeam,
        totalRating: team.total_rating,
        wicketkeepers: playersInTeam.filter(p => p.isWicketkeeper).length,
        description: team.description,
        captain,
        viceCaptain,
        wicketkeeper,
      };
    });

    const data = {
      sessionName: session.session_name,
      numberOfTeams: session.number_of_teams,
      players: formattedPlayers,
      teams: formattedTeams,
    };
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('Get team builder session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export a function to start the server
export async function startServer(port) {
  try {
    if (process.env.NODE_ENV === 'production') {
      setupStaticServing(app);
    }
    app.listen(port, () => {
      console.log(`API Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Start the server directly if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Starting server...');
  startServer(process.env.PORT || 3001);
}
