import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Users, DollarSign, AlertCircle, Loader2 } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { PageHeader } from '../components/PageHeaderSport';
import { Button } from '../components/ui/Button';
import { api } from '../api/client';
import { Dialog, DialogContent } from '../components/ui/Dialog';

// Static tournament and category data - Module level
const staticCategories = [
  {
    id: 'cricket',
    name: 'Cricket',
    emoji: '🏏',
    tournaments: [
      { id: 'ipl2024', name: 'IPL 2024', eventCount: 8 },
      { id: 'wc2024', name: 'World Cup 2024', eventCount: 12 },
      { id: 'bbl2024', name: 'BBL 2024', eventCount: 6 },
    ],
  },
  {
    id: 'football',
    name: 'Football',
    emoji: '🏈',
    tournaments: [
      { id: 'nfl2024', name: 'NFL 2024', eventCount: 10 },
      { id: 'superbowl', name: 'Super Bowl', eventCount: 1 },
      { id: 'college', name: 'College Football', eventCount: 15 },
    ],
  },
  {
    id: 'soccer',
    name: 'Soccer',
    emoji: '⚽',
    tournaments: [
      { id: 'epl2024', name: 'EPL 2024', eventCount: 20 },
      { id: 'champions', name: 'Champions League', eventCount: 8 },
      { id: 'world', name: 'World Cup 2026', eventCount: 5 },
    ],
  },
  {
    id: 'basketball',
    name: 'Basketball',
    emoji: '🏀',
    tournaments: [
      { id: 'nba2024', name: 'NBA 2024', eventCount: 14 },
      { id: 'ncaa', name: 'NCAA', eventCount: 18 },
      { id: 'euroleague', name: 'Euroleague', eventCount: 6 },
    ],
  },
  {
    id: 'tennis',
    name: 'Tennis',
    emoji: '🎾',
    tournaments: [
      { id: 'wimbledon', name: 'Wimbledon', eventCount: 7 },
      { id: 'usopen', name: 'US Open', eventCount: 5 },
      { id: 'ausopen', name: 'Australian Open', eventCount: 6 },
    ],
  },
];

const staticTournamentEvents: Record<string, any[]> = {
  'ipl2024': [
    { id: 'ipl1', name: 'CSK vs RCB', teams: [{ shortName: 'CSK' }, { shortName: 'RCB' }], startDate: Math.floor(Date.now() / 1000) + 2 * 60 * 60, stats: '{}' },
    { id: 'ipl2', name: 'MI vs KKR', teams: [{ shortName: 'MI' }, { shortName: 'KKR' }], startDate: Math.floor(Date.now() / 1000) + 1 * 24 * 60 * 60 + 4 * 60 * 60, stats: '{}' },
    { id: 'ipl3', name: 'DC vs SRH', teams: [{ shortName: 'DC' }, { shortName: 'SRH' }], startDate: Math.floor(Date.now() / 1000) + 2 * 24 * 60 * 60 + 6 * 60 * 60, stats: '{}' },
  ],
  'wc2024': [
    { id: 'wc1', name: 'IND vs PAK', teams: [{ shortName: 'IND' }, { shortName: 'PAK' }], startDate: Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60 + 12 * 60 * 60, stats: '{}' },
    { id: 'wc2', name: 'AUS vs ENG', teams: [{ shortName: 'AUS' }, { shortName: 'ENG' }], startDate: Math.floor(Date.now() / 1000) + 5 * 24 * 60 * 60 + 8 * 60 * 60, stats: '{}' },
  ],
  'bbl2024': [
    { id: 'bbl1', name: 'SYD vs BRI', teams: [{ shortName: 'SYD' }, { shortName: 'BRI' }], startDate: Math.floor(Date.now() / 1000) + 4 * 24 * 60 * 60 + 18 * 60 * 60, stats: '{}' },
  ],
  'nfl2024': [
    { id: 'nfl1', name: 'KC vs SF', teams: [{ shortName: 'KC' }, { shortName: 'SF' }], startDate: Math.floor(Date.now() / 1000) + 1 * 24 * 60 * 60 + 15 * 60 * 60, stats: '{}' },
    { id: 'nfl2', name: 'DAL vs PHI', teams: [{ shortName: 'DAL' }, { shortName: 'PHI' }], startDate: Math.floor(Date.now() / 1000) + 6 * 24 * 60 * 60 + 20 * 60 * 60, stats: '{}' },
  ],
  'superbowl': [
    { id: 'sb1', name: 'Super Bowl LVIII', teams: [{ shortName: 'KC' }, { shortName: 'SF' }], startDate: Math.floor(Date.now() / 1000) + 10 * 24 * 60 * 60 + 22 * 60 * 60, stats: '{}' },
  ],
  'college': [
    { id: 'col1', name: 'Texas vs Oklahoma', teams: [{ shortName: 'TEX' }, { shortName: 'OU' }], startDate: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 + 19 * 60 * 60, stats: '{}' },
  ],
  'epl2024': [
    { id: 'epl1', name: 'MU vs MCI', teams: [{ shortName: 'MU' }, { shortName: 'MCI' }], startDate: Math.floor(Date.now() / 1000) + 1 * 24 * 60 * 60 + 13 * 60 * 60, stats: '{}' },
    { id: 'epl2', name: 'LIV vs ARS', teams: [{ shortName: 'LIV' }, { shortName: 'ARS' }], startDate: Math.floor(Date.now() / 1000) + 2 * 24 * 60 * 60 + 16 * 60 * 60, stats: '{}' },
  ],
  'champions': [
    { id: 'ch1', name: 'Real Madrid vs PSG', teams: [{ shortName: 'RM' }, { shortName: 'PSG' }], startDate: Math.floor(Date.now() / 1000) + 8 * 24 * 60 * 60 + 20 * 60 * 60, stats: '{}' },
  ],
  'world': [
    { id: 'wld1', name: 'Brazil vs Argentina', teams: [{ shortName: 'BRA' }, { shortName: 'ARG' }], startDate: Math.floor(Date.now() / 1000) + 12 * 24 * 60 * 60 + 15 * 60 * 60, stats: '{}' },
  ],
  'nba2024': [
    { id: 'nba1', name: 'LAL vs GSW', teams: [{ shortName: 'LAL' }, { shortName: 'GSW' }], startDate: Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60 + 19 * 60 * 60, stats: '{}' },
    { id: 'nba2', name: 'BOS vs MIA', teams: [{ shortName: 'BOS' }, { shortName: 'MIA' }], startDate: Math.floor(Date.now() / 1000) + 5 * 24 * 60 * 60 + 14 * 60 * 60, stats: '{}' },
  ],
  'ncaa': [
    { id: 'ncaa1', name: 'Duke vs UNC', teams: [{ shortName: 'DUKE' }, { shortName: 'UNC' }], startDate: Math.floor(Date.now() / 1000) + 9 * 24 * 60 * 60 + 14 * 60 * 60, stats: '{}' },
  ],
  'euroleague': [
    { id: 'euro1', name: 'Real Madrid vs Bayern', teams: [{ shortName: 'RM' }, { shortName: 'BAY' }], startDate: Math.floor(Date.now() / 1000) + 6 * 24 * 60 * 60 + 11 * 60 * 60, stats: '{}' },
  ],
  'wimbledon': [
    { id: 'wim1', name: 'Djokovic vs Alcaraz', teams: [{ shortName: 'DJO' }, { shortName: 'ALC' }], startDate: Math.floor(Date.now() / 1000) + 9 * 60 * 60, stats: '{}' },
  ],
  'usopen': [
    { id: 'uso1', name: 'Nadal vs Sinner', teams: [{ shortName: 'NAD' }, { shortName: 'SIN' }], startDate: Math.floor(Date.now() / 1000) + 8 * 60 * 60, stats: '{}' },
  ],
  'ausopen': [
    { id: 'aus1', name: 'Medvedev vs Jannik', teams: [{ shortName: 'MED' }, { shortName: 'JAK' }], startDate: Math.floor(Date.now() / 1000) + 7 * 60 * 60, stats: '{}' },
  ],
};

