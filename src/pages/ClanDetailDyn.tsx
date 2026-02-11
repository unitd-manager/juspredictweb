import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle2,
  Users,
  Loader2,
  MapPin,
  CalendarDays,
  Target,
  Crown,
  Shield,
  X,
} from "lucide-react";
import { format } from "date-fns";


import {
  groupApi,
  type GroupActivity,
  type GroupMember,
  type LeaderboardRow,
} from "../api/groupDyn";
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { InviteMembersDialog } from "../components/clanDyn/InviteMembersDialog";
import { CancelInviteDialog } from '../components/clanDyn/CancelInviteDialog';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/Dialog";
import { Input } from "../components/ui/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';

import { ScrollArea } from '../components/ui/ScrollArea';
import { toast } from "../components/ui/sonner";

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return format(date, "MMM dd, yyyy • hh:mm a");
};

const getMemberName = (member?: GroupMember) =>
  `${member?.firstName ?? ""} ${member?.lastName ?? ""}`.trim() || member?.userName || "Unknown user";

const getRoleLabel = (role?: string) =>
  role?.replace("GROUPUSERROLE_", "").replace(/_/g, " ") ?? "MEMBER";

const ActivityCard = ({ activity }: { activity: GroupActivity }) => (
  <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
    <div className="flex flex-col gap-1 text-sm text-white/80">
      <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
        <span>{activity.eventShortName ?? activity.eventName ?? "Activity"}</span>
        <span>{formatDate(activity.eventStartDate)}</span>
      </div>
      <p className="text-base font-semibold text-white">{activity.eventName ?? activity.eventDescription}</p>
      {activity.eventLocation && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {activity.eventLocation}
        </p>
      )}
      <div className="mt-3 flex items-center gap-2">
        <Badge variant={activity.didIPredict ? "default" : "outline"} className="bg-emerald-500/20">
          {activity.didIPredict ? "Predicted" : "Spectating"}
        </Badge>
        {activity.didIPredict && (
          <CheckCircle2 className="h-4 w-4 text-emerald-300" />
        )}
      </div>
    </div>
  </div>
);

const LeaveClanDialog = ({ groupId }: { groupId: string }) => {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      if (!userId.trim()) throw new Error("User ID is required");
      return groupApi.leaveGroup({ groupId, userId });
    },
    onSuccess: () => {
      toast.success("Leave request submitted");
      setOpen(false);
      setUserId("");
    },
    onError: (err: Error) => toast.error(err.message || "Unable to leave clan"),
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await mutateAsync();
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !isPending && setOpen(next)}>
      <DialogTrigger asChild>
        <Button variant="outline">Leave clan</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Leave this clan</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Your user ID</label>
            <Input value={userId} onChange={(e) => setUserId(e.target.value)} required />
            <p className="text-xs text-muted-foreground">
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

