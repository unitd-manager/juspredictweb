import { api } from "./api";

export type ApiStatus = {
  type?: string;
  details?: { code?: string; message?: string }[];
};

export type PageRequest = {
  pageNumber?: number;
  pageSize?: number;
};

export type GroupMode = "UNSPECIFIED" | "PUBLIC" | "PRIVATE";

export type GroupStatus =
  | "GROUPSTATUS_UNSPECIFIED"
  | "GROUPSTATUS_ACTIVE"
  | "GROUPSTATUS_INACTIVE"
  | "GROUPSTATUS_SUSPENDED";

export type GroupUserRole =
  | "GROUPUSERROLE_UNSPECIFIED"
  | "GROUPUSERROLE_OWNER"
  | "GROUPUSERROLE_ADMIN"
  | "GROUPUSERROLE_OWNER_ADMIN"
  | "GROUPUSERROLE_MEMBER"
  | "GROUPUSERROLE_PENDING_MEMBER";

export type GroupInfo = {
  groupId?: string;
  groupName?: string;
  groupAlias?: string;
  groupMode?: GroupMode;
  groupStatus?: GroupStatus;
};

export type GroupSummary = {
  groupInfo?: GroupInfo;
  groupLastActivity?: string;
  topFirstName?: string;
  topLastName?: string;
  topTotalEarnings?: string;
  topUserId?: string;
};

export type GroupMember = {
  userId?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  userEmail?: string;
  userRole?: GroupUserRole;
};

export type GroupActivity = {
  activityId?: string;
  eventName?: string;
  eventShortName?: string;
 
  eventDescription?: string;
  eventLocation?: string;
  eventStartDate?: string;
  didIPredict?: boolean;
  entityId?: string;
};

export type LeaderboardRow = {
  accuracy?: string;
  earnings?: string;
  predictions?: number;
  userInfo?: GroupMember;
};

export type GetGroupsResponse = {
  status?: ApiStatus;
  userGroupCount?: number;
  userGroupInfo?: GroupSummary[];
};

export type GetGroupInfoResponse = {
  status?: ApiStatus;
  groupInfo?: GroupInfo;
  memberCount?: number;
  members?: GroupMember[];
};

export type GetGroupActivityResponse = {
  status?: ApiStatus;
  activityCount?: number;
  activities?: GroupActivity[];
};

export type GetGroupLeaderboardResponse = {
  status?: ApiStatus;
  groupUserCount?: number;
  groupUserInfo?: LeaderboardRow[];
};

export type CreateGroupPayload = {
  groupName: string;
  alias?: string;
  mode?: GroupMode;
  join?: boolean;
  userId?: string;
};

export type InviteMembersPayload = {
  groupId: string;
  groupName?: string;
  inviterUserId?: string;
  invites: {
    inviteeEmail: string;
    inviteeName?: string;
    eventType?: number;
  }[];
};

export type CancelInvitePayload = {
  groupId: string;
  emailId: string[];
};

export type RemoveUsersPayload = {
  groupId: string;
  userId: string[];
};

export type LeaveGroupPayload = {
  groupId: string;
  userId: string;
};

export type UpdateGroupPayload = {
  groupId: string;
  groupName?: string;
  nickName?: string;
};

const DEFAULT_PAGE_REQUEST: Required<PageRequest> = {
  pageNumber: 1,
  pageSize: 20,
};

const buildPageRequest = (pageRequest?: PageRequest) => ({
  pageRequest: {
    pageNumber: pageRequest?.pageNumber ?? DEFAULT_PAGE_REQUEST.pageNumber,
    pageSize: pageRequest?.pageSize ?? DEFAULT_PAGE_REQUEST.pageSize,
  },
});

async function getGroups(pageRequest?: PageRequest) {
  return api.post<GetGroupsResponse>("/group/v1/getgroups", buildPageRequest(pageRequest));
}

async function getGroupInfo(groupId: string, pageRequest?: PageRequest) {
  return api.post<GetGroupInfoResponse>("/group/v1/getinfo", {
    groupId,
    ...buildPageRequest(pageRequest),
  });
}

async function getGroupActivity(groupId: string, pageRequest?: PageRequest) {
  return api.post<GetGroupActivityResponse>("/group/v1/getactivity", {
    groupId,
    ...buildPageRequest(pageRequest),
  });
}

async function getGroupLeaderboard(groupId: string, pageRequest?: PageRequest) {
  return api.post<GetGroupLeaderboardResponse>("/group/v1/leaderboard", {
    groupId,
    ...buildPageRequest(pageRequest),
  });
}

async function createGroup(payload: CreateGroupPayload) {
  return api.post<{ groupId?: string; status?: ApiStatus }>("/group/v1/create", payload);
}

async function inviteMembers(payload: InviteMembersPayload) {
  const { inviterUserId, groupId, groupName, invites } = payload;

  return api.post("/group/v1/invite", {
    groupId,
    groupName,
    groupInvites: invites.map((invite) => ({
      inviteeEmail: invite.inviteeEmail,
      inviteeName: invite.inviteeName,
      eventType: invite.eventType ?? 1,
      userId: inviterUserId,        // REQUIRED BY BACKEND
    })),
  });
}


async function cancelInvite(payload: CancelInvitePayload) {
  return api.post("/group/v1/cancelinvite", payload);
}

async function removeUsers(payload: RemoveUsersPayload) {
  return api.post("/group/v1/removeuser", payload);
}

async function leaveGroup(payload: LeaveGroupPayload) {
  return api.post("/group/v1/leave", payload);
}

async function updateGroup(payload: UpdateGroupPayload) {
  return api.post("/group/v1/update", payload);
}

async function deleteGroup(payload: RemoveUsersPayload) {
  return api.post("/group/v1/delete", payload);
}

export const groupApi = {
  getGroups,
  getGroupInfo,
  getGroupActivity,
  getGroupLeaderboard,
  createGroup,
  inviteMembers,
  cancelInvite,
  removeUsers,
  leaveGroup,
  updateGroup,
  deleteGroup,
};

