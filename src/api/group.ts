export interface GroupInfo {
  groupId: string;
  groupName: string;
  groupAlias: string;
  createdAt: string;
  memberCount: number;
  groupMode?: string;
}

export interface GroupMember {
  userId?: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  userEmail?: string;
  userRole?: string;
}

export interface GroupActivity {
  entityId?: string;
  eventName?: string;
  eventShortName?: string;
  eventDescription?: string;
  eventStartDate?: string;
  eventLocation?: string;
  didIPredict?: boolean;
}

export interface LeaderboardRow {
  userInfo?: GroupMember;
  accuracy?: string;
  earnings?: string;
  predictions?: number;
}

export interface GroupSummary {
  groupInfo?: GroupInfo;
  groupLastActivity?: string;
  topFirstName?: string;
  topLastName?: string;
  topTotalEarnings?: string;
  memberCount?: number;
  totalPredictions?: number;
  won?: number;
}

export interface GroupResponse {
  userGroupInfo: GroupSummary[];
  userGroupCount: number;
}

export interface GroupDetailResponse {
  groupInfo?: GroupInfo;
  members: GroupMember[];
  memberCount: number;
}

export interface GroupActivityResponse {
  activities: GroupActivity[];
}

export interface GroupLeaderboardResponse {
  groupUserInfo: LeaderboardRow[];
}

const mockGroupDetails: { [key: string]: { info: GroupInfo; members: GroupMember[]; activities: GroupActivity[]; leaderboard: LeaderboardRow[] } } = {
  '1': {
    info: {
      groupId: '1',
      groupName: 'Champions League',
      groupAlias: 'champs',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      memberCount: 12,
      groupMode: 'PRIVATE'
    },
    members: [
      { userId: '101', firstName: 'John', lastName: 'Smith', userName: 'johnsmith', userEmail: 'john@example.com', userRole: 'GROUPUSERROLE_ADMIN' },
      { userId: '102', firstName: 'Alice', lastName: 'Brown', userName: 'alice', userEmail: 'alice@example.com', userRole: 'GROUPUSERROLE_MEMBER' },
      { userId: '103', firstName: 'Bob', lastName: 'Wilson', userName: 'bob', userEmail: 'bob@example.com', userRole: 'GROUPUSERROLE_MEMBER' },
    ],
    activities: [
      { entityId: '1', eventName: 'Cricket Championship 2024', eventShortName: 'CC2024', eventStartDate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), eventLocation: 'Mumbai', didIPredict: true },
      { entityId: '2', eventName: 'Football World Cup', eventShortName: 'FWC', eventStartDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), eventLocation: 'Qatar', didIPredict: true },
    ],
    leaderboard: [
      { userInfo: { userId: '101', firstName: 'John', lastName: 'Smith', userEmail: 'john@example.com' }, accuracy: '78%', earnings: '$2,450.75', predictions: 45 },
      { userInfo: { userId: '102', firstName: 'Alice', lastName: 'Brown', userEmail: 'alice@example.com' }, accuracy: '71%', earnings: '$1,890.50', predictions: 38 },
      { userInfo: { userId: '103', firstName: 'Bob', lastName: 'Wilson', userEmail: 'bob@example.com' }, accuracy: '65%', earnings: '$1,220.25', predictions: 32 },
    ]
  },
  '2': {
    info: {
      groupId: '2',
      groupName: 'Elite Predictors',
      groupAlias: 'elite',
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      memberCount: 8,
      groupMode: 'PRIVATE'
    },
    members: [
      { userId: '201', firstName: 'Sarah', lastName: 'Johnson', userName: 'sarah', userEmail: 'sarah@example.com', userRole: 'GROUPUSERROLE_ADMIN' },
      { userId: '202', firstName: 'Tom', lastName: 'Davis', userName: 'tom', userEmail: 'tom@example.com', userRole: 'GROUPUSERROLE_MEMBER' },
    ],
    activities: [],
    leaderboard: [
      { userInfo: { userId: '201', firstName: 'Sarah', lastName: 'Johnson', userEmail: 'sarah@example.com' }, accuracy: '82%', earnings: '$3,120.50', predictions: 52 },
      { userInfo: { userId: '202', firstName: 'Tom', lastName: 'Davis', userEmail: 'tom@example.com' }, accuracy: '75%', earnings: '$2,450.00', predictions: 42 },
    ]
  },
  '3': {
    info: {
      groupId: '3',
      groupName: 'Pro Traders',
      groupAlias: 'protraders',
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      memberCount: 15,
      groupMode: 'PUBLIC'
    },
    members: [],
    activities: [],
    leaderboard: [
      { userInfo: { userId: '301', firstName: 'Mike', lastName: 'Chen', userEmail: 'mike@example.com' }, accuracy: '70%', earnings: '$1,890.25', predictions: 35 },
    ]
  },
  '4': {
    info: {
      groupId: '4',
      groupName: 'Victory Squad',
      groupAlias: 'vicqsquad',
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      memberCount: 10,
      groupMode: 'PRIVATE'
    },
    members: [],
    activities: [],
    leaderboard: [
      { userInfo: { userId: '401', firstName: 'Emma', lastName: 'Davis', userEmail: 'emma@example.com' }, accuracy: '76%', earnings: '$2,675.90', predictions: 48 },
    ]
  },
  '5': {
    info: {
      groupId: '5',
      groupName: 'Prediction Pros',
      groupAlias: 'predpros',
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      memberCount: 9,
      groupMode: 'PUBLIC'
    },
    members: [],
    activities: [],
    leaderboard: [
      { userInfo: { userId: '501', firstName: 'David', lastName: 'Miller', userEmail: 'david@example.com' }, accuracy: '68%', earnings: '$1,540.60', predictions: 82 },
    ]
  },
  '6': {
    info: {
      groupId: '6',
      groupName: 'Elite Forecasters',
      groupAlias: 'elitefc',
      createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
      memberCount: 14,
      groupMode: 'PRIVATE'
    },
    members: [],
    activities: [],
    leaderboard: [
      { userInfo: { userId: '601', firstName: 'Olivia', lastName: 'Brown', userEmail: 'olivia@example.com' }, accuracy: '85%', earnings: '$3,450.10', predictions: 160 },
    ]
  }
};