const ClanDetail = () => {
  const { groupId } = useParams();
  const queryClient = useQueryClient();
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);

  const infoQuery = useQuery({
    queryKey: ["group-info", groupId],
    queryFn: () => groupId ? groupApi.getGroupInfo(groupId) : Promise.reject(new Error("Missing group ID")),
    enabled: Boolean(groupId),
  });

  const activityQuery = useQuery({
    queryKey: ["group-activity", groupId],
    queryFn: () => groupApi.getGroupActivity(groupId as string),
    enabled: Boolean(groupId),
  });

  const leaderboardQuery = useQuery({
    queryKey: ["group-leaderboard", groupId],
    queryFn: () => groupApi.getGroupLeaderboard(groupId as string),
    enabled: Boolean(groupId),
  });

  const removeMemberMutation = useMutation({
    mutationFn: (userId: string) => groupApi.removeUsers({ groupId: groupId as string, userId: [userId] }),
    onMutate: (userId) => setRemoveTarget(userId),
    onSuccess: () => {
      toast.success("Member removed");
      queryClient.invalidateQueries({ queryKey: ["group-info", groupId] });
    },
    onError: (err: Error) => toast.error(err.message || "Failed to remove member"),
    onSettled: () => setRemoveTarget(null),
  });

  const groupInfo = infoQuery.data?.groupInfo;
  const members = infoQuery.data?.members ?? [];
  const activities = activityQuery.data?.activities ?? [];
  const leaderboard = useMemo(
    () => leaderboardQuery.data?.groupUserInfo ?? [],
    [leaderboardQuery.data?.groupUserInfo],
  );
  const memberCount = infoQuery.data?.memberCount ?? members.length;

  const isLoading = infoQuery.isPending || activityQuery.isPending || leaderboardQuery.isPending;

  const topPerformer = useMemo(() => leaderboard[0], [leaderboard]);

  if (!groupId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <p>Clan not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050505] via-[#081011] to-[#040706] text-white">

      <main className="container mx-auto max-w-6xl px-4 py-10 space-y-8">
         
       <section className="relative z-10 mt-16 rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/20 to-transparent p-6">
  <Link
    to="/clan"
    className="inline-flex items-center gap-2 text-sm text-emerald-300 hover:text-white"
  >
    <ArrowLeft className="h-4 w-4" />
    Back to clans
  </Link>
</section>

        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-transparent p-6">
          {isLoading ? (
            <Skeleton className="h-32 rounded-2xl bg-white/10" />
          ) : (
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.5em] text-emerald-300/80">Clan</p>
                <h1 className="mt-2 text-3xl font-bold">{groupInfo?.groupName ?? "Unnamed clan"}</h1>
                <p className="mt-1 text-sm text-white/60">{groupInfo?.groupAlias}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-white/80">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {memberCount} members
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    {groupInfo?.groupMode ?? "PRIVATE"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <InviteMembersDialog
  groupId={groupId}
  groupName={groupInfo?.groupName ?? ""}
  trigger={
    <Button className="bg-emerald-500 text-white hover:bg-emerald-400">
      Invite members
    </Button>
  }
  onInvited={() => queryClient.invalidateQueries({ queryKey: ["group-info", groupId] })}
/>

                <CancelInviteDialog
                  groupId={groupId}
                  trigger={
                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                      Cancel invites
                    </Button>
                  }
                />
                <LeaveClanDialog groupId={groupId} />
              </div>
            </div>
          )}
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
                      <Card className="rounded-3xl border-white/10 bg-white/5 overflow-hidden relative">
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff73]/30 rounded-full -mr-16 -mt-16 pointer-events-none blur-lg"></div>
                     <div className="p-6 relative z-10">
                       <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-6">
                         <Crown className="h-5 w-5 text-primary" />
                         Live leaderboard
                       </h2>
       
              {leaderboardQuery.isPending ? (
                <Skeleton className="h-48 rounded-2xl bg-white/10" />
              ) : leaderboard.length ? (
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
                    {leaderboard.map((row: LeaderboardRow, index) => (
                      <TableRow key={row.userInfo?.userId ?? index} className="border-white/5">
                        <TableCell className="flex flex-col">
                          <span className="font-semibold text-white">{getMemberName(row.userInfo)}</span>
                          {/* <span className="text-xs text-muted-foreground">{row.userInfo?.userEmail}</span> */}
                        </TableCell>
                        <TableCell className="text-right text-white/80">{row.accuracy ?? "-"}</TableCell>
                        <TableCell className="text-right text-emerald-300">{Number(row.earnings).toFixed(2) ?? "-"}</TableCell>
                        <TableCell className="text-right text-white/80">{row.predictions ?? 0}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground">No leaderboard data yet.</p>
              )}
              </div>
          </Card>

            <Card className="rounded-3xl border-white/10 bg-white/5 overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff73]/30 rounded-full -mr-16 -mt-16 pointer-events-none blur-lg"></div>
                      <div className="p-6 relative z-10">
                        <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-6">
                          <Users className="h-5 w-5 text-primary" />
                          Members
                        </h2>
              {infoQuery.isPending ? (
                <Skeleton className="h-64 rounded-2xl bg-white/10" />
              ) : (
                <ScrollArea className="max-h-72 pr-4">
                  <div className="space-y-3">
                    {members.map((member) => (
                      <div
                        key={member.userId ?? member.userEmail ?? member.userName}
                        className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-white">{getMemberName(member)}</p>
                          {/* <p className="text-xs text-muted-foreground">{member.userEmail ?? member.userName}</p> */}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-white/30 text-white">
                            {getRoleLabel(member.userRole)}
                          </Badge>
                            <button
                                                        className="text-red-400 hover:text-red-300 disabled:opacity-50"
                                                        disabled={!member.userId || removeTarget === member.userId}
                            onClick={() => member.userId && removeMemberMutation.mutate(member.userId)}
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
                    {!members.length && <p className="text-sm text-muted-foreground">No members yet.</p>}
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
        
              {activityQuery.isPending ? (
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
      </main>

    </div>
  );
};

export default ClanDetail;

