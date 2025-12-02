import React, { useMemo, useState, useEffect } from 'react';
import { format } from '../lib/dateUtils';
import { ArrowLeft, CheckCircle2, Users, Loader2, MapPin, CalendarDays, Target, Crown, Shield, X } from 'lucide-react';
import { Footer2 } from '../components/Footer2';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { ScrollArea } from '../components/ui/ScrollArea';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { InviteMembersDialog } from '../components/clan/InviteMembersDialog';
import { CancelInviteDialog } from '../components/clan/CancelInviteDialog';
import { toast } from '../components/ui/Toast';
import { groupApi, type GroupActivity, type GroupMember, type LeaderboardRow } from '../api/group';

interface ClanDetailProps {
  groupId?: string;
  onBack: () => void;
}

const formatDate = (value?: string) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return format(date, 'MMM dd, yyyy • hh:mm a');
};

const getMemberName = (member?: GroupMember) =>
  `${member?.firstName ?? ''} ${member?.lastName ?? ''}`.trim() || member?.userName || 'Unknown user';

const getRoleLabel = (role?: string) =>
  role?.replace('GROUPUSERROLE_', '').replace(/_/g, ' ') ?? 'MEMBER';

const ActivityCard = ({ activity }: { activity: GroupActivity }) => (
  <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
    <div className="flex flex-col gap-1 text-sm text-white/80">
      <div className="flex items-center justify-between text-xs uppercase tracking-wide text-gray-muted">
        <span>{activity.eventShortName ?? activity.eventName ?? 'Activity'}</span>
        <span>{formatDate(activity.eventStartDate)}</span>
      </div>
      <p className="text-base font-semibold text-white">{activity.eventName ?? activity.eventDescription}</p>
      {activity.eventLocation && (
        <p className="flex items-center gap-2 text-xs text-gray-muted">
          <MapPin className="h-3 w-3" />
          {activity.eventLocation}
        </p>
      )}
      <div className="mt-3 flex items-center gap-2">
        <Badge variant={activity.didIPredict ? 'default' : 'outline'} className="bg-primary/20">
          {activity.didIPredict ? 'Predicted' : 'Spectating'}
        </Badge>
        {activity.didIPredict && <CheckCircle2 className="h-4 w-4 text-primary" />}
      </div>
    </div>
  </div>
);

