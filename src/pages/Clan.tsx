import React, { useMemo, useState, useEffect } from 'react';
import { format, formatDistanceToNowStrict, isToday } from '../lib/dateUtils';
import { Award, Loader2, RefreshCcw, Search, Users } from 'lucide-react';
import { Footer2 } from '../components/Footer2';
import { PageHeader } from '../components/PageHeader';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { CreateClanDialog } from '../components/clan/CreateClanDialog';
import { groupApi, type GroupSummary } from '../api/group';

const formatActivityTimestamp = (value?: string) => {
  if (!value) return 'No recent activity';
  const date = new Date(value);
  const prefix = isToday(date) ? 'Today' : format(date, 'MMM dd');
  return `${prefix}, ${format(date, 'hh:mm a')}`;
};

const formatRelative = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  return formatDistanceToNowStrict(date, { addSuffix: true });
};

const buildTopPerformerName = (group: GroupSummary) => {
  const first = group.topFirstName ?? '';
  const last = group.topLastName ?? '';
  const full = `${first} ${last}`.trim();
  return full || 'No predictions yet';
};

interface ClanProps {
  onSelectClan?: (clanId: string) => void;
}

export const Clan: React.FC<ClanProps> = ({ onSelectClan }) => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState<{ userGroupInfo: GroupSummary[]; userGroupCount: number } | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isRefetching, setIsRefetching] = useState(false);

  const fetchGroups = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefetching(true);
      } else {
        setIsPending(true);
      }
      setIsError(false);
      setError(null);
      const response = await groupApi.getGroups();
      setData(response);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error('Failed to load clans'));
    } finally {
      if (isRefresh) {
        setIsRefetching(false);
      } else {
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const groups = useMemo(() => data?.userGroupInfo ?? [], [data?.userGroupInfo]);

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return groups;
    return groups.filter((group) => {
      const name = group.groupInfo?.groupName ?? '';
      const alias = group.groupInfo?.groupAlias ?? '';
      const performer = buildTopPerformerName(group);
      const query = search.toLowerCase();
      return (
        name.toLowerCase().includes(query) ||
        alias.toLowerCase().includes(query) ||
        performer.toLowerCase().includes(query)
      );
    });
  }, [groups, search]);

  const handleRefresh = async () => {
    await fetchGroups(true);
  };

  const renderState = () => {
    if (isPending) {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} className="h-44 rounded-2xl bg-white/5" />
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="rounded-2xl border border-red-500/50 bg-red-500/10 p-6 text-red-400">
          <p>Failed to load clans: {error?.message}</p>
          <Button variant="outline" className="mt-4" onClick={handleRefresh}>
            Try again
          </Button>
        </div>
      );
    }

    if (!filteredGroups.length) {
      return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-lg font-semibold text-white">No clans found</p>
          <p className="text-sm text-gray-text">
            Use the button below to create your first clan.
          </p>
        </div>
      );
    }

    return (
      <div className="grid gap-5 md:grid-cols-2">
        {filteredGroups.map((group) => {
          const groupId = group.groupInfo?.groupId ?? '';
          const earnings = group.topTotalEarnings ?? '0';
          const topPerformer = buildTopPerformerName(group);
          return (
            <div
              key={groupId || group.groupInfo?.groupName}
              className="group focus:outline-none cursor-pointer"
              onClick={() => groupId && onSelectClan?.(groupId)}
            >
              <Card className="h-full rounded-3xl border-white/10 bg-gradient-to-br from-primary/5 via-primary/0 to-transparent transition-all duration-300 hover:border-primary/70 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff73]/30 rounded-full -mr-16 -mt-16 pointer-events-none blur-lg"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-white/70">
                    <span>{group.groupInfo?.groupName}</span>
                    <span>{formatActivityTimestamp(group.groupLastActivity)}</span>
                  </div>

                  <p className="mt-2 text-sm text-gray-text">{group.groupInfo?.groupAlias}</p>

                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-lg font-semibold text-primary">
                      {(group.groupInfo?.groupName ?? 'CL')
                        .split(' ')
                        .map((word) => word[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs text-white/70">Top performer</p>
                      <p className="text-lg font-semibold text-white">{topPerformer}</p>
                      <div className="mt-1 flex items-center gap-2 text-sm text-primary">
                        <Award className="h-4 w-4" />
                        {earnings}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between text-sm text-white/80">
                    <span>{formatRelative(group.groupLastActivity)}</span>
                    <Badge variant="outline" className="border-white/30 text-white">
                      View details
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-dark-bg text-gray-light">
      {/* Page Header */}
      <PageHeader
        title="Clans"
        tagline="Join competitive squads and dominate the leaderboards with your team"
        compact={true}
        isSubpage={true}
      />

      <main className="px-4 sm:px-6 lg:px-8 pb-10 relative">
        <div className="max-w-[1400px] mx-auto">
          <div className="space-y-8">
            {/* Search and Action Bar */}
            <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 lg:flex-row lg:items-center">
              <div className="flex flex-1 items-center gap-2 rounded-2xl border border-white/10 bg-black/40 px-3">
                <Search className="h-4 w-4 text-gray-text" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search clans, aliases, or top performers"
                  className="border-none bg-transparent placeholder:text-gray-muted focus-visible:ring-0"
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleRefresh} disabled={isRefetching}>
                  {isRefetching ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCcw className="mr-2 h-4 w-4" />
                  )}
                  Refresh
                </Button>
                <CreateClanDialog />
              </div>
            </div>

            {/* Stats Bar */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-gray-text">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                {data?.userGroupCount ? (
                  <p>
                    You are part of <span className="font-semibold text-white">{data.userGroupCount}</span>{' '}
                    clans right now.
                  </p>
                ) : (
                  <p>Start a clan to challenge your friends.</p>
                )}
              </div>
            </div>

            {/* Clans Grid */}
            {renderState()}
          </div>
        </div>
      </main>

      <Footer2 />

      {/* FAB - Create Clan Button */}
      <div className="fixed bottom-6 right-6">
        <CreateClanDialog
          trigger={
            <div className="h-14 w-14 rounded-full bg-primary text-dark-bg shadow-lg shadow-primary/40 flex items-center justify-center cursor-pointer">
              <span className="text-2xl font-bold">+</span>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default Clan;
