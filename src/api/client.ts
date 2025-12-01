// Mock API client for sports/events data
interface ApiResponse<T = any> {
  status: { type: 'SUCCESS' | 'ERROR' | 'FAILED' };
  [key: string]: any;
}

// Mock events data
const mockEvents = [
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