const staticTournamentQuestions: Record<string, any[]> = {
  'ipl1': [
    { questionId: 'q1', name: 'Who will win the toss?', description: 'Predict which team wins the coin toss', activity: { questionVolume: 1500000, questionUsers: 345, marketDataDetails: [{ outcome: 'CSK', impliedProbability: 50 }, { outcome: 'RCB', impliedProbability: 50 }] } },
    { questionId: 'q2', name: 'Which team will win?', description: 'Predict the match winner', activity: { questionVolume: 2500000, questionUsers: 512, marketDataDetails: [{ outcome: 'CSK', impliedProbability: 55 }, { outcome: 'RCB', impliedProbability: 45 }] } },
    { questionId: 'q3', name: 'Will there be a super over?', description: 'Predict if match goes to super over', activity: { questionVolume: 800000, questionUsers: 198, marketDataDetails: [{ outcome: 'Yes', impliedProbability: 25 }, { outcome: 'No', impliedProbability: 75 }] } },
  ],
  'ipl2': [
    { questionId: 'q4', name: 'Who will win the toss?', description: 'Predict which team wins the coin toss', activity: { questionVolume: 1200000, questionUsers: 280, marketDataDetails: [{ outcome: 'MI', impliedProbability: 48 }, { outcome: 'KKR', impliedProbability: 52 }] } },
    { questionId: 'q5', name: 'Total runs in first innings?', description: 'Predict if total runs will be above or below 160', activity: { questionVolume: 1800000, questionUsers: 420, marketDataDetails: [{ outcome: 'Above 160', impliedProbability: 60 }, { outcome: 'Below 160', impliedProbability: 40 }] } },
  ],
  'ipl3': [
    { questionId: 'q6', name: 'Which team will win?', description: 'Predict the match winner', activity: { questionVolume: 2000000, questionUsers: 480, marketDataDetails: [{ outcome: 'DC', impliedProbability: 52 }, { outcome: 'SRH', impliedProbability: 48 }] } },
  ],
  'wc1': [
    { questionId: 'q7', name: 'Who will win?', description: 'Predict the match winner', activity: { questionVolume: 3500000, questionUsers: 750, marketDataDetails: [{ outcome: 'IND', impliedProbability: 65 }, { outcome: 'PAK', impliedProbability: 35 }] } },
    { questionId: 'q8', name: 'Will India score 200+?', description: 'Predict if India will score more than 200 runs', activity: { questionVolume: 2200000, questionUsers: 550, marketDataDetails: [{ outcome: 'Yes', impliedProbability: 75 }, { outcome: 'No', impliedProbability: 25 }] } },
  ],
  'wc2': [
    { questionId: 'q9', name: 'Who will win?', description: 'Predict the match winner', activity: { questionVolume: 3000000, questionUsers: 680, marketDataDetails: [{ outcome: 'AUS', impliedProbability: 58 }, { outcome: 'ENG', impliedProbability: 42 }] } },
  ],
  'bbl1': [
    { questionId: 'q10', name: 'Who will win?', description: 'Predict the match winner', activity: { questionVolume: 1100000, questionUsers: 260, marketDataDetails: [{ outcome: 'SYD', impliedProbability: 55 }, { outcome: 'BRI', impliedProbability: 45 }] } },
    { questionId: 'q11', name: 'Most runs scorer?', description: 'Predict which team will have highest run scorer', activity: { questionVolume: 900000, questionUsers: 210, marketDataDetails: [{ outcome: 'SYD', impliedProbability: 50 }, { outcome: 'BRI', impliedProbability: 50 }] } },
  ],
  'nfl1': [
    { questionId: 'q12', name: 'Who will win?', description: 'Predict the match winner', activity: { questionVolume: 4500000, questionUsers: 920, marketDataDetails: [{ outcome: 'KC', impliedProbability: 52 }, { outcome: 'SF', impliedProbability: 48 }] } },
    { questionId: 'q13', name: 'Total points over 50?', description: 'Predict if combined points exceed 50', activity: { questionVolume: 3200000, questionUsers: 680, marketDataDetails: [{ outcome: 'Yes', impliedProbability: 65 }, { outcome: 'No', impliedProbability: 35 }] } },
  ],
  'nfl2': [
    { questionId: 'q14', name: 'Who will win?', description: 'Predict the match winner', activity: { questionVolume: 3800000, questionUsers: 820, marketDataDetails: [{ outcome: 'DAL', impliedProbability: 48 }, { outcome: 'PHI', impliedProbability: 52 }] } },
  ],
  'sb1': [
    { questionId: 'q15', name: 'Who will win Super Bowl?', description: 'Predict the Super Bowl winner', activity: { questionVolume: 8900000, questionUsers: 2100, marketDataDetails: [{ outcome: 'KC', impliedProbability: 51 }, { outcome: 'SF', impliedProbability: 49 }] } },
    { questionId: 'q16', name: 'Which team scores first?', description: 'Predict which team scores first', activity: { questionVolume: 5200000, questionUsers: 1200, marketDataDetails: [{ outcome: 'KC', impliedProbability: 50 }, { outcome: 'SF', impliedProbability: 50 }] } },
    { questionId: 'q17', name: 'MVP will be a QB?', description: 'Predict if MVP is a quarterback', activity: { questionVolume: 4100000, questionUsers: 950, marketDataDetails: [{ outcome: 'Yes', impliedProbability: 70 }, { outcome: 'No', impliedProbability: 30 }] } },
  ],
  'col1': [
    { questionId: 'q18', name: 'Who will win?', description: 'Predict the match winner', activity: { questionVolume: 2800000, questionUsers: 620, marketDataDetails: [{ outcome: 'Texas', impliedProbability: 60 }, { outcome: 'Oklahoma', impliedProbability: 40 }] } },
  ],
  'epl1': [
    { questionId: 'q19', name: 'Who will win?', description: 'Predict the match winner', activity: { questionVolume: 5500000, questionUsers: 1150, marketDataDetails: [{ outcome: 'MU', impliedProbability: 48 }, { outcome: 'MCI', impliedProbability: 52 }] } },
    { questionId: 'q20', name: 'Total goals over 3?', description: 'Predict if total goals exceed 3', activity: { questionVolume: 4200000, questionUsers: 890, marketDataDetails: [{ outcome: 'Yes', impliedProbability: 70 }, { outcome: 'No', impliedProbability: 30 }] } },
  ],
  'epl2': [
    { questionId: 'q21', name: 'Who will win?', description: 'Predict the match winner', activity: { questionVolume: 6100000, questionUsers: 1320, marketDataDetails: [{ outcome: 'LIV', impliedProbability: 56 }, { outcome: 'ARS', impliedProbability: 44 }] } },
  ],
  'ch1': [
    { questionId: 'q22', name: 'Who will win?', description: 'Predict the match winner', activity: { questionVolume: 7200000, questionUsers: 1520, marketDataDetails: [{ outcome: 'Real Madrid', impliedProbability: 58 }, { outcome: 'PSG', impliedProbability: 42 }] } },
    { questionId: 'q23', name: 'Will go to extra time?', description: 'Predict if match goes to extra time', activity: { questionVolume: 3800000, questionUsers: 800, marketDataDetails: [{ outcome: 'Yes', impliedProbability: 35 }, { outcome: 'No', impliedProbability: 65 }] } },
  ],
  'wld1': [
    { questionId: 'q24', name: 'Who will win?', description: 'Predict the match winner', activity: { questionVolume: 9200000, questionUsers: 2050, marketDataDetails: [{ outcome: 'Brazil', impliedProbability: 62 }, { outcome: 'Argentina', impliedProbability: 38 }] } },
  ],
  'nba1': [
    { questionId: 'q25', name: 'Who will win?', description: 'Predict the match winner', activity: { questionVolume: 4800000, questionUsers: 1050, marketDataDetails: [{ outcome: 'LAL', impliedProbability: 50 }, { outcome: 'GSW', impliedProbability: 50 }] } },
    { questionId: 'q26', name: 'Total points over 220?', description: 'Predict if combined points exceed 220', activity: { questionVolume: 3500000, questionUsers: 750, marketDataDetails: [{ outcome: 'Yes', impliedProbability: 72 }, { outcome: 'No', impliedProbability: 28 }] } },
  ],
  'nba2': [
    { questionId: 'q27', name: 'Who will win?', description: 'Predict the match winner', activity: { questionVolume: 4200000, questionUsers: 920, marketDataDetails: [{ outcome: 'BOS', impliedProbability: 54 }, { outcome: 'MIA', impliedProbability: 46 }] } },
  ],
  'ncaa1': [
    { questionId: 'q28', name: 'Who will win?', description: 'Predict the match winner', activity: { questionVolume: 3200000, questionUsers: 680, marketDataDetails: [{ outcome: 'Duke', impliedProbability: 52 }, { outcome: 'UNC', impliedProbability: 48 }] } },
  ],
  'euro1': [
    { questionId: 'q29', name: 'Who will win?', description: 'Predict the match winner', activity: { questionVolume: 3600000, questionUsers: 780, marketDataDetails: [{ outcome: 'Real Madrid', impliedProbability: 57 }, { outcome: 'Bayern', impliedProbability: 43 }] } },
  ],
  'wim1': [
    { questionId: 'q30', name: 'Who will win?', description: 'Predict the match winner', activity: { questionVolume: 2400000, questionUsers: 520, marketDataDetails: [{ outcome: 'Djokovic', impliedProbability: 48 }, { outcome: 'Alcaraz', impliedProbability: 52 }] } },
    { questionId: 'q31', name: 'Will match go to 5 sets?', description: 'Predict if match extends to 5 sets', activity: { questionVolume: 1600000, questionUsers: 350, marketDataDetails: [{ outcome: 'Yes', impliedProbability: 40 }, { outcome: 'No', impliedProbability: 60 }] } },
  ],
  'uso1': [
    { questionId: 'q32', name: 'Who will win?', description: 'Predict the match winner', activity: { questionVolume: 2100000, questionUsers: 450, marketDataDetails: [{ outcome: 'Nadal', impliedProbability: 35 }, { outcome: 'Sinner', impliedProbability: 65 }] } },
  ],
  'aus1': [
    { questionId: 'q33', name: 'Who will win?', description: 'Predict the match winner', activity: { questionVolume: 2000000, questionUsers: 420, marketDataDetails: [{ outcome: 'Medvedev', impliedProbability: 52 }, { outcome: 'Jannik', impliedProbability: 48 }] } },
  ],
};

// Helper function to extract probabilities correctly matched to teams
const getTeamProbabilities = (event: any, teams: any[]) => {
  let probA = 50;
  let probB = 50;

  try {
    const stats = JSON.parse(event.stats || '{}');
    const pred = stats.result_prediction;
    const statsTeams = stats.teams || {};
    
    if (Array.isArray(pred) && pred.length === 2 && teams.length >= 2) {
      // Create a mapping from team code to probability
      const predMap: Record<string, number> = {};
      for (const p of pred) {
        if (p?.team_key) {
          predMap[p.team_key.toLowerCase()] = Number(p.value) || 50;
        }
      }
      
      // Try to find team codes from stats.teams object
      let team0Code: string | null = null;
      let team1Code: string | null = null;
      
      // Search for team0 (Ireland Women)
      for (const [key, teamInfo] of Object.entries(statsTeams)) {
        const info = teamInfo as any;
        if (info?.code === teams[0]?.shortName || info?.alternate_code === teams[0]?.shortName) {
          team0Code = key.toLowerCase();
          break;
        }
      }
      
      // Search for team1 (South Africa Women)
      for (const [key, teamInfo] of Object.entries(statsTeams)) {
        const info = teamInfo as any;
        if (info?.code === teams[1]?.shortName || info?.alternate_code === teams[1]?.shortName) {
          team1Code = key.toLowerCase();
          break;
        }
      }
      
      // If we found the codes, use them to get probabilities
      if (team0Code && predMap[team0Code] !== undefined) {
        probA = predMap[team0Code];
      }
      if (team1Code && predMap[team1Code] !== undefined) {
        probB = predMap[team1Code];
      }
      
      // If still default values, try matching by shortName directly
      if (probA === 50 && probB === 50) {
        const team0Short = teams[0]?.shortName?.toLowerCase()?.replace(/\s/g, '') || '';
        const team1Short = teams[1]?.shortName?.toLowerCase()?.replace(/\s/g, '') || '';
        
        for (const [key, value] of Object.entries(predMap)) {
          if (key.includes(team0Short) || team0Short.includes(key)) {
            probA = value;
          }
          if (key.includes(team1Short) || team1Short.includes(key)) {
            probB = value;
          }
        }
      }
    }
  } catch (e) {
    // ignore parsing errors, use defaults
  }
  
  return { probA, probB };
};