const mockGroups: GroupSummary[] = [
  {
    groupInfo: mockGroupDetails['1'].info,
    groupLastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    topFirstName: 'John',
    topLastName: 'Smith',
    topTotalEarnings: '$2,450.75',
    memberCount: 12,
    totalPredictions: 120,
    won: 78
  },
  {
    groupInfo: mockGroupDetails['2'].info,
    groupLastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    topFirstName: 'Sarah',
    topLastName: 'Johnson',
    topTotalEarnings: '$3,120.50',
    memberCount: 8,
    totalPredictions: 95,
    won: 63
  },
  {
    groupInfo: mockGroupDetails['3'].info,
    groupLastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    topFirstName: 'Mike',
    topLastName: 'Chen',
    topTotalEarnings: '$1,890.25',
    memberCount: 15,
    totalPredictions: 143,
    won: 87
  },
  {
    groupInfo: mockGroupDetails['4'].info,
    groupLastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    topFirstName: 'Emma',
    topLastName: 'Davis',
    topTotalEarnings: '$2,675.90',
    memberCount: 10,
    totalPredictions: 110,
    won: 71
  },
  {
    groupInfo: mockGroupDetails['5'].info,
    groupLastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    topFirstName: 'David',
    topLastName: 'Miller',
    topTotalEarnings: '$1,540.60',
    memberCount: 9,
    totalPredictions: 82,
    won: 49
  },
  {
    groupInfo: mockGroupDetails['6'].info,
    groupLastActivity: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    topFirstName: 'Olivia',
    topLastName: 'Brown',
    topTotalEarnings: '$3,450.10',
    memberCount: 14,
    totalPredictions: 160,
    won: 102
  }
];


export const groupApi = {
  getGroups: async (): Promise<GroupResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      userGroupInfo: mockGroups,
      userGroupCount: mockGroups.length
    };
  },
  getGroupInfo: async (groupId: string): Promise<GroupDetailResponse> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const detail = mockGroupDetails[groupId];
    if (!detail) throw new Error('Group not found');
    return {
      groupInfo: detail.info,
      members: detail.members,
      memberCount: detail.info.memberCount
    };
  },
  getGroupActivity: async (groupId: string): Promise<GroupActivityResponse> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const detail = mockGroupDetails[groupId];
    if (!detail) throw new Error('Group not found');
    return { activities: detail.activities };
  },
  getGroupLeaderboard: async (groupId: string): Promise<GroupLeaderboardResponse> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const detail = mockGroupDetails[groupId];
    if (!detail) throw new Error('Group not found');
    return { groupUserInfo: detail.leaderboard };
  },
  removeUsers: async (params: { groupId: string; userId: string[] }): Promise<void> => {
  void params; // marks params as "intentionally used"
  await new Promise(resolve => setTimeout(resolve, 300));
},

leaveGroup: async (params: { groupId: string; userId: string }): Promise<void> => {
  void params;
  await new Promise(resolve => setTimeout(resolve, 300));
},

};
