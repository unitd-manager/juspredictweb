// Mock API client for sports/events data
interface ApiResponse<T = any> {
  status: { type: 'SUCCESS' | 'ERROR' | 'FAILED' };
  [key: string]: any;
   data?: T;

}

// Mock events data
const mockEvents = [
 
  // =============================
  // ⚽ FOOTBALL (5 Records)
  // =============================

   {
    id: '1',
    eventId: '1',
    name: 'Football Match - Team A vs Team B',
    startDate: Math.floor(Date.now() / 1000) + 3600,
    stats: JSON.stringify({
      result_prediction: [
        { value: '62' },
        { value: '38' }
      ]
    }),
    teams: [
      { name: 'Manchester United', shortName: 'MAN', displayName: 'Man Utd', imageUrl: 'https://via.placeholder.com/40?text=MAN', record: 'W-L-D: 10-2-3', form: ['W', 'W', 'D', 'L', 'W'] },
      { name: 'Liverpool', shortName: 'LIV', displayName: 'Liverpool', imageUrl: 'https://via.placeholder.com/40?text=LIV', record: 'W-L-D: 11-1-3', form: ['W', 'W', 'W', 'D', 'W'] }
    ]
  },
  {
    id: '2',
    eventId: '2',
    name: 'Cricket Match - India vs Australia',
    startDate: Math.floor(Date.now() / 1000) + 7200,
    stats: JSON.stringify({
      result_prediction: [
        { value: '55' },
        { value: '45' }
      ]
    }),
    teams: [
      { name: 'India', shortName: 'IND', displayName: 'India', imageUrl: 'https://via.placeholder.com/40?text=IND', record: 'Wins: 12', form: ['W', 'W', 'L', 'W', 'W'] },
      { name: 'Australia', shortName: 'AUS', displayName: 'Australia', imageUrl: 'https://via.placeholder.com/40?text=AUS', record: 'Wins: 10', form: ['W', 'L', 'W', 'W', 'L'] }
    ]
  },
  {
    id: '3',
    eventId: '3',
    name: 'Basketball Game - Lakers vs Celtics',
    startDate: Math.floor(Date.now() / 1000) + 10800,
    stats: JSON.stringify({
      result_prediction: [
        { value: '48' },
        { value: '52' }
      ]
    }),
    teams: [
      { name: 'Los Angeles Lakers', shortName: 'LAL', displayName: 'Lakers', imageUrl: 'https://via.placeholder.com/40?text=LAL', record: 'Wins: 35', form: ['W', 'L', 'W', 'W', 'D'] },
      { name: 'Boston Celtics', shortName: 'BOS', displayName: 'Celtics', imageUrl: 'https://via.placeholder.com/40?text=BOS', record: 'Wins: 38', form: ['W', 'W', 'W', 'L', 'W'] }
    ]
  },
  {
    id: '4',
    eventId: '4',
    name: 'Football Match - Barcelona vs Real Madrid',
    startDate: Math.floor(Date.now() / 1000) + 4000,
    stats: JSON.stringify({ result_prediction: [{ value: '58' }, { value: '42' }] }),
    teams: [
      { name: 'Barcelona', shortName: 'BAR', displayName: 'Barcelona', imageUrl: 'https://via.placeholder.com/40?text=BAR', record: 'W-L-D: 12-3-2', form: ['W', 'W', 'L', 'W', 'D'] },
      { name: 'Real Madrid', shortName: 'RM', displayName: 'Real Madrid', imageUrl: 'https://via.placeholder.com/40?text=RMD', record: 'W-L-D: 14-2-1', form: ['W', 'D', 'W', 'W', 'W'] }
    ]
  },
  {
    id: '5',
    eventId: '5',
    name: 'Football Match - Chelsea vs Arsenal',
    startDate: Math.floor(Date.now() / 1000) + 5200,
    stats: JSON.stringify({ result_prediction: [{ value: '46' }, { value: '54' }] }),
    teams: [
      { name: 'Chelsea', shortName: 'CHE', displayName: 'Chelsea', imageUrl: 'https://via.placeholder.com/40?text=CHE', record: 'W-L-D: 9-4-4', form: ['L', 'W', 'D', 'W', 'W'] },
      { name: 'Arsenal', shortName: 'ARS', displayName: 'Arsenal', imageUrl: 'https://via.placeholder.com/40?text=ARS', record: 'W-L-D: 11-3-2', form: ['W', 'W', 'W', 'D', 'L'] }
    ]
  },
  {
    id: '6',
    eventId: '6',
    name: 'Football Match - Bayern Munich vs Dortmund',
    startDate: Math.floor(Date.now() / 1000) + 6500,
    stats: JSON.stringify({ result_prediction: [{ value: '62' }, { value: '38' }] }),
    teams: [
      { name: 'Bayern Munich', shortName: 'BM', displayName: 'Bayern', imageUrl: 'https://via.placeholder.com/40?text=BM', record: 'W-L-D: 15-1-1', form: ['W', 'W', 'D', 'W', 'W'] },
      { name: 'Dortmund', shortName: 'DOR', displayName: 'Dortmund', imageUrl: 'https://via.placeholder.com/40?text=DOR', record: 'W-L-D: 10-4-3', form: ['L', 'W', 'W', 'D', 'W'] }
    ]
  },
  {
    id: '7',
    eventId: '7',
    name: 'Football Match - PSG vs Marseille',
    startDate: Math.floor(Date.now() / 1000) + 7500,
    stats: JSON.stringify({ result_prediction: [{ value: '70' }, { value: '30' }] }),
    teams: [
      { name: 'PSG', shortName: 'PSG', displayName: 'PSG', imageUrl: 'https://via.placeholder.com/40?text=PSG', record: 'W-L-D: 16-2-1', form: ['W', 'W', 'W', 'W', 'D'] },
      { name: 'Marseille', shortName: 'MAR', displayName: 'Marseille', imageUrl: 'https://via.placeholder.com/40?text=MAR', record: 'W-L-D: 8-6-3', form: ['W', 'L', 'D', 'W', 'L'] }
    ]
  },
  {
    id: '8',
    eventId: '8',
    name: 'Football Match - Inter Milan vs AC Milan',
    startDate: Math.floor(Date.now() / 1000) + 8500,
    stats: JSON.stringify({ result_prediction: [{ value: '51' }, { value: '49' }] }),
    teams: [
      { name: 'Inter Milan', shortName: 'INT', displayName: 'Inter', imageUrl: 'https://via.placeholder.com/40?text=INT', record: 'W-L-D: 13-3-2', form: ['D', 'W', 'W', 'L', 'W'] },
      { name: 'AC Milan', shortName: 'ACM', displayName: 'AC Milan', imageUrl: 'https://via.placeholder.com/40?text=ACM', record: 'W-L-D: 12-4-2', form: ['W', 'L', 'W', 'W', 'D'] }
    ]
  },

  // =============================
  // 🏀 BASKETBALL (5 Records)
  // =============================
  {
    id: '9',
    eventId: '9',
    name: 'Basketball - Warriors vs Lakers',
    startDate: Math.floor(Date.now() / 1000) + 4600,
    stats: JSON.stringify({ result_prediction: [{ value: '49' }, { value: '51' }] }),
    teams: [
      { name: 'Golden State Warriors', shortName: 'GSW', displayName: 'Warriors', imageUrl: 'https://via.placeholder.com/40?text=GSW', record: 'Wins: 40', form: ['W', 'W', 'L', 'W', 'W'] },
      { name: 'Los Angeles Lakers', shortName: 'LAL', displayName: 'Lakers', imageUrl: 'https://via.placeholder.com/40?text=LAL', record: 'Wins: 35', form: ['W', 'L', 'W', 'D', 'W'] }
    ]
  },
  {
    id: '10',
    eventId: '10',
    name: 'Basketball - Celtics vs Heat',
    startDate: Math.floor(Date.now() / 1000) + 5600,
    stats: JSON.stringify({ result_prediction: [{ value: '60' }, { value: '40' }] }),
    teams: [
      { name: 'Boston Celtics', shortName: 'BOS', displayName: 'Celtics', imageUrl: 'https://via.placeholder.com/40?text=BOS', record: 'Wins: 38', form: ['W', 'W', 'W', 'L', 'W'] },
      { name: 'Miami Heat', shortName: 'MIA', displayName: 'Heat', imageUrl: 'https://via.placeholder.com/40?text=MIA', record: 'Wins: 34', form: ['L', 'W', 'W', 'D', 'W'] }
    ]
  },
  {
    id: '11',
    eventId: '11',
    name: 'Basketball - Bulls vs Knicks',
    startDate: Math.floor(Date.now() / 1000) + 6800,
    stats: JSON.stringify({ result_prediction: [{ value: '44' }, { value: '56' }] }),
    teams: [
      { name: 'Chicago Bulls', shortName: 'CHI', displayName: 'Bulls', imageUrl: 'https://via.placeholder.com/40?text=CHI', record: 'Wins: 29', form: ['W', 'L', 'W', 'L', 'W'] },
      { name: 'New York Knicks', shortName: 'NYK', displayName: 'Knicks', imageUrl: 'https://via.placeholder.com/40?text=NYK', record: 'Wins: 32', form: ['W', 'W', 'W', 'D', 'L'] }
    ]
  },
  {
    id: '12',
    eventId: '12',
    name: 'Basketball - Raptors vs Nets',
    startDate: Math.floor(Date.now() / 1000) + 7800,
    stats: JSON.stringify({ result_prediction: [{ value: '55' }, { value: '45' }] }),
    teams: [
      { name: 'Toronto Raptors', shortName: 'TOR', displayName: 'Raptors', imageUrl: 'https://via.placeholder.com/40?text=TOR', record: 'Wins: 27', form: ['W', 'W', 'L', 'D', 'W'] },
      { name: 'Brooklyn Nets', shortName: 'BKN', displayName: 'Nets', imageUrl: 'https://via.placeholder.com/40?text=BKN', record: 'Wins: 31', form: ['L', 'W', 'W', 'W', 'L'] }
    ]
  },
  {
    id: '13',
    eventId: '13',
    name: 'Basketball - Clippers vs Suns',
    startDate: Math.floor(Date.now() / 1000) + 8800,
    stats: JSON.stringify({ result_prediction: [{ value: '47' }, { value: '53' }] }),
    teams: [
      { name: 'LA Clippers', shortName: 'LAC', displayName: 'Clippers', imageUrl: 'https://via.placeholder.com/40?text=LAC', record: 'Wins: 36', form: ['W', 'W', 'D', 'W', 'L'] },
      { name: 'Phoenix Suns', shortName: 'PHX', displayName: 'Suns', imageUrl: 'https://via.placeholder.com/40?text=PHX', record: 'Wins: 34', form: ['W', 'L', 'W', 'W', 'W'] }
    ]
  },

  // =============================
  // 🏏 CRICKET (5 Records)
  // =============================
  {
    id: '14',
    eventId: '14',
    name: 'Cricket - England vs South Africa',
    startDate: Math.floor(Date.now() / 1000) + 4700,
    stats: JSON.stringify({ result_prediction: [{ value: '52' }, { value: '48' }] }),
    teams: [
      { name: 'England', shortName: 'ENG', displayName: 'England', imageUrl: 'https://via.placeholder.com/40?text=ENG', record: 'Wins: 13', form: ['W', 'W', 'L', 'W', 'D'] },
      { name: 'South Africa', shortName: 'SA', displayName: 'South Africa', imageUrl: 'https://via.placeholder.com/40?text=SA', record: 'Wins: 11', form: ['W', 'D', 'W', 'L', 'W'] }
    ]
  },
  {
    id: '15',
    eventId: '15',
    name: 'Cricket - Pakistan vs New Zealand',
    startDate: Math.floor(Date.now() / 1000) + 5700,
    stats: JSON.stringify({ result_prediction: [{ value: '49' }, { value: '51' }] }),
    teams: [
      { name: 'Pakistan', shortName: 'PAK', displayName: 'Pakistan', imageUrl: 'https://via.placeholder.com/40?text=PAK', record: 'Wins: 9', form: ['W', 'L', 'L', 'W', 'W'] },
      { name: 'New Zealand', shortName: 'NZ', displayName: 'New Zealand', imageUrl: 'https://via.placeholder.com/40?text=NZ', record: 'Wins: 12', form: ['W', 'W', 'D', 'W', 'L'] }
    ]
  },
  {
    id: '16',
    eventId: '16',
    name: 'Cricket - Sri Lanka vs Bangladesh',
    startDate: Math.floor(Date.now() / 1000) + 6900,
    stats: JSON.stringify({ result_prediction: [{ value: '57' }, { value: '43' }] }),
    teams: [
      { name: 'Sri Lanka', shortName: 'SL', displayName: 'Sri Lanka', imageUrl: 'https://via.placeholder.com/40?text=SL', record: 'Wins: 8', form: ['W', 'D', 'W', 'L', 'W'] },
      { name: 'Bangladesh', shortName: 'BAN', displayName: 'Bangladesh', imageUrl: 'https://via.placeholder.com/40?text=BAN', record: 'Wins: 7', form: ['W', 'L', 'L', 'W', 'D'] }
    ]
  },
  {
    id: '17',
    eventId: '17',
    name: 'Cricket - West Indies vs Zimbabwe',
    startDate: Math.floor(Date.now() / 1000) + 8200,
    stats: JSON.stringify({ result_prediction: [{ value: '61' }, { value: '39' }] }),
    teams: [
      { name: 'West Indies', shortName: 'WI', displayName: 'West Indies', imageUrl: 'https://via.placeholder.com/40?text=WI', record: 'Wins: 6', form: ['L', 'W', 'W', 'D', 'W'] },
      { name: 'Zimbabwe', shortName: 'ZIM', displayName: 'Zimbabwe', imageUrl: 'https://via.placeholder.com/40?text=ZIM', record: 'Wins: 5', form: ['L', 'L', 'W', 'W', 'D'] }
    ]
  },
  {
    id: '18',
    eventId: '18',
    name: 'Cricket - Ireland vs Afghanistan',
    startDate: Math.floor(Date.now() / 1000) + 9100,
    stats: JSON.stringify({ result_prediction: [{ value: '40' }, { value: '60' }] }),
    teams: [
      { name: 'Ireland', shortName: 'IRE', displayName: 'Ireland', imageUrl: 'https://via.placeholder.com/40?text=IRE', record: 'Wins: 3', form: ['L', 'W', 'D', 'L', 'W'] },
      { name: 'Afghanistan', shortName: 'AFG', displayName: 'Afghanistan', imageUrl: 'https://via.placeholder.com/40?text=AFG', record: 'Wins: 8', form: ['W', 'W', 'W', 'L', 'W'] }
    ]
  },

  // =============================
  // ⚽ SOCCER (5 Records)
  // =============================
  {
    id: '19',
    eventId: '19',
    name: 'Soccer Match - Argentina vs Brazil',
    startDate: Math.floor(Date.now() / 1000) + 4300,
    stats: JSON.stringify({ result_prediction: [{ value: '55' }, { value: '45' }] }),
    teams: [
      { name: 'Argentina', shortName: 'ARG', displayName: 'Argentina', imageUrl: 'https://via.placeholder.com/40?text=ARG', record: 'W-L-D: 14-2-1', form: ['W', 'W', 'W', 'D', 'W'] },
      { name: 'Brazil', shortName: 'BRA', displayName: 'Brazil', imageUrl: 'https://via.placeholder.com/40?text=BRA', record: 'W-L-D: 13-3-1', form: ['W', 'L', 'W', 'W', 'W'] }
    ]
  },
  {
    id: '20',
    eventId: '20',
    name: 'Soccer Match - Germany vs France',
    startDate: Math.floor(Date.now() / 1000) + 5600,
    stats: JSON.stringify({ result_prediction: [{ value: '48' }, { value: '52' }] }),
    teams: [
      { name: 'Germany', shortName: 'GER', displayName: 'Germany', imageUrl: 'https://via.placeholder.com/40?text=GER', record: 'W-L-D: 11-4-2', form: ['L', 'W', 'W', 'D', 'W'] },
      { name: 'France', shortName: 'FRA', displayName: 'France', imageUrl: 'https://via.placeholder.com/40?text=FRA', record: 'W-L-D: 12-3-2', form: ['W', 'W', 'D', 'W', 'W'] }
    ]
  },
  {
    id: '21',
    eventId: '21',
    name: 'Soccer Match - Portugal vs Spain',
    startDate: Math.floor(Date.now() / 1000) + 6700,
    stats: JSON.stringify({ result_prediction: [{ value: '50' }, { value: '50' }] }),
    teams: [
      { name: 'Portugal', shortName: 'POR', displayName: 'Portugal', imageUrl: 'https://via.placeholder.com/40?text=POR', record: 'W-L-D: 10-4-3', form: ['W', 'L', 'W', 'W', 'D'] },
      { name: 'Spain', shortName: 'ESP', displayName: 'Spain', imageUrl: 'https://via.placeholder.com/40?text=ESP', record: 'W-L-D: 11-5-1', form: ['W', 'D', 'L', 'W', 'W'] }
    ]
  },
  {
    id: '22',
    eventId: '22',
    name: 'Soccer Match - Italy vs Netherlands',
    startDate: Math.floor(Date.now() / 1000) + 7800,
    stats: JSON.stringify({ result_prediction: [{ value: '47' }, { value: '53' }] }),
    teams: [
      { name: 'Italy', shortName: 'ITA', displayName: 'Italy', imageUrl: 'https://via.placeholder.com/40?text=ITA', record: 'W-L-D: 9-5-4', form: ['L', 'W', 'W', 'D', 'W'] },
      { name: 'Netherlands', shortName: 'NED', displayName: 'Netherlands', imageUrl: 'https://via.placeholder.com/40?text=NED', record: 'W-L-D: 12-3-3', form: ['W', 'W', 'L', 'W', 'D'] }
    ]
  },
  {
    id: '23',
    eventId: '23',
    name: 'Soccer Match - Japan vs South Korea',
    startDate: Math.floor(Date.now() / 1000) + 8400,
    stats: JSON.stringify({ result_prediction: [{ value: '45' }, { value: '55' }] }),
    teams: [
      { name: 'Japan', shortName: 'JPN', displayName: 'Japan', imageUrl: 'https://via.placeholder.com/40?text=JPN', record: 'W-L-D: 10-4-4', form: ['W', 'D', 'W', 'L', 'W'] },
      { name: 'South Korea', shortName: 'KOR', displayName: 'Korea', imageUrl: 'https://via.placeholder.com/40?text=KOR', record: 'W-L-D: 11-3-4', form: ['W', 'W', 'L', 'W', 'D'] }
    ]
  },

  // =============================
  // 🎾 TENNIS (5 Records)
  // =============================
  {
    id: '24',
    eventId: '24',
    name: 'Tennis Match - Djokovic vs Nadal',
    startDate: Math.floor(Date.now() / 1000) + 4900,
    stats: JSON.stringify({ result_prediction: [{ value: '53' }, { value: '47' }] }),
    teams: [
      { name: 'Novak Djokovic', shortName: 'DJOK', displayName: 'Djokovic', imageUrl: 'https://via.placeholder.com/40?text=ND', record: 'Wins: 72', form: ['W', 'W', 'W', 'L', 'W'] },
      { name: 'Rafael Nadal', shortName: 'NAD', displayName: 'Nadal', imageUrl: 'https://via.placeholder.com/40?text=RA', record: 'Wins: 68', form: ['W', 'L', 'W', 'W', 'W'] }
    ]
  },
  {
    id: '25',
    eventId: '25',
    name: 'Tennis Match - Federer vs Murray',
    startDate: Math.floor(Date.now() / 1000) + 6100,
    stats: JSON.stringify({ result_prediction: [{ value: '59' }, { value: '41' }] }),
    teams: [
      { name: 'Roger Federer', shortName: 'FED', displayName: 'Federer', imageUrl: 'https://via.placeholder.com/40?text=RF', record: 'Wins: 80', form: ['W', 'W', 'L', 'W', 'W'] },
      { name: 'Andy Murray', shortName: 'MUR', displayName: 'Murray', imageUrl: 'https://via.placeholder.com/40?text=AM', record: 'Wins: 60', form: ['L', 'W', 'W', 'D', 'W'] }
    ]
  },
  {
    id: '26',
    eventId: '26',
    name: 'Tennis Match - Alcaraz vs Medvedev',
    startDate: Math.floor(Date.now() / 1000) + 7200,
    stats: JSON.stringify({ result_prediction: [{ value: '48' }, { value: '52' }] }),
    teams: [
      { name: 'Carlos Alcaraz', shortName: 'ALC', displayName: 'Alcaraz', imageUrl: 'https://via.placeholder.com/40?text=CA', record: 'Wins: 45', form: ['W', 'W', 'W', 'L', 'W'] },
      { name: 'Daniil Medvedev', shortName: 'MED', displayName: 'Medvedev', imageUrl: 'https://via.placeholder.com/40?text=DM', record: 'Wins: 50', form: ['W', 'L', 'W', 'W', 'D'] }
    ]
  },
  {
    id: '27',
    eventId: '27',
    name: 'Tennis Match - Zverev vs Tsitsipas',
    startDate: Math.floor(Date.now() / 1000) + 8200,
    stats: JSON.stringify({ result_prediction: [{ value: '51' }, { value: '49' }] }),
    teams: [
      { name: 'Alexander Zverev', shortName: 'ZVE', displayName: 'Zverev', imageUrl: 'https://via.placeholder.com/40?text=AZ', record: 'Wins: 48', form: ['W', 'L', 'W', 'W', 'W'] },
      { name: 'Stefanos Tsitsipas', shortName: 'TSI', displayName: 'Tsitsipas', imageUrl: 'https://via.placeholder.com/40?text=ST', record: 'Wins: 47', form: ['W', 'W', 'L', 'W', 'D'] }
    ]
  },
  {
    id: '28',
    eventId: '28',
    name: 'Tennis Match - Rublev vs Sinner',
    startDate: Math.floor(Date.now() / 1000) + 9300,
    stats: JSON.stringify({ result_prediction: [{ value: '45' }, { value: '55' }] }),
    teams: [
      { name: 'Andrey Rublev', shortName: 'RUB', displayName: 'Rublev', imageUrl: 'https://via.placeholder.com/40?text=AR', record: 'Wins: 42', form: ['L', 'W', 'W', 'W', 'D'] },
      { name: 'Jannik Sinner', shortName: 'SIN', displayName: 'Sinner', imageUrl: 'https://via.placeholder.com/40?text=JS', record: 'Wins: 52', form: ['W', 'W', 'W', 'L', 'W'] }
    ]
  }
];