const LeaveClanDialog = ({ groupId, onLeave }: { groupId: string; onLeave: () => void }) => {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId.trim()) {
      toast.error('User ID is required');
      return;
    }

    setIsPending(true);
    try {
      await groupApi.leaveGroup({ groupId, userId });
      toast.success('Leave request submitted');
      setOpen(false);
      setUserId('');
      onLeave();
    } catch (err) {
      toast.error((err as Error).message || 'Unable to leave clan');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !isPending && setOpen(next)}>
      <DialogTrigger onClick={() => setOpen(true)}>
        <Button variant="outline">Leave clan</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Leave this clan</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-text">Your user ID</label>
            <Input value={userId} onChange={(e) => setUserId(e.target.value)} required />
            <p className="text-xs text-gray-muted">
              Supply the user ID that matches your account. You can retrieve it from the profile API.
            </p>
          </div>
          <DialogFooter>
            <Button type="submit" variant="outline" disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Confirm leave
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const ClanDetail: React.FC<ClanDetailProps> = ({ groupId, onBack }) => {
  const [infoData, setInfoData] = useState<any>(null);
  const [activityData, setActivityData] = useState<any>(null);
  const [leaderboardData, setLeaderboardData] = useState<any>(null);
  const [isPending, setIsPending] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
console.log('isremoving',isRemoving);
  useEffect(() => {
    const fetchData = async () => {
      if (!groupId) {
        setIsError(true);
        setError(new Error('No group selected'));
        setIsPending(false);
        return;
      }

      try {
        setIsError(false);
        setError(null);
        setIsPending(true);

        const [info, activity, leaderboard] = await Promise.all([
          groupApi.getGroupInfo(groupId),
          groupApi.getGroupActivity(groupId),
          groupApi.getGroupLeaderboard(groupId),
        ]);

        setInfoData(info);
        setActivityData(activity);
        setLeaderboardData(leaderboard);
      } catch (err) {
        setIsError(true);
        setError(err instanceof Error ? err : new Error('Failed to load clan details'));
      } finally {
        setIsPending(false);
      }
    };

    fetchData();
  }, [groupId]);

  const groupInfo = infoData?.groupInfo;
  const members = infoData?.members ?? [];
  const activities = activityData?.activities ?? [];
  const leaderboard = useMemo(() => leaderboardData?.groupUserInfo ?? [], [leaderboardData?.groupUserInfo]);
  const memberCount = infoData?.memberCount ?? members.length;
  const topPerformer = useMemo(() => leaderboard[0], [leaderboard]);

  const handleRemoveMember = async (userId: string) => {
    setRemoveTarget(userId);
    setIsRemoving(true);
    try {
      await groupApi.removeUsers({ groupId: groupId as string, userId: [userId] });
      toast.success('Member removed');
      setInfoData({
        ...infoData,
        members: members.filter((m: GroupMember) => m.userId !== userId),
      });
    } catch (err) {
      toast.error((err as Error).message || 'Failed to remove member');
    } finally {
      setRemoveTarget(null);
      setIsRemoving(false);
    }
  };

  if (!groupId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-bg text-white">
        <p>Clan not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-gray-light">
      <main className="px-4 sm:px-6 lg:px-8 py-10 relative">
        <div className="max-w-[1400px] mx-auto space-y-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-gray-text hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to clans
          </button>

          {/* Clan Header */}
          <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-primary/5 to-transparent p-6">
            {isPending ? (
              <Skeleton className="h-32 rounded-2xl bg-white/10" />
            ) : isError ? (
              <div className="text-red-400">
                <p>Failed to load clan: {error?.message}</p>
                <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.5em] text-primary/80">Clan</p>
                  <h1 className="mt-2 text-3xl font-bold">{groupInfo?.groupName ?? 'Unnamed clan'}</h1>
                  <p className="mt-1 text-sm text-gray-text">{groupInfo?.groupAlias}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-white/80">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {memberCount} members
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      {groupInfo?.groupMode ?? 'PRIVATE'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <InviteMembersDialog
                    groupId={groupId}
                    groupName={groupInfo?.groupName}
                    trigger={<Button className="bg-primary text-dark-bg hover:bg-primary/90">Invite members</Button>}
                  />
                  <CancelInviteDialog groupId={groupId} trigger={<Button variant="outline">Cancel invites</Button>} />
                  <LeaveClanDialog groupId={groupId} onLeave={onBack} />
                </div>
              </div>
            )}
          </section>

          {/* Main Content Grid */}
          <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            {/* Leaderboard */}
            <Card className="rounded-3xl border-white/10 bg-white/5 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff73]/30 rounded-full -mr-16 -mt-16 pointer-events-none blur-lg"></div>
              <div className="p-6 relative z-10">
                <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-6">
                  <Crown className="h-5 w-5 text-primary" />
                  Live leaderboard
                </h2>

                {isPending ? (
                  <Skeleton className="h-48 rounded-2xl bg-white/10" />
                ) : leaderboard.length ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/5 text-xs uppercase tracking-wide">
                          <TableHead className="text-white">Member</TableHead>
                          <TableHead className="text-right text-white">Accuracy</TableHead>
                          <TableHead className="text-right text-white">Earnings</TableHead>
                          <TableHead className="text-right text-white">Predictions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leaderboard.map((row: LeaderboardRow, index:any) => (

                          <TableRow key={row.userInfo?.userId ?? index} className="border-white/5">
                            <TableCell className="flex flex-col">
                              <span className="font-semibold text-white">{getMemberName(row.userInfo)}</span>
                              <span className="text-xs text-gray-muted">{row.userInfo?.userEmail}</span>
                            </TableCell>
                            <TableCell className="text-right text-white/80">{row.accuracy ?? '-'}</TableCell>
                            <TableCell className="text-right text-primary">{row.earnings ?? '-'}</TableCell>
                            <TableCell className="text-right text-white/80">{row.predictions ?? 0}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-muted">No leaderboard data yet.</p>
                )}
              </div>
            </Card>

            {/* Members */}
            <Card className="rounded-3xl border-white/10 bg-white/5 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff73]/30 rounded-full -mr-16 -mt-16 pointer-events-none blur-lg"></div>
              <div className="p-6 relative z-10">
                <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-6">
                  <Users className="h-5 w-5 text-primary" />
                  Members
                </h2>

                {isPending ? (
                  <Skeleton className="h-64 rounded-2xl bg-white/10" />
                ) : (
                  <ScrollArea className="max-h-72 pr-4">
                    <div className="space-y-3">
                      {members.map((member: GroupMember) => (
                        <div
                          key={member.userId ?? member.userEmail ?? member.userName}
                          className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-3"
                        >
                          <div>
                            <p className="text-sm font-semibold text-white">{getMemberName(member)}</p>
                            <p className="text-xs text-gray-muted">{member.userEmail ?? member.userName}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="border-white/30 text-white">
                              {getRoleLabel(member.userRole)}
                            </Badge>
                            <button
                              className="text-red-400 hover:text-red-300 disabled:opacity-50"
                              disabled={!member.userId || removeTarget === member.userId}
                              onClick={() => member.userId && handleRemoveMember(member.userId)}
                            >
                              {removeTarget === member.userId ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                      {!members.length && <p className="text-sm text-gray-muted">No members yet.</p>}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </Card>
          </section>

          {/* Activity & Highlights */}
          <section className="grid gap-6 lg:grid-cols-2">
            {/* Latest Activity */}
            <Card className="rounded-3xl border-white/10 bg-white/5 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff73]/30 rounded-full -mr-16 -mt-16 pointer-events-none blur-lg"></div>
              <div className="p-6 relative z-10">
                <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-6">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  Latest activity
                </h2>

                {isPending ? (
                  <Skeleton className="h-48 rounded-2xl bg-white/10" />
                ) : activities.length ? (
                  <div className="space-y-4">
                    {activities.slice(0, 4).map((activity: any) => (
                      <ActivityCard key={activity.entityId ?? activity.eventName} activity={activity} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-muted">No activity yet.</p>
                )}
              </div>
            </Card>

            {/* Highlights */}
            <Card className="rounded-3xl border-white/10 bg-white/5 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff73]/30 rounded-full -mr-16 -mt-16 pointer-events-none blur-lg"></div>
              <div className="p-6 relative z-10">
                <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-6">
                  <Target className="h-5 w-5 text-primary" />
                  Highlights
                </h2>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                    <p className="text-sm text-white/70">Current MVP</p>
                    <p className="text-2xl font-semibold text-white">{getMemberName(topPerformer?.userInfo)}</p>
                    <p className="text-sm text-gray-muted">
                      Accuracy {topPerformer?.accuracy ?? '-'} • Earnings {topPerformer?.earnings ?? '-'}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                    <p className="text-sm text-white/70">Members</p>
                    <p className="text-2xl font-semibold text-white">{memberCount}</p>
                    <p className="text-sm text-gray-muted">Active participants in this clan</p>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                    <p className="text-sm text-white/70">Last activity</p>
                    <p className="text-lg text-white">{formatDate(activities[0]?.eventStartDate)}</p>
                  </div>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </main>

      <Footer2 />
    </div>
  );
};

export default ClanDetail;