// Team Row Component
const TeamRow = ({ team, probability }: { team: any; probability: number }) => {
  const teamName =
    [team?.name, team?.shortName, team?.displayName, team?.teamName, team?.abbreviation]
      .find((v: any) => typeof v === 'string' && v.trim().length > 0) || 'Team';

  const rawImageUrl =
    [team?.imageUrl, team?.logoUrl, team?.logo, team?.iconUrl, team?.badgeUrl, team?.pictureUrl]
      .find((v: any) => typeof v === 'string') || '';

  const imageUrl = rawImageUrl.replace(/`/g, '').replace(/"/g, '').trim();

  const isLow = probability < 50;
  const percentTextClass = isLow ? 'text-gray-text' : 'text-primary';
  const fillClass = isLow ? 'bg-gray-muted' : 'bg-primary';

  return (
    <div className="rounded-xl bg-dark-card border border-white/10 p-4 mb-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {imageUrl && imageUrl !== 'undefined' ? (
            <img
              src={imageUrl}
              alt={teamName}
              className="h-10 w-10 rounded object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="h-10 w-10 rounded bg-dark-lighter flex items-center justify-center text-sm">🏆</div>
          )}
          <div>
            <div className="text-base text-white font-medium">{teamName}</div>
            {team?.record && <div className="text-xs text-gray-text">Record: {team.record}</div>}
          </div>
        </div>
        <div className={`text-sm font-semibold ${percentTextClass}`}>{probability}%</div>
      </div>

      <div className="h-2 bg-dark-lighter rounded-full overflow-hidden mb-2">
        <div className={`h-full ${fillClass}`} style={{ width: `${probability}%` }}></div>
      </div>

      {team?.form && Array.isArray(team.form) && team.form.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-gray-text">
          Form:
          <div className="flex gap-1">
            {team.form.map((f: string, i: number) => (
              <span
                key={i}
                className={`px-1 py-0.5 rounded bg-dark-lighter ${
                  f === 'W' ? 'text-primary' : 'text-red-400'
                }`}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Thumbnail for a single event (compact)
const EventThumbnail = ({ event, onSelect, selectedId }: { event: any; onSelect: (id: string) => void; selectedId?: string | null }) => {
  const id = String(event.id ?? event.eventId ?? '');
  const teams = Array.isArray(event?.teams)
    ? event.teams
    : Array.isArray(event?.sportEvent?.teams)
    ? event.sportEvent.teams
    : [];

  const teamA = teams?.[0] || {};
  const teamB = teams?.[1] || {};

  const { probA, probB } = getTeamProbabilities(event, teams);

  const timeLabel = (() => {
    try {
      return new Date(Number(event.startDate) * 1000).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  })();

  const dateLabel = (() => {
    try {
      return new Date(Number(event.startDate) * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  })();

  const dayLabel = (() => {
    try {
      return new Date(Number(event.startDate) * 1000).toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase();
    } catch {
      return '';
    }
  })();

  const fullName = (event.name || event.eventName || event.sportEvent?.name || '').toString();
  const [sportName, teamsStr] = (() => {
    const parts = fullName.split(' - ');
    if (parts.length === 2) return [parts[0].trim(), parts[1].trim()];
    const vsIndex = fullName.toLowerCase().indexOf(' vs ');
    if (vsIndex !== -1) {
      return [
        fullName.slice(0, vsIndex).trim(),
        fullName.slice(vsIndex).trim()
      ];
    }
    return [fullName, ''];
  })();
  const name = fullName;
  return (
    <button
      onClick={() => onSelect(id)}
      aria-pressed={selectedId === id}
      className={`relative w-64 min-w-[16rem] md:w-72 md:min-w-[18rem] flex-shrink-0 rounded-xl p-3 text-left transition-all flex ${
        selectedId === id
          ? 'bg-primary/10 border border-primary ring-2 ring-primary/30 shadow-lg'
          : 'bg-dark-card border border-white/6 hover:shadow-lg hover:border-primary/30'
      }`}
    >
      {/* Left side: full-height date/time block with highlighted background */}
      <div className="flex flex-col justify-center items-start pr-3 border-r border-white/10 mr-3 bg-primary/20 rounded-lg px-3">
        <div className="text-xs font-semibold text-white">{dayLabel}</div>
        <div className="text-xs text-gray-text mt-1">{dateLabel}</div>
        <div className="text-xs text-gray-text mt-1">{timeLabel}</div>
      </div>

      {/* Right side: content */}
      <div className="flex-1 flex flex-col">
        {selectedId === id && (
          <span className="absolute top-2 right-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 shadow-md" />
            <span className="text-xs text-white">▾</span>
          </span>
        )}
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded bg-dark-lighter flex items-center justify-center text-sm overflow-hidden">
              {teamA?.imageUrl || teamA?.logoUrl ? (
                <img src={(teamA.imageUrl || teamA.logoUrl).toString()} alt={teamA.name} className="h-10 w-10 object-cover" onError={(e)=>{(e.currentTarget as HTMLImageElement).style.display='none'}} />
              ) : (
                <span className="text-sm">{(teamA?.abbreviation || teamA?.shortName || teamA?.name || 'A')[0]}</span>
              )}
            </div>
            <div className="text-sm text-white font-medium line-clamp-1">{teamA?.shortName || 'Team A'}</div>
          </div>

          <div className="flex-1 text-center text-xs text-gray-text">vs</div>

          <div className="flex items-center gap-2 justify-end">
            <div className="text-sm text-white font-medium line-clamp-1">{teamB?.shortName || 'Team B'}</div>
            <div className="h-10 w-10 rounded bg-dark-lighter flex items-center justify-center text-sm overflow-hidden">
              {teamB?.imageUrl || teamB?.logoUrl ? (
                <img src={(teamB.imageUrl || teamB.logoUrl).toString()} alt={teamB.name} className="h-10 w-10 object-cover" onError={(e)=>{(e.currentTarget as HTMLImageElement).style.display='none'}} />
              ) : (
                <span className="text-sm">{(teamB?.abbreviation || teamB?.shortName || teamB?.name || 'B')[0]}</span>
              )}
            </div>
          </div>
        </div>

          <div className="text-xs text-gray-text text-center">{sportName}</div>
        <div className="flex items-center justify-between mt-1">
          {/* <div className="text-xs text-gray-text">{sportName}</div> */}
          <div className="text-xs text-gray-text">{teamsStr}</div>
          <div className="text-xs text-white font-semibold">{Math.round(probA)}% / {Math.round(probB)}%</div>
        </div>
      </div>
    </button>
  );
};


// Horizontal strip of thumbnails
const EventThumbnailStrip = ({
  events,
  onSelect,
  selectedId,
}: {
  events: any[];
  onSelect: (id: string) => void;
  selectedId?: string | null;
}) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      setCanScrollLeft(scrollContainerRef.current.scrollLeft > 0);
      setCanScrollRight(
        scrollContainerRef.current.scrollLeft <
          scrollContainerRef.current.scrollWidth -
            scrollContainerRef.current.clientWidth -
            10
      );
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = 400;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });

    setTimeout(checkScroll, 300);
  };

  React.useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", checkScroll);
    return () => container.removeEventListener("scroll", checkScroll);
  }, []);

  if (!events || events.length === 0) return null;

  return (
    <div className="relative group h-full">
      {/* LEFT ARROW */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="
            absolute left-0 top-0 h-full z-20
            bg-dark-card/90 hover:bg-dark-card
            border border-white/20 hover:border-primary
            rounded-r-lg px-3
            transition-all flex items-center
          "
        >
          <svg
            className="w-8 h-8 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* RIGHT ARROW */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="
            absolute right-0 top-0 h-full z-20
            bg-dark-card/90 hover:bg-dark-card
            border border-white/20 hover:border-primary
            rounded-l-lg px-3
            transition-all flex items-center
          "
        >
          <svg
            className="w-8 h-8 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}

      {/* SCROLL CONTAINER */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto py-4 scrollbar-hide"
      >
        <div className="flex gap-2">
          {events.slice(0, 20).map((ev, idx) => (
            <EventThumbnail
              key={String(ev.id ?? ev.eventId ?? idx)}
              event={ev}
              onSelect={onSelect}
              selectedId={selectedId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};


// Event Card Component
const EventCard = ({ 
  event, 
  onViewQuestions, 
  onQuickPredict 
}: { 
  event: any; 
  onViewQuestions: () => void; 
  onQuickPredict: (question: any, eventId: string) => void 
}) => {
  const date = new Date(Number(event.startDate) * 1000).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const eventName =
    (typeof event?.name === 'string' && event.name.trim()) ||
    (typeof event?.eventName === 'string' && event.eventName.trim()) ||
    (typeof event?.sportEvent?.name === 'string' && event.sportEvent.name.trim()) ||
    'Event';

  const teams = Array.isArray(event?.teams)
    ? event.teams
    : Array.isArray(event?.sportEvent?.teams)
    ? event.sportEvent.teams
    : [];

  const teamA = teams?.[0] || {};
  const teamB = teams?.[1] || {};

  const { probA, probB } = getTeamProbabilities(event, teams);

  const [lastQuestionName, setLastQuestionName] = useState<string | null>(null);
  const [latestQuestion, setLatestQuestion] = useState<any | null>(null);
  const [isQLoading, setIsQLoading] = useState(false);

  useEffect(() => {
    const id = String(event.id ?? event.eventId ?? '');
    if (!id) return;

    let cancelled = false;
    const run = async () => {
      try {
        setIsQLoading(true);
        
        // Check if this is a tournament event with static questions
        if (staticTournamentQuestions[id]) {
          const qs = staticTournamentQuestions[id] || [];
          const latest = qs.length > 0 ? qs[qs.length - 1] : null;
          if (!cancelled) {
            setLastQuestionName(latest?.name || latest?.questionName || null);
            setLatestQuestion(latest || null);
          }
          return;
        }
        
        // Fall back to API for other events
        const res = await api.post('/event/v1/getevent', {
          eventId: id,
          getEventQuestions: true,
          questionsPageInfo: { pageNumber: 1, pageSize: 50 },
        });

        if (!cancelled && res?.status?.type === 'SUCCESS') {
          const qs = Array.isArray(res.questions) ? res.questions : [];
          const latest = qs.length > 0 ? qs[qs.length - 1] : null;
          setLastQuestionName(latest?.name || latest?.questionName || null);
          setLatestQuestion(latest || null);
        }
      } catch {
        if (!cancelled) setLastQuestionName(null);
      } finally {
        if (!cancelled) setIsQLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [event?.id, event?.eventId]);

  return (
    <div className="rounded-2xl border border-white/10 bg-dark-card p-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff73]/30 rounded-full -mr-16 -mt-16 pointer-events-none blur-lg"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between mb-4">
          <div className="text-sm text-gray-text font-medium">{eventName}</div>
          <div className="text-sm bg-dark-lighter px-3 py-1 rounded-full text-white">{date}</div>
        </div>

        <div className="flex items-center justify-between mb-4 gap-4">
          <div className="text-sm flex-1">
            {isQLoading ? (
              <span className="text-gray-text">Loading latest question...</span>
            ) : lastQuestionName ? (
              <button
                onClick={() => {
                  const id = String(event.id ?? event.eventId ?? '');
                  if (!id) return;
                  if (latestQuestion) {
                    onQuickPredict(latestQuestion, id);
                  } else {
                    onViewQuestions();
                  }
                }}
                className="text-left text-white hover:text-primary transition-colors line-clamp-2"
              >
                {lastQuestionName}
              </button>
            ) : (
              <span className="text-gray-text">No questions yet</span>
            )}
          </div>
          <Button onClick={onViewQuestions} className="bg-primary text-dark-bg hover:bg-primary/90 flex-shrink-0">
            View Questions
          </Button>
        </div>

        <TeamRow team={teamA} probability={probA} />
        <TeamRow team={teamB} probability={probB} />
      </div>
    </div>
  );
};

// Event Details Component
const EventDetails: React.FC<{
  eventId: string;
  onBack: () => void;
  onPredict: (question: any, eventId: string) => void;
}> = ({ eventId, onBack, onPredict }) => {
  const [event, setEvent] = useState<any | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      setIsLoading(true);
      try {
        // Check if this is a tournament event with static questions
        if (staticTournamentQuestions[eventId]) {
          // Search through all tournament events to find this one
          let staticEvent = null;
          for (const tournamentEvents of Object.values(staticTournamentEvents)) {
            const found = tournamentEvents.find((e) => e.id === eventId);
            if (found) {
              staticEvent = found;
              break;
            }
          }
          
          if (staticEvent) {
            setEvent(staticEvent);
            setQuestions(staticTournamentQuestions[eventId] || []);
            setIsLoading(false);
            return;
          }
        }

        // Fall back to API for other events
        const response = await api.post('/event/v1/getevent', {
          eventId,
          getEventQuestions: true,
          questionsPageInfo: { pageNumber: 1, pageSize: 50 },
        });

        if (response.status.type === 'SUCCESS') {
          setEvent(response.event);
          setQuestions(response.questions || []);
        }
      } catch (error) {
        console.error('Failed to fetch event details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-white/10 bg-dark-card p-6 mt-2">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-dark-lighter rounded w-1/3"></div>
          <div className="h-4 bg-dark-lighter rounded w-1/2"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-dark-lighter rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // if (!event) {
  //   return (
  //     <div className="rounded-xl border border-white/10 bg-dark-card p-6 mt-2">
  //       <button
  //         onClick={onBack}
  //         className="flex items-center text-gray-text hover:text-white mb-4 transition-colors"
  //       >
  //         <ArrowLeft className="w-5 h-5 mr-2" />
  //         Back
  //       </button>
  //       <p className="text-gray-text">Event not found</p>
  //     </div>
  //   );
  // }

  // derive teams and probabilities for display
  const teams = Array.isArray(event?.teams)
    ? event.teams
    : Array.isArray(event?.sportEvent?.teams)
    ? event.sportEvent.teams
    : [];

  const teamA = teams?.[0] || {};
  const teamB = teams?.[1] || {};

  let probA = 50;
  let probB = 50;
  try {
    const stats = JSON.parse(event.stats || '{}');
    const pred = stats.result_prediction;
    if (Array.isArray(pred) && pred.length === 2) {
      probA = Number(pred[0]?.value) || probA;
      probB = Number(pred[1]?.value) || probB;
    }
  } catch {
    // ignore
  }

  return (
    <div className="rounded-xl border border-white/10 bg-dark-card p-6 mt-2">
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <TeamRow team={teamA} probability={probA} />
        <TeamRow team={teamB} probability={probB} />
      </div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Available Predictions</h2>
        <button onClick={onBack} className="flex items-center text-gray-text hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </button>
      </div>

      {questions.length === 0 ? (
        <div className="bg-dark-lighter rounded-xl border border-white/10 p-8 text-center">
          <TrendingUp className="w-12 h-12 text-gray-text mx-auto mb-3" />
          <p className="text-gray-text">No prediction questions available yet</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {questions.map((question: any) => (
            <div
              key={question.questionId}
              className="bg-dark-lighter rounded-xl border border-white/10 p-6 hover:border-primary/30 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-base font-bold text-white mb-2">{question.name}</h3>
                  {question.description && (
                    <p className="text-gray-text text-sm">{question.description}</p>
                  )}
                </div>
              </div>

              {question.activity && (
                <div className="flex items-center space-x-6 mb-4 text-sm">
                  <div className="flex items-center text-gray-text">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span>Volume: ${Number.parseFloat(String(question.activity.questionVolume || '0')).toFixed(0)}</span>
                  </div>
                  <div className="flex items-center text-gray-text">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{question.activity.questionUsers} traders</span>
                  </div>
                </div>
              )}

              {question.activity?.marketDataDetails && question.activity.marketDataDetails.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {question.activity.marketDataDetails.map((option: any, idx: number) => (
                    <div
                      key={idx}
                      className="border border-white/10 rounded-lg p-4 hover:border-primary/30 transition-all bg-dark-bg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-white">{option.outcome}</span>
                        <span className="text-lg font-bold text-primary">
                          {Number.parseFloat(String(option.impliedProbability || '0')).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-dark-lighter rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${Number.parseFloat(String(option.impliedProbability || '0'))}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button
                onClick={() => onPredict(question, eventId)}
                className="w-full bg-primary text-dark-bg hover:bg-primary/90"
              >
                Predict
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Sports Page
export const Sports: React.FC<{ selectedSport?: string | null }> = ({ selectedSport: propSelectedSport }) => {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<any | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [exitAmount, setExitAmount] = useState<string>('');
  const [confidenceOverride, setConfidenceOverride] = useState<number | null>(null);
  const [exitConfidence, setExitConfidence] = useState<number | null>(null);
  const [selectedTeams, setSelectedTeams] = useState<{
    a: { name: string; prob: number };
    b: { name: string; prob: number };
  } | null>(null);
  console.log(selectedTeams);
  const [balance, setBalance] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'all' |'open' | 'live' | 'completed' | 'cancelled' | 'exited'>('live');
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Get current category and tournaments
  const currentCategory = selectedCategory ? staticCategories.find(c => c.id === selectedCategory) : null;

  const staticLivePredictions: Array<{ id: string; eventId: string; eventName: string; startDate: number; questionName: string; answer: string; percentage: number; amount: number; status: string; }> = [
    {
      id: 'static1',
      eventId: 'static1',
      eventName: 'DC vs DV 1st Match',
      startDate: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      questionName: 'Who will win the Toss?',
      answer: 'Dubai Capitals',
      percentage: 50,
      amount: 100,
      status: 'PREDICTION_STATUS_MATCHED',
    },
    {
      id: 'static2',
      eventId: 'static2',
      eventName: 'DC vs DV 1st Match',
      startDate: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      questionName: 'Who will win the Toss?',
      answer: 'Dubai Capitals',
      percentage: 95,
      amount: 200,
      status: 'PREDICTION_STATUS_MATCHED',
    },
    {
      id: 'static3',
      eventId: 'static3',
      eventName: 'IND vs SA 1st Match',
      startDate: Math.floor(Date.now() / 1000) + 8 * 24 * 60 * 60,
      questionName: 'Who will win the Toss?',
      answer: 'India',
      percentage: 65,
      amount: 100,
      status: 'PREDICTION_STATUS_MATCHED',
    },
    {
      id: 'open1',
      eventId: 'open1',
      eventName: 'DC vs DV 1st Match',
      startDate: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      questionName: 'Who will win the Toss?',
      answer: 'Desert Vipers',
      percentage: 80,
      amount: 66.75,
      status: 'PREDICTION_STATUS_ACCEPTED',
    },
    {
      id: 'open2',
      eventId: 'open2',
      eventName: 'DC vs DV 1st Match',
      startDate: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      questionName: 'Who will win the Toss?',
      answer: 'Desert Vipers',
      percentage: 80,
      amount: 91.75,
      status: 'PREDICTION_STATUS_ACCEPTED',
    },
    {
      id: 'open3',
      eventId: 'open3',
      eventName: 'DC vs DV 1st Match',
      startDate: Math.floor(Date.now() / 1000) + 6 * 24 * 60 * 60,
      questionName: 'Total Runs scored in First Innings?',
      answer: 'Less than 150',
      percentage: 20,
      amount: 84.6,
      status: 'PREDICTION_STATUS_ACCEPTED',
    },
        {
      id: 'exit1',
      eventId: 'exit1',
      eventName: 'MAS vs DV 21st Match',
      startDate: Math.floor(Date.now() / 1000) + 6 * 24 * 60 * 60,
      questionName: 'Total Runs scored in First Innings?',
      answer: 'Less than 120',
      percentage: 20,
      amount: 84.6,
      status: 'PREDICTION_STATUS_EXITED',
    },
       {
      id: 'cancel1',
      eventId: 'cancel1',
      eventName: 'PAS vs DV 21st Match',
      startDate: Math.floor(Date.now() / 1000) + 6 * 24 * 60 * 60,
      questionName: 'Total Runs scored in First Innings?',
      answer: 'Less than 120',
      percentage: 20,
      amount: 84.6,
      status: 'PREDICTION_STATUS_CANCELLED',
    },
     {
      id: 'complete1',
      eventId: 'complete1',
      eventName: 'SHR vs DAS 21st Match',
      startDate: Math.floor(Date.now() / 1000) + 6 * 24 * 60 * 60,
      questionName: 'Total Runs scored in First Innings?',
      answer: 'Less than 130',
      percentage: 20,
      amount: 84.6,
      status: 'PREDICTION_STATUS_SETTLED',
    },
  ];
  const [activePredictions, setActivePredictions] = useState<Array<{
    id: string;
    eventId: string;
    eventName: string;
    startDate: number;
    questionName: string;
    answer: string;
    percentage: number;
    amount: number;
    status: string;
  }>>(staticLivePredictions);
  const [selectedPrediction, setSelectedPrediction] = useState<any | null>(null);
  const [selectedAction, setSelectedAction] = useState<'cancel' | 'exit' | null>(null);
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);

  const tabs = [
    
    { id: 'all', label: 'All' },
    { id: 'open', label: 'Open' },
    { id: 'live', label: 'Live' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
    { id: 'exited', label: 'Exited' },
  ] as const;

  const formatPercent = (val: any) => {
    const raw = typeof val === 'string' ? val.replace('%', '').trim() : val;
    let n = Number(raw);
    if (!isFinite(n) || isNaN(n)) return '--%';
    if (n <= 1) n = n * 100;
    n = Math.max(0, Math.min(100, n));
    return `${Math.round(n)}%`;
  };

  const getAvailableBalance = (b: any) => {
    const candidates = [b?.availableBalance, b?.available, b?.balance?.available];
    for (const c of candidates) {
      const n = Number(c);
      if (!isNaN(n) && isFinite(n)) return n;
    }
    return 0;
  };

  const formatCurrency = (n: number) => `$${n.toFixed(2)}`;

  const fetchBalance = async () => {
    try {
      const res = await api.post('/balances/v1/get', {});
      if (res?.status?.type === 'SUCCESS') {
        setBalance(res);
      }
    } catch (e) {
      console.error('Failed to fetch balance', e);
    }
  };

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await api.post('/event/v1/listevents', {
        status: ['EVENT_STATUS_UPCOMING', 'EVENT_STATUS_ACTIVE', 'EVENT_STATUS_COMPLETED'],
        category: 'EVENT_CATEGORY_SPORTS',
        pageNumber: 1,
        pageSize: 50,
      });

      if (response?.status?.type === 'SUCCESS') {
        setEvents(response.events || []);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    let matchesStatus = true;
    let matchesSport = true;

    const eventTime = event.startDate * 1000;
    const now = Date.now();

    if (activeTab === 'live') {
      matchesStatus = now - eventTime < 3600000 && eventTime - now < 1800000;
    }else if (activeTab === 'all') {
      matchesStatus = eventTime == eventTime;
    } else if (activeTab === 'open') {
      matchesStatus = eventTime > now;
    } else if (activeTab === 'completed') {
      matchesStatus = now - eventTime >= 3600000;
    } else if (activeTab === 'cancelled') {
      matchesStatus = event.status === 'EVENT_STATUS_CANCELLED' || event.eventStatus === 'CANCELLED';
    } else if (activeTab === 'exited') {
      matchesStatus = event.status === 'EVENT_STATUS_EXITED' || event.eventStatus === 'EXITED';
    }

    if (selectedSport) {
      const eventName = (event.name || '').toLowerCase();
      matchesSport = eventName.includes(selectedSport.toLowerCase());
    }

    return matchesStatus && matchesSport;
  });

  const handleMakePrediction = async () => {
    setErrorMsg('');

    if (!selectedQuestion) {
      setErrorMsg('Please select a question first');
      return;
    }

    if (!selectedOutcome) {
      setErrorMsg('Please select an outcome (Yes or No)');
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setErrorMsg('Please enter a valid amount');
      return;
    }

    const amt = Number(amount);
    if (balance && amt > getAvailableBalance(balance)) {
      setErrorMsg('Insufficient balance');
      return;
    }

    setIsSubmitting(true);
    try {
      const qpText = String(selectedQuestion?.activity?.questionProbability || '');
      const m = qpText.match(/(\d+(?:\.\d+)?)\s*%/);
      const defaultPct = m ? Math.max(0, Math.min(100, Number(m[1]))) : 0;
      const impliedPct = Math.max(
        0,
        Math.min(100, Number.parseFloat(String(selectedOutcome?.impliedProbability || '0')) || 0)
      );
      const confPct = confidenceOverride ?? impliedPct ?? defaultPct;

      const res = await api.post('/order/v1/createorder', {
        eventId: selectedEventId,
        questionId: selectedQuestion.questionId,
        amount: amount,
        predictionDetails: {
          selectedPredictionOutcome: selectedOutcome.outcome,
          selectedPredictionChoice: true,
        },
        modifiers: {
          creditDiscount: '0',
          creditMarkup: '0',
          percentage: String(confPct),
          updatedPercentage: '0',
        },
      });

      if (res?.status?.type === 'SUCCESS') {
        setSuccessMessage('Prediction created successfully!');
        const evt = events.find(e => String(e.id ?? e.eventId ?? '') === String(selectedEventId));
        const evtName = (evt?.name || evt?.eventName || evt?.sportEvent?.name || 'Event') as string;
        setActivePredictions(prev => [
          ...prev,
          {
            id: String(res.orderId ?? Math.random().toString(36).slice(2)),
            eventId: String(selectedEventId),
            eventName: evtName,
            startDate: Number(evt?.startDate ?? 0),
            questionName: String(selectedQuestion?.name ?? ''),
            answer: String(selectedOutcome?.outcome ?? ''),
            percentage: Number(confPct),
            amount: Number(amt),
            status: 'PREDICTION_STATUS_MATCHED',
          }
        ]);
        setSelectedOutcome(null);
        setAmount('');
        setSelectedQuestion(null);
        setSelectedEventId(null);
        setErrorMsg('');
        fetchBalance();
      } else {
        setErrorMsg('Failed to create prediction');
      }
    } catch (e) {
      console.error('Failed to create prediction', e);
      setErrorMsg('Failed to create prediction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatStartsIn = (startDateSeconds: number) => {
    const ms = startDateSeconds * 1000 - Date.now();
    if (ms <= 0) return 'Match live';
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    if (days >= 1) return `Match starts in ${days} day${days > 1 ? 's' : ''}`;
    const hours = Math.floor(ms / (60 * 60 * 1000));
    if (hours >= 1) return `Match starts in ${hours} hour${hours > 1 ? 's' : ''}`;
    const minutes = Math.floor(ms / (60 * 1000));
    return `Match starts in ${minutes} minute${minutes > 1 ? 's' : ''}`;
  };

  const handleExitPrediction = (id: string) => {
    setActivePredictions(prev => prev.map(p => (p.id === id ? { ...p, status: 'PREDICTION_STATUS_EXITED' } : p)));
    setSuccessMessage('Prediction exited');
    setSelectedAction(null);
    setSelectedPrediction(null);
  };

  const handleCancelPrediction = (id: string) => {
    setActivePredictions(prev => prev.map(p => (p.id === id ? { ...p, status: 'PREDICTION_STATUS_CANCELLED' } : p)));
    setSuccessMessage('Prediction cancelled');
    setSelectedAction(null);
    setSelectedPrediction(null);
  };

  const matchesTabStatus = (tab: typeof activeTab, s: string) => {
    if (tab === 'live') return s === 'PREDICTION_STATUS_MATCHED';
    if (tab === 'open') return s === 'PREDICTION_STATUS_ACCEPTED';
    if (tab === 'completed') return s === 'PREDICTION_STATUS_SETTLED';
    if (tab === 'cancelled') return s === 'PREDICTION_STATUS_CANCELLED';
    if (tab === 'exited') return s === 'PREDICTION_STATUS_EXITED';
    return true;
  };

  const statusLabel = (s: string) => {
    if (s === 'PREDICTION_STATUS_MATCHED') return 'Matched';
    if (s === 'PREDICTION_STATUS_ACCEPTED') return 'Accepted';
    if (s === 'PREDICTION_STATUS_CANCEL_REQUESTED') return 'Cancel Requested';
    if (s === 'PREDICTION_STATUS_SETTLED') return 'Settled';
    if (s === 'PREDICTION_STATUS_CANCELLED') return 'Cancelled';
    if (s === 'PREDICTION_STATUS_EXITED') return 'Exited';
    return '—';
  };

  const filteredPredictionsByTab = activePredictions.filter(p => matchesTabStatus(activeTab, p.status));

  return (
    <div className="min-h-screen bg-dark-bg text-gray-light">
      <PageHeader
        title=""
        tagline=""
        compact={true}
        isSubpage={true}
      />

      <div className="px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-[1400px] mx-auto">
          {/* Determine which events to show in thumbnail strip */}
          {(() => {
            let displayEvents = events;
            
            if (selectedTournament && staticTournamentEvents[selectedTournament]) {
              displayEvents = staticTournamentEvents[selectedTournament];
            }
            
            return (
              <EventThumbnailStrip
                events={displayEvents}
                selectedId={selectedEventId}
                onSelect={(id: string) => {
                  setSelectedEventId(id);
                  try {
                    window.scrollTo({ top: 200, behavior: 'smooth' });
                  } catch {}
                }}
              />
            );
          })()}

          {/* {selectedEventId && (
            <div className="mb-7">
              <button
                onClick={() => {
                  setSelectedEventId(null);
                  setSelectedQuestion(null);
                  setSelectedOutcome(null);
                  setConfidenceOverride(null);
                  setAmount('');
                  setSelectedTeams(null);
                  setBalance(null);
                  setErrorMsg('');
                  setExitAmount('');
                  setExitConfidence(null);
                  setIsMobilePanelOpen(false);
                  setActiveTab('all');
                }}
                className="flex items-center text-gray-text hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
            </div>
          )} */}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Categories and Tournaments */}
            <aside className="w-full lg:w-64 lg:flex-shrink-0">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sticky top-24">
                <h3 className="text-sm font-semibold text-white mb-3">Sports</h3>
                <ul className="space-y-2">
                  <li
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedTournament(null);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all cursor-pointer ${
                      selectedCategory === null
                        ? 'bg-primary/20 text-primary'
                        : 'text-gray-text hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🎯</span>
                      <span className="text-sm">All Sports</span>
                    </div>
                    <span className="text-xs bg-dark-card px-2 py-0.5 rounded text-white">{events.length}</span>
                  </li>
                  {staticCategories.map((cat) => (
                    <div key={cat.id}>
                      <li
                        onClick={() => {
                          if (selectedCategory === cat.id) {
                            setSelectedCategory(null);
                            setSelectedTournament(null);
                          } else {
                            setSelectedCategory(cat.id);
                            setSelectedTournament(null);
                          }
                        }}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all cursor-pointer ${
                          selectedCategory === cat.id
                            ? 'bg-primary/20 text-primary'
                            : 'text-gray-text hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{cat.emoji}</span>
                          <span className="text-sm font-medium">{cat.name}</span>
                        </div>
                        <span className={`text-xs transition-transform ${selectedCategory === cat.id ? 'rotate-180' : ''}`}>▼</span>
                      </li>
                      {selectedCategory === cat.id && (
                        <ul className="pl-10 mt-1 space-y-1 border-l border-white/10">
                          {cat.tournaments.map((tournament) => (
                            <li
                              key={tournament.id}
                              onClick={() => setSelectedTournament(tournament.id)}
                              className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all cursor-pointer text-sm ${
                                selectedTournament === tournament.id
                                  ? 'bg-primary/20 text-primary'
                                  : 'text-gray-text hover:bg-white/5'
                              }`}
                            >
                              <span>{tournament.name}</span>
                              <span className="text-xs bg-dark-card px-2 py-0.5 rounded text-white">{tournament.eventCount}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              {/* Horizontal Tabs */}
              {!selectedEventId && (
                <div className="mb-8 overflow-x-auto">
                  <div className="flex gap-2 border-b border-white/10 pb-0">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
                          activeTab === tab.id
                            ? 'text-primary border-b-primary'
                            : 'text-gray-text border-b-transparent hover:text-white'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedEventId ? (
                <EventDetails
                  eventId={String(selectedEventId)}
                  onBack={() => {
                    setSelectedEventId(null);
                    setSelectedQuestion(null);
                    setSelectedOutcome(null);
                    setConfidenceOverride(null);
                    setAmount('');
                    setSelectedTeams(null);
                    setBalance(null);
                    setErrorMsg('');
                    setExitAmount('');
                    setExitConfidence(null);
                    setIsMobilePanelOpen(false);
                    setActiveTab('all');
                  }}
                  onPredict={(question, evId?: string, predictionId?: string) => {
                    const id = String(evId ?? selectedEventId ?? '');
                    setSelectedEventId(id);
                    setSelectedQuestion(question);
                    setSelectedOutcome(null);
                    setConfidenceOverride(null);
                    setAmount('');
                    setErrorMsg('');
                    setExitAmount('');
                    setExitConfidence(null);
                    setSelectedAction(null);
                    setSelectedPrediction(null);
                    setSuccessMessage(null);
                    fetchBalance();
                    setIsMobilePanelOpen(true);
                  }}
                />
              ) : selectedTournament && staticTournamentEvents[selectedTournament] ? (
                // Show tournament-specific events
                <div className="space-y-6">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {currentCategory?.tournaments.find(t => t.id === selectedTournament)?.name}
                    </h2>
                    <p className="text-gray-text">Events from {currentCategory?.name}</p>
                  </div>

                  {activeTab === 'all' && staticTournamentEvents[selectedTournament].length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-text">No events available for this tournament</p>
                    </div>
                  ) : activeTab === 'all' ? (
                    <div className="space-y-6">
                      {staticTournamentEvents[selectedTournament].map((event, i) => (
                        <div key={i} className="space-y-3">
                          <EventCard
                            event={event}
                            onViewQuestions={() => {
                              const id = String(event.id ?? event.eventId ?? '');
                              setSelectedEventId(id);
                              setSelectedQuestion(null);
                              setSelectedOutcome(null);
                              setConfidenceOverride(null);
                              setAmount('');
                              setExitAmount('');
                              setSelectedAction(null);
                              setSelectedPrediction(null);
                              setSuccessMessage(null);
                            }}
                            onQuickPredict={(question, eventId) => {
                              const id = String(event.id ?? event.eventId ?? eventId ?? '');
                              setSelectedEventId(id);
                              setSelectedQuestion(question);
                              setSelectedOutcome(null);
                              setConfidenceOverride(null);
                              setAmount('');
                              setErrorMsg('');
                              setExitAmount('');
                              setExitConfidence(null);
                              setSelectedAction(null);
                              setSelectedPrediction(null);
                              setSuccessMessage(null);
                              fetchBalance();
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  ) : !filteredPredictionsByTab || filteredPredictionsByTab.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-text">No {activeTab} predictions for this tournament</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredPredictionsByTab.map((p) => (
                        <div key={p.id} className="rounded-2xl border border-white/10 bg-dark-card p-6 overflow-hidden">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-white font-semibold mb-1">{p.eventName}</div>
                              <div className="text-sm text-white mb-2">{p.questionName}</div>
                              <div className="flex items-center gap-2 text-sm text-gray-text">
                                <span className="text-white font-medium">{p.answer}</span>
                                <span>•</span>
                                <span className="text-primary font-semibold">{formatPercent(p.percentage)}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {p.amount}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge variant="secondary" className="text-red-300">{formatStartsIn(p.startDate)}</Badge>
                              <Badge className="text-green-300">{statusLabel(p.status)}</Badge>
                            </div>
                          </div>
                          <div className="mt-4">
                            {activeTab === 'open' && p.status === 'PREDICTION_STATUS_ACCEPTED' ? (
                              <Button variant="outline" onClick={() => { setSelectedPrediction(p); setSelectedAction('cancel'); setExitAmount(''); setIsMobilePanelOpen(true); }} className="hover:border-primary/40">Cancel</Button>
                            ) : activeTab === 'live' ? (
                              <Button onClick={() => { setSelectedPrediction(p); setSelectedAction('exit'); setExitAmount(String(p.amount ?? '')); setExitConfidence(Number.parseFloat(String(p.percentage ?? 0))); setIsMobilePanelOpen(true); }} className="bg-yellow-500 text-dark-bg hover:bg-yellow-400">Exit</Button>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : isLoading ? (
                <div className="text-center py-12">
                  <p className="text-gray-text">Loading events...</p>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-text">
                    {events.length === 0
                      ? 'No events available'
                      : `No ${activeTab} events${selectedSport ? ` for ${selectedSport}` : ''}`}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredEvents.map((event, i) => (
                    <div key={i} className="space-y-3">
                      <EventCard
                        event={event}
                        onViewQuestions={() => {
                          const id = String(event.id ?? event.eventId ?? '');
                          setSelectedEventId(id);
                          setSelectedQuestion(null);
                          setSelectedOutcome(null);
                          setConfidenceOverride(null);
                          setAmount('');
                          setExitAmount('');
                          setSelectedAction(null);
                          setSelectedPrediction(null);
                          setSuccessMessage(null);
                        }}
                        onQuickPredict={(question, eventId) => {
                          const id = String(event.id ?? event.eventId ?? eventId ?? '');
                          setSelectedEventId(id);
                          setSelectedQuestion(question);
                          setSelectedOutcome(null);
                          setConfidenceOverride(null);
                          setAmount('');
                          setErrorMsg('');
                          setExitAmount('');
                          setExitConfidence(null);
                          setSelectedAction(null);
                          setSelectedPrediction(null);
                          setSuccessMessage(null);
                          fetchBalance();
                        }}
                      />
                      {selectedEventId === String(event.id ?? event.eventId ?? '') && (
                        <EventDetails
                          eventId={String(event.id ?? event.eventId ?? '')}
                          onBack={() => {
                            setSelectedEventId(null);
                            setSelectedQuestion(null);
                            setSelectedOutcome(null);
                            setConfidenceOverride(null);
                            setAmount('');
                            setSelectedTeams(null);
                            setBalance(null);
                            setErrorMsg('');
                            setExitAmount('');
                            setExitConfidence(null);
                            setIsMobilePanelOpen(false);
                          }}
                          onPredict={(question, evId?: string, predictionId?: string) => {
                            const id = String(evId ?? event.id ?? event.eventId ?? '');
                            setSelectedEventId(id);
                            setSelectedQuestion(question);
                            setSelectedOutcome(null);
                            setConfidenceOverride(null);
                            setAmount('');
                            setErrorMsg('');
                            setExitAmount('');
                            setExitConfidence(null);
                            setSelectedAction(null);
                            setSelectedPrediction(null);
                            setSuccessMessage(null);
                            fetchBalance();
                            setIsMobilePanelOpen(true);
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </main>

            {/* Right Sidebar - Prediction Panel */}
            <aside className="w-96 flex-shrink-0 hidden lg:block">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
                <h3 className="text-sm text-gray-text mb-1">{selectedAction === 'exit' ? 'Exit Prediction' : selectedAction === 'cancel' ? 'Cancel Prediction' : 'Make Your Prediction'}</h3>
                <p className="text-xs text-gray-muted mb-4">Own your call. Trade with confidence.</p>

                {successMessage ? (
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/20 rounded-full mb-3">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <h4 className="text-white font-semibold mb-2">Success!</h4>
                    <p className="text-gray-text text-sm mb-6">{successMessage}</p>
                    <button
                      onClick={() => {
                        setSuccessMessage(null);
                        setSelectedQuestion(null);
                        setSelectedOutcome(null);
                        setAmount('');
                        setConfidenceOverride(null);
                        setSelectedEventId(null);
                        setErrorMsg('');
                        setSelectedTeams(null);
                        setBalance(null);
                        setExitAmount('');
                        setExitConfidence(null);
                        setIsMobilePanelOpen(false);
                      }}
                      className="w-full py-3 bg-primary text-dark-bg hover:bg-primary/90 rounded-lg font-semibold transition-all"
                    >
                      Ok
                    </button>
                  </div>
                )  : selectedAction && selectedPrediction ? (
                  <div className="space-y-4">
                    <div className="bg-dark-card border border-white/10 p-4 rounded-lg">
                      <div className="text-sm text-white font-semibold mb-1">{selectedPrediction.questionName}</div>
                      <div className="text-xs text-gray-text">{selectedPrediction.eventName}</div>
                      <div className="text-xs text-gray-text mt-2">{selectedPrediction.answer} • {formatPercent(exitConfidence ?? selectedPrediction.percentage)} • {formatCurrency(Number(selectedPrediction.amount))}</div>
                    </div>

                    {balance && (
                      <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white">Available Balance</span>
                          <span className="text-primary font-semibold">{formatCurrency(getAvailableBalance(balance))}</span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <div className={`p-3 rounded-lg border transition-all text-sm font-medium border-white/10 bg-dark-card text-white`}>
                        {selectedPrediction.answer}
                        <div className="text-xs text-gray-text mt-1">{formatPercent(exitConfidence ?? selectedPrediction.percentage)}</div>
                      </div>
                      <div className={`p-3 rounded-lg border transition-all text-sm font-medium border-white/10 bg-dark-card text-white`}>
                        Amount
                        <div className="text-xs text-gray-text mt-1">{formatCurrency(selectedAction === 'exit' ? Number(exitAmount || 0) : Number(selectedPrediction.amount))}</div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-text">Confidence</span>
                        <span className="text-xs text-white font-semibold">{formatPercent(exitConfidence ?? selectedPrediction.percentage)}</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={Math.max(0, Math.min(100, Number(selectedAction === 'exit' ? (exitConfidence ?? Number.parseFloat(String(selectedPrediction.percentage || 0))) : Number(selectedPrediction.percentage) || 0)))}
                        disabled={selectedAction !== 'exit'}
                        onChange={(e) => selectedAction === 'exit' && setExitConfidence(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-text mb-2">Amount</label>
                      <input
                        className="w-full rounded-lg bg-dark-card border border-white/10 p-3 text-white placeholder:text-gray-muted focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all"
                        type="number"
                        step="0.01"
                        min="0"
                        value={selectedAction === 'exit' ? exitAmount : String(selectedPrediction.amount ?? '')}
                        onChange={(e) => selectedAction === 'exit' && setExitAmount(e.target.value)}
                        disabled={selectedAction !== 'exit'}
                        placeholder="$100"
                      />
                      {selectedAction === 'exit' ? (
                        <div className="mt-2 text-xs text-gray-text">
                          Remaining: {formatCurrency(Math.max(0, Number(selectedPrediction.amount) - Number(exitAmount || 0)))}
                        </div>
                      ) : (
                        balance && selectedPrediction.amount && Number(selectedPrediction.amount) > 0 && (
                          <div className="mt-2 text-xs text-gray-text">
                            Remaining: {formatCurrency(Math.max(0, getAvailableBalance(balance) - Number(selectedPrediction.amount)))}
                          </div>
                        )
                      )}
                      <div className="mt-3 grid grid-cols-4 gap-2">
                        {(['10', '50', '100', '500'] as const).map((v) => (
                          <button
                            key={v}
                            disabled={selectedAction !== 'exit'}
                            onClick={() => selectedAction === 'exit' && setExitAmount(String(Math.min(Number(v), Number(selectedPrediction.amount || 0))))}
                            className={`py-2 rounded-lg bg-dark-card border border-white/10 text-sm text-white ${selectedAction !== 'exit' ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/30'}`}
                          >
                            ${v}
                          </button>
                        ))}
                      </div>
                    </div>

                    {(selectedAction === 'exit' ? Number(exitAmount) > 0 : Number(selectedPrediction.amount) > 0) && (
                      <div className="bg-dark-card border border-white/10 rounded-lg p-3">
                        <h4 className="text-sm text-white font-semibold mb-3">Potential Returns</h4>
                        {(() => {
                          const impliedPct = Math.max(
                            0,
                            Math.min(100, Number.parseFloat(String(selectedPrediction.percentage || '0')) || 0)
                          );
                          const confPct = selectedAction === 'exit' ? (exitConfidence ?? impliedPct) : impliedPct;
                          const amt = Number(selectedAction === 'exit' ? exitAmount || 0 : selectedPrediction.amount);
                          const profit = (amt * confPct) / 100;
                          const totalReturn = amt + profit;

                          return (
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-text">Investment</span>
                                <span className="text-white font-medium">{formatCurrency(amt)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-text">Prediction</span>
                                <span className="text-white font-medium">{formatPercent(confPct)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-text">Potential Profit</span>
                                <span className="text-primary font-semibold">+{formatCurrency(profit)}</span>
                              </div>
                              <div className="flex justify-between pt-2 border-t border-white/10">
                                <span className="text-white">Total Return</span>
                                <span className="text-white font-semibold">{formatCurrency(totalReturn)}</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    <button
                      onClick={() => (selectedAction === 'cancel' ? handleCancelPrediction(selectedPrediction.id) : handleExitPrediction(selectedPrediction.id))}
                      className={`w-full py-3 rounded-lg font-semibold transition-all ${selectedAction === 'cancel' ? 'bg-dark-card text-white border border-white/10 hover:border-primary/30' : 'bg-yellow-500 text-dark-bg hover:bg-yellow-400'}`}
                    >
                      {selectedAction === 'cancel' ? 'Cancel Prediction' : 'Exit Prediction'}
                    </button>
                  </div>
                )  : selectedQuestion ? (
                  <div className="space-y-4">
                    <div className="bg-dark-card border border-white/10 p-4 rounded-lg">
                      <div className="text-sm text-white font-semibold mb-1">{selectedQuestion.name}</div>
                      {selectedQuestion.category && (
                        <div className="text-xs text-gray-text">{selectedQuestion.category}</div>
                      )}
                    </div>

                    {balance && (
                      <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white">Available Balance</span>
                          <span className="text-primary font-semibold">{formatCurrency(getAvailableBalance(balance))}</span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      {selectedQuestion.activity?.marketDataDetails?.map((option: any, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedOutcome(option);
                            setConfidenceOverride(null);
                          }}
                          className={`p-3 rounded-lg border transition-all text-sm font-medium ${
                            selectedOutcome?.outcome === option.outcome
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-white/10 bg-dark-card text-white hover:border-primary/30'
                          }`}
                        >
                          {option.outcome}
                          <div className="text-xs text-gray-text mt-1">
                            {Number.parseFloat(String(option.impliedProbability || '0')).toFixed(1)}%
                          </div>
                        </button>
                      ))}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-text">Confidence</span>
                        <span className="text-xs text-white font-semibold">
                          {formatPercent(
                            confidenceOverride ??
                              (selectedOutcome
                                ? Number.parseFloat(String(selectedOutcome?.impliedProbability || '0'))
                                : 0)
                          )}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={
                          confidenceOverride ??
                          (selectedOutcome
                            ? Number.parseFloat(String(selectedOutcome?.impliedProbability || '0'))
                            : 0)
                        }
                        onChange={(e) => setConfidenceOverride(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    {errorMsg && (
                      <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-3 py-2 rounded flex items-start text-sm gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs text-gray-text mb-2">Amount</label>
                      <input
                        className="w-full rounded-lg bg-dark-card border border-white/10 p-3 text-white placeholder:text-gray-muted focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all"
                        type="number"
                        step="0.01"
                        min="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="$100"
                      />
                      {balance && amount && Number(amount) > 0 && (
                        <div className="mt-2 text-xs text-gray-text">
                          Remaining: {formatCurrency(Math.max(0, getAvailableBalance(balance) - Number(amount)))}
                        </div>
                      )}
                      <div className="mt-3 grid grid-cols-4 gap-2">
                        {(['10', '50', '100', '500'] as const).map((v) => (
                          <button
                            key={v}
                            onClick={() => setAmount(v)}
                            className="py-2 rounded-lg bg-dark-card border border-white/10 text-sm text-white hover:border-primary/30 transition-all"
                          >
                            ${v}
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedOutcome && amount && Number(amount) > 0 && (
                      <div className="bg-dark-card border border-white/10 rounded-lg p-3">
                        <h4 className="text-sm text-white font-semibold mb-3">Potential Returns</h4>
                        {(() => {
                          const impliedPct = Math.max(
                            0,
                            Math.min(100, Number.parseFloat(String(selectedOutcome?.impliedProbability || '0')) || 0)
                          );
                          const confPct = confidenceOverride ?? impliedPct;
                          const amt = Number(amount);
                          const profit = (amt * confPct) / 100;
                          const totalReturn = amt + profit;

                          return (
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-text">Investment</span>
                                <span className="text-white font-medium">{formatCurrency(amt)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-text">Prediction</span>
                                <span className="text-white font-medium">{formatPercent(confPct)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-text">Potential Profit</span>
                                <span className="text-primary font-semibold">+{formatCurrency(profit)}</span>
                              </div>
                              <div className="flex justify-between pt-2 border-t border-white/10">
                                <span className="text-white">Total Return</span>
                                <span className="text-white font-semibold">{formatCurrency(totalReturn)}</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    <button
                      onClick={handleMakePrediction}
                      disabled={!selectedOutcome || !amount || Number(amount) <= 0 || isSubmitting}
                      className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                        !selectedOutcome || !amount || Number(amount) <= 0 || isSubmitting
                          ? 'bg-gray-muted text-gray-text cursor-not-allowed opacity-50'
                          : 'bg-primary text-dark-bg hover:bg-primary/90 cursor-pointer'
                      }`}
                    >
                      {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      {isSubmitting ? (
                        'Submitting...'
                      ) : !selectedOutcome ? (
                        'Select an outcome'
                      ) : !amount || Number(amount) <= 0 ? (
                        'Enter amount'
                      ) : (
                        'Make Prediction'
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="text-gray-text text-sm text-center py-8">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Select a question from the events to start your prediction.</p>
                  </div>
                )}
              </div>
            </aside>
            <div className="lg:hidden">
              <Dialog open={isMobilePanelOpen} onOpenChange={setIsMobilePanelOpen}>
                <DialogContent className="max-w-lg w-full">
                  {successMessage ? (
                    <div className="text-center py-4">
                      <div className="mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/20 rounded-full mb-3">
                          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <h4 className="text-white font-semibold mb-2">Success!</h4>
                      <p className="text-gray-text text-sm mb-6">{successMessage}</p>
                      <button
                      onClick={() => {
                        setSuccessMessage(null);
                        setSelectedQuestion(null);
                        setSelectedOutcome(null);
                        setAmount('');
                        setConfidenceOverride(null);
                        setSelectedEventId(null);
                        setErrorMsg('');
                        setSelectedTeams(null);
                        setBalance(null);
                        setExitAmount('');
                        setExitConfidence(null);
                        setIsMobilePanelOpen(false);
                      }}
                        className="w-full py-3 bg-primary text-dark-bg hover:bg-primary/90 rounded-lg font-semibold transition-all"
                      >
                        Ok
                      </button>
                    </div>
                  ) : selectedAction && selectedPrediction ? (
                    <div className="space-y-4">
                      <div className="bg-dark-card border border-white/10 p-4 rounded-lg">
                        <div className="text-sm text-white font-semibold mb-1">{selectedPrediction.questionName}</div>
                        <div className="text-xs text-gray-text">{selectedPrediction.eventName}</div>
                        <div className="text-xs text-gray-text mt-2">{selectedPrediction.answer} • {formatPercent(exitConfidence ?? selectedPrediction.percentage)} • {formatCurrency(selectedAction === 'exit' ? Number(exitAmount || 0) : Number(selectedPrediction.amount))}</div>
                      </div>

                      {balance && (
                        <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-white">Available Balance</span>
                            <span className="text-primary font-semibold">{formatCurrency(getAvailableBalance(balance))}</span>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <div className={`p-3 rounded-lg border transition-all text-sm font-medium border-white/10 bg-dark-card text-white`}>
                          {selectedPrediction.answer}
                          <div className="text-xs text-gray-text mt-1">{formatPercent(exitConfidence ?? selectedPrediction.percentage)}</div>
                        </div>
                        <div className={`p-3 rounded-lg border transition-all text-sm font-medium border-white/10 bg-dark-card text-white`}>
                          Amount
                          <div className="text-xs text-gray-text mt-1">{formatCurrency(selectedAction === 'exit' ? Number(exitAmount || 0) : Number(selectedPrediction.amount))}</div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-text">Confidence</span>
                          <span className="text-xs text-white font-semibold">{formatPercent(exitConfidence ?? selectedPrediction.percentage)}</span>
                        </div>
                        <input type="range" min={0} max={100} value={Math.max(0, Math.min(100, Number(selectedAction === 'exit' ? (exitConfidence ?? Number.parseFloat(String(selectedPrediction.percentage || 0))) : Number(selectedPrediction.percentage) || 0)))} disabled={selectedAction !== 'exit'} onChange={(e) => selectedAction === 'exit' && setExitConfidence(Number(e.target.value))} className="w-full" />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-text mb-2">Amount</label>
                        <input className="w-full rounded-lg bg-dark-card border border-white/10 p-3 text-white placeholder:text-gray-muted focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all" type="number" step="0.01" min="0" value={selectedAction === 'exit' ? exitAmount : String(selectedPrediction.amount ?? '')} onChange={(e) => selectedAction === 'exit' && setExitAmount(e.target.value)} disabled={selectedAction !== 'exit'} placeholder="$100" />
                        {selectedAction === 'exit' ? (
                          <div className="mt-2 text-xs text-gray-text">
                            Remaining: {formatCurrency(Math.max(0, Number(selectedPrediction.amount) - Number(exitAmount || 0)))}
                          </div>
                        ) : (
                          balance && selectedPrediction.amount && Number(selectedPrediction.amount) > 0 && (
                            <div className="mt-2 text-xs text-gray-text">
                              Remaining: {formatCurrency(Math.max(0, getAvailableBalance(balance) - Number(selectedPrediction.amount)))}
                            </div>
                          )
                        )}
                      </div>

                      {(selectedAction === 'exit' ? Number(exitAmount) > 0 : Number(selectedPrediction.amount) > 0) && (
                        <div className="bg-dark-card border border-white/10 rounded-lg p-3">
                          <h4 className="text-sm text-white font-semibold mb-3">Potential Returns</h4>
                          {(() => {
                            const impliedPct = Math.max(0, Math.min(100, Number.parseFloat(String(selectedPrediction.percentage || '0')) || 0));
                          const confPct = selectedAction === 'exit' ? (exitConfidence ?? impliedPct) : impliedPct;
                          const amt = Number(selectedAction === 'exit' ? exitAmount || 0 : selectedPrediction.amount);
                          const profit = (amt * confPct) / 100;
                          const totalReturn = amt + profit;
                            return (
                              <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-gray-text">Investment</span>
                                  <span className="text-white font-medium">{formatCurrency(amt)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-text">Prediction</span>
                                  <span className="text-white font-medium">{formatPercent(confPct)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-text">Potential Profit</span>
                                  <span className="text-primary font-semibold">+{formatCurrency(profit)}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-white/10">
                                  <span className="text-white">Total Return</span>
                                  <span className="text-white font-semibold">{formatCurrency(totalReturn)}</span>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      <button onClick={() => (selectedAction === 'cancel' ? handleCancelPrediction(selectedPrediction.id) : handleExitPrediction(selectedPrediction.id))} className={`w-full py-3 rounded-lg font-semibold transition-all ${selectedAction === 'cancel' ? 'bg-dark-card text-white border border-white/10 hover:border-primary/30' : 'bg-yellow-500 text-dark-bg hover:bg-yellow-400'}`}>
                        {selectedAction === 'cancel' ? 'Cancel Prediction' : 'Exit Prediction'}
                      </button>
                    </div>
                  ) : selectedQuestion ? (
                    <div className="space-y-4">
                      <div className="bg-dark-card border border-white/10 p-4 rounded-lg">
                        <div className="text-sm text-white font-semibold mb-1">{selectedQuestion.name}</div>
                        {selectedQuestion.category && (
                          <div className="text-xs text-gray-text">{selectedQuestion.category}</div>
                        )}
                      </div>

                      {balance && (
                        <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-white">Available Balance</span>
                            <span className="text-primary font-semibold">{formatCurrency(getAvailableBalance(balance))}</span>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        {selectedQuestion.activity?.marketDataDetails?.map((option: any, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedOutcome(option);
                              setConfidenceOverride(null);
                            }}
                            className={`p-3 rounded-lg border transition-all text-sm font-medium ${
                              selectedOutcome?.outcome === option.outcome
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-white/10 bg-dark-card text-white hover:border-primary/30'
                            }`}
                          >
                            {option.outcome}
                            <div className="text-xs text-gray-text mt-1">
                              {Number.parseFloat(String(option.impliedProbability || '0')).toFixed(1)}%
                            </div>
                          </button>
                        ))}
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-text">Confidence</span>
                          <span className="text-xs text-white font-semibold">
                            {formatPercent(
                              confidenceOverride ??
                                (selectedOutcome
                                  ? Number.parseFloat(String(selectedOutcome?.impliedProbability || '0'))
                                  : 0)
                            )}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={
                            confidenceOverride ??
                            (selectedOutcome
                              ? Number.parseFloat(String(selectedOutcome?.impliedProbability || '0'))
                              : 0)
                          }
                          onChange={(e) => setConfidenceOverride(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      {errorMsg && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-3 py-2 rounded flex items-start text-sm gap-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span>{errorMsg}</span>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs text-gray-text mb-2">Amount</label>
                        <input
                          className="w-full rounded-lg bg-dark-card border border-white/10 p-3 text-white placeholder:text-gray-muted focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all"
                          type="number"
                          step="0.01"
                          min="0"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="$100"
                        />
                        {balance && amount && Number(amount) > 0 && (
                          <div className="mt-2 text-xs text-gray-text">
                            Remaining: {formatCurrency(Math.max(0, getAvailableBalance(balance) - Number(amount)))}
                          </div>
                        )}
                      </div>

                      {selectedOutcome && amount && Number(amount) > 0 && (
                        <div className="bg-dark-card border border-white/10 rounded-lg p-3">
                          <h4 className="text-sm text-white font-semibold mb-3">Potential Returns</h4>
                          {(() => {
                            const impliedPct = Math.max(0, Math.min(100, Number.parseFloat(String(selectedOutcome?.impliedProbability || '0')) || 0));
                            const confPct = confidenceOverride ?? impliedPct;
                            const amt = Number(amount);
                            const profit = (amt * confPct) / 100;
                            const totalReturn = amt + profit;
                            return (
                              <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-gray-text">Investment</span>
                                  <span className="text-white font-medium">{formatCurrency(amt)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-text">Prediction</span>
                                  <span className="text-white font-medium">{formatPercent(confPct)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-text">Potential Profit</span>
                                  <span className="text-primary font-semibold">+{formatCurrency(profit)}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-white/10">
                                  <span className="text-white">Total Return</span>
                                  <span className="text-white font-semibold">{formatCurrency(totalReturn)}</span>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      <button
                        onClick={handleMakePrediction}
                        disabled={!selectedOutcome || !amount || Number(amount) <= 0 || isSubmitting}
                        className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                          !selectedOutcome || !amount || Number(amount) <= 0 || isSubmitting
                            ? 'bg-gray-muted text-gray-text cursor-not-allowed opacity-50'
                            : 'bg-primary text-dark-bg hover:bg-primary/90 cursor-pointer'
                        }`}
                      >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isSubmitting ? 'Submitting...' : !selectedOutcome ? 'Select an outcome' : !amount || Number(amount) <= 0 ? 'Enter amount' : 'Make Prediction'}
                      </button>
                    </div>
                  ) : (
                    <div className="text-gray-text text-sm text-center py-8">
                      <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Select a question from the events to start your prediction.</p>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Sports;