// Mock questions data by event
const mockQuestions: { [key: string]: any[] } = {
  '1': [
    {
      questionId: 'q1',
      name: 'Will Manchester United win?',
      description: 'Will Manchester United win the match?',
      category: 'Match Result',
      activity: {
        questionProbability: '62%',
        questionVolume: '125000',
        questionUsers: 1245,
        marketDataDetails: [
          { outcome: 'Yes', impliedProbability: 62 },
          { outcome: 'No', impliedProbability: 38 }
        ]
      }
    },
    {
      questionId: 'q2',
      name: 'Over 2.5 goals?',
      description: 'Will there be more than 2.5 goals in the match?',
      category: 'Over/Under',
      activity: {
        questionProbability: '58%',
        questionVolume: '98000',
        questionUsers: 856,
        marketDataDetails: [
          { outcome: 'Over 2.5', impliedProbability: 58 },
          { outcome: 'Under 2.5', impliedProbability: 42 }
        ]
      }
    }
  ],
  '2': [
    {
      questionId: 'q3',
      name: 'Will India win the toss?',
      description: 'Will India win the coin toss?',
      category: 'Match Events',
      activity: {
        questionProbability: '50%',
        questionVolume: '85000',
        questionUsers: 734,
        marketDataDetails: [
          { outcome: 'India Wins Toss', impliedProbability: 50 },
          { outcome: 'Australia Wins Toss', impliedProbability: 50 }
        ]
      }
    }
  ],
  '3': [
    {
      questionId: 'q4',
      name: 'Will Lakers cover the spread?',
      description: 'Will Lakers cover the 5-point spread?',
      category: 'Spread',
      activity: {
        questionProbability: '48%',
        questionVolume: '156000',
        questionUsers: 1892,
        marketDataDetails: [
          { outcome: 'Lakers Cover', impliedProbability: 48 },
          { outcome: 'Celtics Cover', impliedProbability: 52 }
        ]
      }
    }
  ]
};

export const api = {
  post: async <T = any>(endpoint: string, data: any): Promise<ApiResponse<T>> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    if (endpoint === '/event/v1/listevents') {
      return {
        status: { type: 'SUCCESS' },
        events: mockEvents
      };
    }

    if (endpoint === '/event/v1/getevent') {
      const eventId = String(data.eventId);
      const event = mockEvents.find(e => e.id === eventId || e.eventId === eventId);
      const questions = mockQuestions[eventId] || [];
      
      if (!event) {
        return {
          status: { type: 'ERROR' },
          event: null,
          questions: []
        };
      }

      return {
        status: { type: 'SUCCESS' },
        event,
        questions
      };
    }

    if (endpoint === '/balances/v1/get') {
      return {
        status: { type: 'SUCCESS' },
        availableBalance: 5000,
        balance: { available: 5000 }
      };
    }

    if (endpoint === '/order/v1/createorder') {
      // Simulate order creation
      return {
        status: { type: 'SUCCESS' },
        orderId: Math.random().toString(36).substr(2, 9),
        message: 'Order created successfully'
      };
    }

    return {
      status: { type: 'ERROR' }
    };
  }
};
