import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Users, DollarSign, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { PageHeader } from '../components/PageHeaderSport';
import { Button } from '../components/ui/Button';
import { api } from '../api/api';
import { Dialog, DialogContent } from '../components/ui/Dialog';
import { useNavigate } from 'react-router-dom';

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

  const name = (event.name || event.eventName || event.sportEvent?.name || '').toString();

  return (
    <button
      onClick={() => onSelect(id)}
      aria-pressed={selectedId === id}
      className={`relative w-56 min-w-[14rem] md:w-64 md:min-w-[16rem] flex-shrink-0 rounded-xl p-3 text-left transition-all ${
        selectedId === id
          ? 'bg-primary/10 border border-primary ring-2 ring-primary/30 shadow-lg'
          : 'bg-dark-card border border-white/6 hover:shadow-lg hover:border-primary/30'
      }`}
    >
      {selectedId === id && (
        <span className="absolute top-2 right-2 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500 shadow-md" />
          <span className="text-xs text-white">▾</span>
        </span>
      )}
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-gray-text">{timeLabel}</div>
        <div className="text-xs text-gray-text">{event?.league || event?.category || ''}</div>
      </div>
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

      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-text">{name}</div>
        <div className="text-xs text-white font-semibold">{Math.round(probA)}% / {Math.round(probB)}%</div>
      </div>
    </button>
  );
};

// Horizontal strip of thumbnails
const EventThumbnailStrip = ({ events, onSelect, selectedId }: { events: any[]; onSelect: (id: string) => void; selectedId?: string | null }) => {
  if (!events || events.length === 0) return null;

  return (
    <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8 py-4">
      <div className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="flex gap-3">
          {events.slice(0, 20).map((ev, idx) => (
            <EventThumbnail key={String(ev.id ?? ev.eventId ?? idx)} event={ev} onSelect={onSelect} selectedId={selectedId} />
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

  // Event name (prioritize explicit name)
  const eventName =
    (typeof event?.name === "string" && event.name.trim()) ||
    (typeof event?.eventName === "string" && event.eventName.trim()) ||
    (typeof event?.sportEvent?.name === "string" && event.sportEvent.name.trim()) ||
    (typeof event?.sportEvent?.eventName === "string" && event.sportEvent.eventName.trim()) ||
    [
      event?.sportEvent?.sportType?.replace?.("SPORT_TYPE_", ""),
      event?.sportEvent?.eventFormat,
    ]
      .filter(Boolean)
      .join(" • ");

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
         const res = await api.post<{
          event: any;
          questions: any[];
          status: { type: string };
        }>(
          "/event/v1/getevent",
          {
            eventId: id,
            getEventQuestions: true,
            questionsPageInfo: { pageNumber: 1, pageSize: 50 },
          }
        );
        if (!cancelled && res?.status?.type === 'SUCCESS') {
          const qs = Array.isArray(res.questions) ? res.questions : [];
          const latest = qs.length > 0 ? qs[qs.length - 1] : null;
          setLastQuestionName(latest?.description || latest?.name || latest?.questionName || null);
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
  onPredict: (question: any, eventId: string, predictionId?: string) => void;
}> = ({ eventId, onBack, onPredict }) => {
  const [event, setEvent] = useState<any | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      setIsLoading(true);
      try {
       
           const response = await api.post<{
          event: any;
          questions: any[];
          status: { type: string };
        }>(
          "/event/v1/getevent",
          {
            eventId,
            getEventQuestions: true,
            questionsPageInfo: { pageNumber: 1, pageSize: 50 },
          }
        );

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

  if (!event) {
    return (
      <div className="rounded-xl border border-white/10 bg-dark-card p-6 mt-2">
        <button
          onClick={onBack}
          className="flex items-center text-gray-text hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <p className="text-gray-text">Event not found</p>
      </div>
    );
  }

  // derive teams and probabilities for display
  const teams = Array.isArray(event?.teams)
    ? event.teams
    : Array.isArray(event?.sportEvent?.teams)
    ? event.sportEvent.teams
    : [];

  const teamA = teams?.[0] || {};
  const teamB = teams?.[1] || {};

  const { probA, probB } = getTeamProbabilities(event, teams);

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

// Live Predictions List Component
const LivePredictionsList: React.FC<{ onExit: (p: any, event: any) => void }> = ({ onExit }) => {
  const navigate = useNavigate();
  const [items, setItems] = React.useState<any[]>([]);
  const [eventsMap, setEventsMap] = React.useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const getEventName = (event: any) => (
    (typeof event?.name === "string" && event.name.trim()) ||
    (typeof event?.eventName === "string" && event.eventName.trim()) ||
    (typeof event?.sportEvent?.name === "string" && event.sportEvent.name.trim()) ||
    (typeof event?.sportEvent?.eventName === "string" && event.sportEvent.eventName.trim()) ||
    [event?.sportEvent?.sportType?.replace?.("SPORT_TYPE_", ""), event?.sportEvent?.eventFormat].filter(Boolean).join(" • ")
  );

  React.useEffect(() => {
    let mounted = true;
    const fetchLive = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          if (mounted) {
            setItems([]);
            setEventsMap({});
            setIsLoading(false);
          }
          return;
        }
        const res = await api.post<any>("/prediction/v1/get", {
          day: 0,
          month: 0,
          year: 0,
          pageRequest: { pageNumber: 1, pageSize: 200 },
          timeInForce: "PREDICTIONTIMEINFORCE_LIVE",
        });
        const preds = Array.isArray(res?.predictions) ? res.predictions : [];
        if (mounted) setItems(preds);
        const idsSet = new Set<string>(
          preds
            .map((p: any) => String(p?.eventId || ""))
            .filter((s: string) => s.length > 0)
        );
        const ids: string[] = Array.from(idsSet);
        const map: Record<string, any> = {};
        await Promise.all(
          ids.map(async (id: string) => {
            try {
              const ev = await api.post<any>("/event/v1/getevent", {
            eventId: id,
            getEventQuestions: true,
            questionsPageInfo: { pageNumber: 1, pageSize: 50 },
          });
              if (ev?.status?.type === "SUCCESS") map[id] = ev?.event || null;
            } catch {}
          })
        );
        if (mounted) setEventsMap(map);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchLive();
    const interval = window.setInterval(fetchLive, 120_000);
    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  if (isLoading) return <div className="text-gray-text">Loading live predictions...</div>;
  if (!items || items.length === 0) return <div className="text-gray-text">No live predictions</div>;

  return (
    <div className="space-y-4">
      {items.map((p: any, idx: number) => {
        const eventId = String(p?.eventId || "");
        const event = eventsMap[eventId] || {};
        // const title = getEventName(event) || `Event ${eventId}`;
        const eventDate = new Date(p?.eventStartDate);
        const today = new Date();
        const diffTime = Math.abs(eventDate.getTime() - today.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const startsIn = diffDays > 0 ? `${diffDays} day${diffDays > 1 ? "s" : ""}` : "Today";
        const qName = p?.question || p?.questionName || p?.question?.description || "Prediction";
        const outcome = String(p?.eventShortName ?? p?.predictionDetails?.selectedPredictionOutcome ?? p?.selectedPredictionOutcome ?? "").trim();
        const pctNum = Number(p?.percentage ?? p?.exitPercentage ?? 0);
        const pctText = isFinite(pctNum) ? `${Math.max(0, Math.min(100, Math.round(pctNum)))}%` : "--%";
        const matched = Number(p?.matchedAmt ?? 0);
        const invest = Number(p?.investmentAmt ?? 0);
        const matchedText = isFinite(matched) && isFinite(invest) && invest > 0 ? `${matched.toFixed(2)}/${invest.toFixed(2)} is matched` : "--";
        return (
          <div key={p?.predictionId || idx} className="rounded-2xl border border-white/10 bg-dark-card p-4">
            <div className="flex items-center justify-between">
              <div className="text-white font-semibold">{outcome || "--"}</div>
              <Badge variant="secondary" className="text-red-300">Match starts in {startsIn}</Badge>
            </div>
            <div className="my-3 border-t border-white/10" />
            <div className="flex items-start justify-between">
              <div className="text-white font-medium">{qName}</div>
            </div>
            <div className="mt-2 text-gray-text text-sm flex items-center gap-2">
              <span>{outcome || "--"}</span>
              <span>•</span>
              <span>{pctText}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1"><DollarSign className="w-4 h-4" /> {matchedText}</span>
            </div>
            <div className="flex gap-3 mt-4">
              <Button onClick={() => onExit(p, event)} className="flex-1 bg-yellow-500 text-dark-bg hover:bg-yellow-400">
                Exit
              </Button>
              <Button 
                onClick={() => navigate(`/order-details/${p?.orderId}`)}
                className="flex-1 bg-primary text-dark-bg hover:bg-primary/90"
              >
                Order Details
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Open Predictions List Component
const OpenPredictionsList: React.FC<{ onOpen: (p: any, event: any) => void }> = ({ onOpen }) => {
  const navigate = useNavigate();
  const [items, setItems] = React.useState<any[]>([]);
  const [eventsMap, setEventsMap] = React.useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isCancelling, setIsCancelling] = React.useState<string | null>(null);

  // const getEventName = (event: any) => (
  //   (typeof event?.name === "string" && event.name.trim()) ||
  //   (typeof event?.eventName === "string" && event.eventName.trim()) ||
  //   (typeof event?.sportEvent?.name === "string" && event.sportEvent.name.trim()) ||
  //   (typeof event?.sportEvent?.eventName === "string" && event.sportEvent.eventName.trim()) ||
  //   [event?.sportEvent?.sportType?.replace?.("SPORT_TYPE_", ""), event?.sportEvent?.eventFormat].filter(Boolean).join(" • ")
  // );

  React.useEffect(() => {
    let mounted = true;
    const fetchOpen = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          if (mounted) {
            setItems([]);
            setEventsMap({});
            setIsLoading(false);
          }
          return;
        }
        const res = await api.post<any>("/prediction/v1/get", {
          day: 0,
          month: 0,
          year: 0,
          pageRequest: { pageNumber: 1, pageSize: 200 },
          timeInForce: "PREDICTIONTIMEINFORCE_PENDING_LIVE",
        });
        const preds = Array.isArray(res?.predictions) ? res.predictions : [];
        if (mounted) setItems(preds);
        const idsSet = new Set<string>(
          preds
            .map((p: any) => String(p?.eventId || ""))
            .filter((s: string) => s.length > 0)
        );
        const ids: string[] = Array.from(idsSet);
        const map: Record<string, any> = {};
        await Promise.all(
          ids.map(async (id: string) => {
            try {
              const ev = await api.post<any>("/event/v1/getevent", {
            eventId: id,
            getEventQuestions: true,
            questionsPageInfo: { pageNumber: 1, pageSize: 50 },
          });
              if (ev?.status?.type === "SUCCESS") map[id] = ev?.event || null;
            } catch {}
          })
        );
        if (mounted) setEventsMap(map);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchOpen();
    const interval = window.setInterval(fetchOpen, 120_000);
    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    setIsCancelling(orderId);
    try {
      const response = await api.post<any>('/order/v1/cancelorder', {
        orderId: orderId,
      });

      if (response?.status?.type === 'SUCCESS') {
        // Remove the cancelled item from the list
        setItems(prevItems => prevItems.filter(p => p?.orderId !== orderId));
      } else {
        alert('Failed to cancel order');
      }
    } catch (err) {
      console.error('Failed to cancel order:', err);
      alert('Failed to cancel order');
    } finally {
      setIsCancelling(null);
    }
  };

  if (isLoading) return <div className="text-gray-text">Loading open predictions...</div>;
  if (!items || items.length === 0) return <div className="text-gray-text">No open predictions</div>;

  return (
    <div className="space-y-4">
      {items.map((p: any, idx: number) => {
        // const title = getEventName(event) || `Event ${eventId}`;
        const eventDes = p?.eventDescription;
        const eventDate = new Date(p?.eventStartDate);
        const today = new Date();
        const diffTime = Math.abs(eventDate.getTime() - today.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const startsIn = diffDays > 0 ? `${diffDays} day${diffDays > 1 ? "s" : ""}` : "Today";
        const qName = p?.question || p?.questionName || p?.question?.description || "Prediction";
        const status = String(p?.predictionStatus || "");
        const isAccepted = status === "PREDICTION_STATUS_ACCEPTED" || status === "PREDICTION_STATUS_CANCEL_REQUESTED";
        const outcome = String(p?.eventShortName ?? p?.predictionDetails?.selectedPredictionOutcome ?? p?.selectedPredictionOutcome ?? "").trim();
        const pctNum = Number(p?.percentage ?? p?.exitPercentage ?? 0);
        const pctText = isFinite(pctNum) ? `${Math.max(0, Math.min(100, Math.round(pctNum)))}%` : "--%";
        const matched = Number(p?.matchedAmt ?? 0);
        const invest = Number(p?.investmentAmt ?? 0);
        const matchedText = isFinite(matched) && isFinite(invest) && invest > 0 ? `${matched.toFixed(2)}/${invest.toFixed(2)} is matched` : "--";
        return (
          <div key={p?.predictionId || idx} className="rounded-2xl border border-white/10 bg-dark-card p-4">
            <div className="flex items-center justify-between">
              <div className="text-white font-semibold">{outcome || "--"} {eventDes}</div>
              <Badge variant="secondary" className="text-red-300">Match starts in {startsIn}</Badge>
            </div>
            <div className="my-3 border-t border-white/10" />
            <div className="flex items-start justify-between">
              <div className="text-white font-medium">{qName}</div>
              {isAccepted && <Badge className="text-green-300">Accepted</Badge>}
            </div>
            <div className="mt-2 text-gray-text text-sm flex items-center gap-2">
              <span>{outcome || "--"}</span>
              <span>•</span>
              <span>{pctText}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1"><DollarSign className="w-4 h-4" /> {matchedText}</span>
            </div>
            <div className="flex gap-3 mt-4">
              <Button 
                onClick={() => handleCancelOrder(p?.orderId)}
                disabled={isCancelling === (p?.orderId)}
                className="flex-1 bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
              >
                {isCancelling === (p?.orderId) ? 'Cancelling...' : 'Cancel'}
              </Button>
              <Button 
                onClick={() => navigate(`/order-details/${p?.orderId}`)}
                className="flex-1 bg-primary text-dark-bg hover:bg-primary/90"
              >
                Order Details
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Completed Predictions List Component
const CompletedPredictionsList: React.FC<{ onOpen: (p: any, event: any) => void }> = ({ onOpen }) => {
  const [items, setItems] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [period, setPeriod] = React.useState<string>("PREDICTIONTIMEINFORCE_COMPLETED_ALLTIME");

  React.useEffect(() => {
    let mounted = true;
    const fetchCompleted = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          if (mounted) {
            setItems([]);
            setIsLoading(false);
          }
          return;
        }
        const res = await api.post<any>("/prediction/v1/get", {
          day: 0,
          month: 0,
          year: 0,
          pageRequest: { pageNumber: 1, pageSize: 200 },
          timeInForce: period,
        });
        const preds = Array.isArray(res?.predictions) ? res.predictions : [];
        if (mounted) setItems(preds);
      } catch (error) {
        console.error('Failed to fetch completed predictions:', error);
        if (mounted) setItems([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchCompleted();
    const interval = window.setInterval(fetchCompleted, 120_000);
    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, [period]);

  if (isLoading) return <div className="text-gray-text text-center py-8">Loading completed predictions...</div>;
  if (!items || items.length === 0) return <div className="text-gray-text text-center py-8">No completed predictions</div>;

  return (
    <div className="space-y-4">
      <div className="mb-4 inline-flex rounded-lg border border-white/10 bg-dark-card p-1">
        {[
          { code: "PREDICTIONTIMEINFORCE_COMPLETED_ALLTIME", label: "All Time" },
          { code: "PREDICTIONTIMEINFORCE_COMPLETED_TODAY", label: "Today" },
          { code: "PREDICTIONTIMEINFORCE_COMPLETED_YESTERDAY", label: "Yesterday" },
          { code: "PREDICTIONTIMEINFORCE_COMPLETED_LASTWEEK", label: "Last Week" },
          { code: "PREDICTIONTIMEINFORCE_COMPLETED_LASTMONTH", label: "Last Month" },
          { code: "PREDICTIONTIMEINFORCE_COMPLETED_THISMONTH", label: "This Month" },
        ].map(({ code, label }) => (
          <button
            key={code}
            onClick={() => setPeriod(code)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              period === code ? "bg-primary text-dark-bg" : "text-gray-text hover:bg-dark-lighter"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {items.map((p: any, idx: number) => {
          const eventName = p?.eventName || p?.eventShortName || "Event";
          const eventShortName = p?.eventShortName || "";
          const eventDesc = p?.eventDescription || "";
          const eventStatus = p?.eventStatus || "";
          const question = p?.question || "Question";
          const predictedOutcome = p?.predictedOutcome || p?.predictedOutcomeChoice || "";
          const percentage = Number(p?.percentage || 0);
          const investmentAmt = Number(p?.investmentAmt || 0);
          const potentialReturns = Number(p?.potentialReturns || 0);
          const earnings = Number(p?.earnings || 0);
          const predictionOutcome = String(p?.predictionOutcome || "");
          const daysAgo = p?.eventStartDate ? Math.floor((Date.now() - new Date(p.eventStartDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
          
          const isWin = predictionOutcome === "PREDICTIONOUTCOME_SUCCESS" || earnings > 0;
          const statusLabel = eventStatus === "PREDICTION_EVENT_STATUS_CLOSED" ? "Event Closed" : "Active";
          const outcomeLabel = isWin ? "Winnings" : "Lost";
          const outcomeColor = isWin ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400";

          return (
            <div key={p?.predictionId || idx} className="rounded-xl border border-white/10 bg-dark-card p-5 hover:border-primary/30 transition-all">
              {/* Header: Event name and status */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold">{eventShortName} {eventDesc}</h3>
                  <p className="text-xs text-gray-text mt-1">{question}</p>
                </div>
                <Badge variant="outline" className="text-xs text-gray-text">{statusLabel}</Badge>
              </div>

              {/* Prediction details row */}
              <div className="flex items-center gap-3 mb-4 text-sm">
                <span className="text-gray-text">{predictedOutcome}</span>
                <span className="text-gray-text">•</span>
                <span className="text-white font-medium">{percentage}%</span>
                <span className="text-gray-text">•</span>
                <span className="text-gray-text inline-flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {investmentAmt}
                </span>
              </div>

              {/* Outcome bar */}
              <div className={`rounded-lg p-3 flex items-center justify-between ${outcomeColor}`}>
                <span className="font-medium">{outcomeLabel}</span>
                <span className="font-bold inline-flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {Math.abs(earnings)}
                </span>
              </div>

              {/* Time ago indicator */}
              <div className="mt-3 text-xs text-gray-text text-right">
                <Badge className="text-blue-300">Settled</Badge> {daysAgo}d ago
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Cancelled Predictions List Component
const CancelledPredictionsList: React.FC<{ onOpen: (p: any, event: any) => void }> = ({ onOpen }) => {
  const [items, setItems] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    let mounted = true;
    const fetchCancelled = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          if (mounted) {
            setItems([]);
            setIsLoading(false);
          }
          return;
        }
        const res = await api.post<any>("/prediction/v1/get", {
          day: 0,
          month: 0,
          year: 0,
          pageRequest: { pageNumber: 1, pageSize: 200 },
          timeInForce: "PREDICTIONTIMEINFORCE_CANCELLED",
        });
        const preds = Array.isArray(res?.predictions) ? res.predictions : [];
        if (mounted) setItems(preds);
      } catch (error) {
        console.error('Failed to fetch cancelled predictions:', error);
        if (mounted) setItems([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchCancelled();
    const interval = window.setInterval(fetchCancelled, 120_000);
    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  if (isLoading) return <div className="text-gray-text text-center py-8">Loading cancelled predictions...</div>;
  if (!items || items.length === 0) return <div className="text-gray-text text-center py-8">No cancelled predictions</div>;

  return (
    <div className="space-y-3">
      {items.map((p: any, idx: number) => {
        const eventName = p?.eventName || p?.eventShortName || "Event";
        const eventShortName = p?.eventShortName || "";
        const eventDesc = p?.eventDescription || "";
        const eventStatus = p?.eventStatus || "";
        const question = p?.question || "Question";
        const predictedOutcome = p?.predictedOutcome || p?.predictedOutcomeChoice || "";
        const percentage = Number(p?.percentage || 0);
        const investmentAmt = Number(p?.investmentAmt || 0);
        const matchedAmt = Number(p?.matchedAmt || 0);
        const daysAgo = p?.eventStartDate ? Math.floor((Date.now() - new Date(p.eventStartDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
        
        const statusLabel = eventStatus === "PREDICTION_EVENT_STATUS_CLOSED" ? "Event Closed" : "Match starts in";
        const isClosed = eventStatus === "PREDICTION_EVENT_STATUS_CLOSED";
        
        // Calculate exited amount
        const exitedAmount = investmentAmt - matchedAmt;

        return (
          <div key={p?.predictionId || idx} className="rounded-xl border border-white/10 bg-dark-card p-5 hover:border-primary/30 transition-all">
            {/* Header: Event name and status */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">{eventShortName} {eventDesc}</h3>
              {isClosed ? (
                <Badge variant="outline" className="text-xs text-gray-text">{statusLabel}</Badge>
              ) : (
                <Badge variant="outline" className="text-xs text-red-400 border-red-400/30">Match starts in {daysAgo}d</Badge>
              )}
            </div>

            {/* Question */}
            <div className="mb-4">
              <p className="text-white font-medium">{question}</p>
            </div>

            {/* Prediction details row */}
            <div className="flex items-center gap-3 mb-4 text-sm">
              <span className="text-gray-text">{predictedOutcome}</span>
              <span className="text-gray-text">•</span>
              <span className="text-white font-medium">{percentage}%</span>
              <span className="text-gray-text">•</span>
              <span className="text-gray-text inline-flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                {investmentAmt}
              </span>
            </div>

            {/* Cancelled badge */}
            <div className="mb-4 inline-flex">
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Cancelled</Badge>
            </div>

            {/* Info box */}
            <div className="bg-dark-lighter rounded-lg p-3 border border-white/5 flex items-start gap-3 text-sm text-gray-text">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-orange-400" />
              <span>
                You predicted {investmentAmt} JP coins. Out of these, {matchedAmt.toFixed(1)} have been exited, and the remaining have been cancelled.
              </span>
            </div>

            {/* Time ago indicator */}
            <div className="mt-3 text-xs text-gray-text text-right">
              {daysAgo}d
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Exited Predictions List Component
const ExitedPredictionsList: React.FC<{ onOpen: (p: any, event: any) => void }> = ({ onOpen }) => {
  const navigate = useNavigate();
  const [items, setItems] = React.useState<any[]>([]);
  const [eventsMap, setEventsMap] = React.useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

 

  React.useEffect(() => {
    let mounted = true;
    const fetchExited = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          if (mounted) {
            setItems([]);
            setEventsMap({});
            setIsLoading(false);
          }
          return;
        }
        const res = await api.post<any>("/prediction/v1/get", {
          day: 0,
          month: 0,
          year: 0,
          pageRequest: { pageNumber: 1, pageSize: 200 },
          timeInForce: "PREDICTIONTIMEINFORCE_EXITED",
        });
        const preds = Array.isArray(res?.predictions) ? res.predictions : [];
        if (mounted) setItems(preds);
        const idsSet = new Set<string>(
          preds
            .map((p: any) => String(p?.eventId || ""))
            .filter((s: string) => s.length > 0)
        );
        const ids: string[] = Array.from(idsSet);
        const map: Record<string, any> = {};
        await Promise.all(
          ids.map(async (id: string) => {
            try {
              const ev = await api.post<any>("/event/v1/getevent", {
            eventId: id,
            getEventQuestions: true,
            questionsPageInfo: { pageNumber: 1, pageSize: 50 },
          });
              if (ev?.status?.type === "SUCCESS") map[id] = ev?.event || null;
            } catch {}
          })
        );
        if (mounted) setEventsMap(map);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchExited();
    const interval = window.setInterval(fetchExited, 120_000);
    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  if (isLoading) return <div className="text-gray-text">Loading exited predictions...</div>;
  if (!items || items.length === 0) return <div className="text-gray-text">No exited predictions</div>;

  return (
    <div className="space-y-4">
      {items.map((p: any, idx: number) => {
        const eventId = String(p?.eventId || "");
        const event = eventsMap[eventId] || {};
        // const title = getEventName(event) || `Event ${eventId}`;
        const eventDate = new Date(p?.eventStartDate);
        const today = new Date();
        const diffTime = Math.abs(eventDate.getTime() - today.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const startsIn = diffDays > 0 ? `${diffDays} day${diffDays > 1 ? "s" : ""}` : "Today";
        const qName = p?.question || p?.questionName || p?.question?.description || "Prediction";
        const status = String(p?.predictionStatus || "");
        const isExited = status === "PREDICTION_STATUS_EXITED";
        const eventDes = p?.eventDescription;
        const outcome = String(p?.eventShortName ?? p?.predictedOutcome ?? p?.predictionDetails?.selectedPredictionOutcome ?? p?.selectedPredictionOutcome ?? "").trim();
        const pctNum = Number(p?.percentage ?? p?.exitPercentage ?? 0);
        const pctText = isFinite(pctNum) ? `${Math.max(0, Math.min(100, Math.round(pctNum)))}%` : "--%";
        const matched = Number(p?.matchedAmt ?? 0);
        const invest = Number(p?.investmentAmt ?? 0);
        const matchedText = isFinite(matched) && isFinite(invest) && invest > 0 ? `${matched.toFixed(2)}/${invest.toFixed(2)} is matched` : "--";
        return (
          <div key={p?.predictionId || idx} className="rounded-2xl border border-white/10 bg-dark-card p-4">
            <div className="flex items-center justify-between">
              <div className="text-white font-semibold">{outcome || "--"} {eventDes}</div>
              <Badge variant="secondary" className="text-red-300">Match starts in {startsIn}</Badge>
            </div>
            <div className="my-3 border-t border-white/10" />
            <div className="flex items-start justify-between">
              <div className="text-white font-medium">{qName}</div>
              {isExited && <Badge className="text-gray-text">Exited</Badge>}
            </div>
            <div className="mt-2 text-gray-text text-sm flex items-center gap-2">
              <span>{outcome || "--"}</span>
              <span>•</span>
              <span>{pctText}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1"><DollarSign className="w-4 h-4" /> {matchedText}</span>
            </div>
            <Button 
              onClick={() => navigate(`/order-details/${p?.orderId}`)}
              className="mt-4 w-full bg-primary text-dark-bg hover:bg-primary/90"
            >
              Order Details
            </Button>
          </div>
        );
      })}
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
  const [activeTab, setActiveTab] = useState<'all' |'open' | 'live' | 'completed' | 'cancelled' | 'exited'>('all');
  const [selectedSport, setSelectedSport] = useState<string | null>(propSelectedSport ?? null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [suppressQuestionPredictionFetch, setSuppressQuestionPredictionFetch] = React.useState<boolean>(false);
  const [selectedQuestionPrediction, setSelectedQuestionPrediction] = React.useState<any | null>(null);
  const [selectedEventStatusFilter, setSelectedEventStatusFilter] = useState<'live' | 'upcoming' | 'trending' | null>('live');

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
  }>>([])
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
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setBalance(null);
      return;
    }
    try {
      const res = await api.post<any>("/balances/v1/get", {});
      if (res?.status?.type === "SUCCESS") {
        setBalance(res);
      } else {
        setBalance(null);
      }
    } catch (e) {
      console.error("Failed to fetch balance", e);
      setBalance(null);
    }
  };

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await api.post<{
        events: any[];
        status: { type: string };
      }>("/event/v1/listevents", {
        status: [
          "EVENT_STATUS_UPCOMING",
          "EVENT_STATUS_ACTIVE",
          "EVENT_STATUS_COMPLETED",
        ],
        category: "EVENT_CATEGORY_SPORTS",
        pageNumber: 1,
        pageSize: 50,
      });

      if (response?.status?.type === "SUCCESS") {
        setEvents(response.events || []);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchEvents();
  }, []);

   React.useEffect(() => {
    const run = async () => {
      if (!selectedQuestion?.questionId) {
        setSelectedQuestionPrediction(null);
        return;
      }
      if (suppressQuestionPredictionFetch) {
        // skip automatic fetch because a specific prediction was requested
        return;
      }
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setSelectedQuestionPrediction(null);
        return;
      }
      try {
        const res = await api.post<any>("/prediction/v1/getbyquestion", {
          questionId: selectedQuestion.questionId,
          timeInForce: "PREDICTIONTIMEINFORCE_UPCOMING",
        });
        const mine = Array.isArray(res?.myPredictions) ? res.myPredictions[0] : null;
        setSelectedQuestionPrediction(mine);
      } catch {
        setSelectedQuestionPrediction(null);
      }
    };
    run();
  }, [selectedQuestion?.questionId, suppressQuestionPredictionFetch]);

  const filteredEvents = events.filter((event) => {
    let matchesStatus = true;
    let matchesSport = true;
    let matchesEventStatusFilter = true;

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

    // Apply event status filter (Live/Upcoming/Trending buttons)
    if (selectedEventStatusFilter === 'live') {
      matchesEventStatusFilter = event.status === 'EVENT_STATUS_ACTIVE' || event.eventStatus === 'ACTIVE';
    } else if (selectedEventStatusFilter === 'upcoming') {
      matchesEventStatusFilter = event.status === 'EVENT_STATUS_UPCOMING' || event.eventStatus === 'UPCOMING';
    }  else if (selectedEventStatusFilter === 'trending') {
      matchesEventStatusFilter = event.status === 'EVENT_STATUS_TRENDING' || event.eventStatus === 'TRENDING';
    }
    // 'trending' filter can be added based on your business logic

    if (selectedSport) {
      const eventName = (event.name || '').toLowerCase();
      matchesSport = eventName.includes(selectedSport.toLowerCase());
    }

    return matchesStatus && matchesSport && matchesEventStatusFilter;
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

      const res = await api.post<any>('/order/v1/createorder', {
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

  // const formatStartsIn = (startDateSeconds: number) => {
  //   const ms = startDateSeconds * 1000 - Date.now();
  //   if (ms <= 0) return 'Match live';
  //   const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  //   if (days >= 1) return `Match starts in ${days} day${days > 1 ? 's' : ''}`;
  //   const hours = Math.floor(ms / (60 * 60 * 1000));
  //   if (hours >= 1) return `Match starts in ${hours} hour${hours > 1 ? 's' : ''}`;
  //   const minutes = Math.floor(ms / (60 * 1000));
  //   return `Match starts in ${minutes} minute${minutes > 1 ? 's' : ''}`;
  // };

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
          {/* Thumbnail strip under header */}
          <EventThumbnailStrip
            events={events}
            selectedId={selectedEventId}
            onSelect={(id: string) => {
              setSelectedEventId(id);
              // bring the details into view by scrolling a bit
              try {
                window.scrollTo({ top: 200, behavior: 'smooth' });
              } catch {}
            }}
          />

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
            {/* Left Sidebar - Sports */}
            <aside className="w-full lg:w-64 lg:flex-shrink-0">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sticky top-24">
               <h3 className="text-sm font-semibold text-slate-200 mb-4">Filters</h3>
          <div className="space-y-2 mb-6">
            <button 
              onClick={() => setSelectedEventStatusFilter('live')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all ${
                selectedEventStatusFilter === 'live'
                  ? 'bg-slate-700 text-emerald-300'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span className="text-green-400">●</span> Live
            </button>
            <button 
              onClick={() => setSelectedEventStatusFilter('upcoming')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all ${
                selectedEventStatusFilter === 'upcoming'
                  ? 'bg-slate-700 text-emerald-300'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              Upcoming
            </button>
            <button 
              onClick={() => setSelectedEventStatusFilter('trending')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all ${
                selectedEventStatusFilter === 'trending'
                  ? 'bg-slate-700 text-emerald-300'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              Trending
            </button>
          </div>

                <h3 className="text-sm font-semibold text-white mb-3">Sports</h3>
                <ul className="space-y-2">
                  <li
                    onClick={() => setSelectedSport(null)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all cursor-pointer ${
                      selectedSport === null
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
                  {[
                    { name: 'Football', emoji: '🏈', count: 24 },
                    { name: 'Basketball', emoji: '🏀', count: 18 },
                    { name: 'Cricket', emoji: '🏏', count: 12 },
                    { name: 'Soccer', emoji: '⚽', count: 32 },
                    { name: 'Tennis', emoji: '🎾', count: 15 },
                  ].map((sport) => (
                    <li
                      key={sport.name}
                      onClick={() => setSelectedSport(sport.name)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all cursor-pointer ${
                        selectedSport === sport.name
                          ? 'bg-primary/20 text-primary'
                          : 'text-gray-text hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{sport.emoji}</span>
                        <span className="text-sm">{sport.name}</span>
                      </div>
                      <span className="text-xs bg-dark-card px-2 py-0.5 rounded text-white">{sport.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              {/* Horizontal Tabs (hidden when viewing a single event detail) */}
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
                  onPredict={(question) => {
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
              ) : activeTab === 'live' ? (
                <LivePredictionsList
                  onExit={(p: any) => {
                    // Show exit prediction panel in right sidebar instead of navigating to details
                    const eventDes = p?.eventDescription || p?.eventName || "Event";
                    const qName = p?.question || p?.questionName || p?.question?.description || "Prediction";
                    const outcome = String(p?.eventShortName ?? p?.predictionDetails?.selectedPredictionOutcome ?? p?.selectedPredictionOutcome ?? "").trim();
                    const pctNum = Number(p?.percentage ?? p?.exitPercentage ?? 0);
                    const matchedAmt = Number(p?.matchedAmt ?? 0);
                    const investAmt = Number(p?.investmentAmt ?? 0);
                    
                    setSelectedPrediction({
                      predictionId: String(p?.predictionId || ""),
                      eventId: String(p?.eventId || ""),
                      eventName: eventDes,
                      eventDescription: p?.eventDescription || "",
                      questionName: qName,
                      answer: outcome,
                      percentage: pctNum,
                      amount: investAmt,
                      matchedAmt: matchedAmt,
                      status: p?.predictionStatus || p?.status || "PREDICTION_STATUS_LIVE"
                    });
                    setSelectedAction('exit');
                    setExitAmount("");
                    setExitConfidence(null);
                    setErrorMsg("");
                    fetchBalance();
                  }}
                />
              ) : activeTab === 'open' ? (
                <OpenPredictionsList
                  onOpen={(p: any) => {
                    const id = String(p?.eventId || "");
                    setSelectedEventId(id);
                    const q = p?.question || { questionId: p?.questionId, name: p?.questionName };
                    setSelectedQuestion(q);
                    setSelectedOutcome(null);
                    setConfidenceOverride(null);
                    setAmount("");
                    setErrorMsg("");
                    setSuppressQuestionPredictionFetch(true);
                    setSelectedQuestionPrediction(p);
                    fetchBalance();
                  }}
                />
              ) : activeTab === 'completed' ? (
                <CompletedPredictionsList
                  onOpen={(p: any) => {
                    const id = String(p?.eventId || "");
                    setSelectedEventId(id);
                    const q = p?.question || { questionId: p?.questionId, name: p?.questionName };
                    setSelectedQuestion(q);
                    setSelectedOutcome(null);
                    setConfidenceOverride(null);
                    setAmount("");
                    setErrorMsg("");
                    setSuppressQuestionPredictionFetch(true);
                    setSelectedQuestionPrediction(p);
                    fetchBalance();
                  }}
                />
              ) : activeTab === 'cancelled' ? (
                <CancelledPredictionsList
                  onOpen={(p: any) => {
                    const id = String(p?.eventId || "");
                    setSelectedEventId(id);
                    const q = p?.question || { questionId: p?.questionId, name: p?.questionName };
                    setSelectedQuestion(q);
                    setSelectedOutcome(null);
                    setConfidenceOverride(null);
                    setAmount("");
                    setErrorMsg("");
                    setSuppressQuestionPredictionFetch(true);
                    setSelectedQuestionPrediction(p);
                    fetchBalance();
                  }}
                />
              ) : activeTab === 'exited' ? (
                <ExitedPredictionsList
                  onOpen={(p: any) => {
                    const id = String(p?.eventId || "");
                    setSelectedEventId(id);
                    const q = p?.question || { questionId: p?.questionId, name: p?.questionName };
                    setSelectedQuestion(q);
                    setSelectedOutcome(null);
                    setConfidenceOverride(null);
                    setAmount("");
                    setErrorMsg("");
                    setSuppressQuestionPredictionFetch(true);
                    setSelectedQuestionPrediction(p);
                    fetchBalance();
                  }}
                />
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
                           const teams = Array.isArray(event?.teams)
                        ? event.teams
                        : Array.isArray(event?.sportEvent?.teams)
                        ? event.sportEvent.teams
                        : [];
                      const getName = (t: any) => [t?.name, t?.shortName, t?.displayName, t?.teamName, t?.abbreviation].find((v: any) => typeof v === "string" && v.trim().length > 0) || "Team";
                      const aName = getName(teams?.[0] || {});
                      const bName = getName(teams?.[1] || {});
                      // Derive probabilities for team A and B from event.stats.result_prediction with robust parsing
                      const statsStr = typeof event?.stats === "string" ? event.stats : JSON.stringify(event?.stats ?? {});
                      let aProb = 50;
                      let bProb = 50;
                      try {
                        const statsObj = JSON.parse(statsStr || "{}");
                        const pred = statsObj?.result_prediction;
                        const parseProb = (v: any) => {
                          const raw = typeof v === "string" ? v.replace("%", "").trim() : v;
                          let n = Number(raw);
                          if (!isFinite(n) || isNaN(n)) return 50;
                          if (n <= 1) n = n * 100; // treat fractional
                          return Math.max(0, Math.min(100, n));
                        };
                        if (Array.isArray(pred) && pred.length >= 2) {
                          aProb = parseProb(pred[0]?.value);
                          bProb = parseProb(pred[1]?.value);
                        }
                      } catch {
                        // default 50/50
                      }
                      setSelectedTeams({ a: { name: aName, prob: aProb }, b: { name: bName, prob: bProb } });
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
  const teams = Array.isArray(event?.teams)
                        ? event.teams
                        : Array.isArray(event?.sportEvent?.teams)
                        ? event.sportEvent.teams
                        : [];
                      const getName = (t: any) => [t?.name, t?.shortName, t?.displayName, t?.teamName, t?.abbreviation].find((v: any) => typeof v === "string" && v.trim().length > 0) || "Team";
                      const aName = getName(teams?.[0] || {});
                      const bName = getName(teams?.[1] || {});
                      const statsStr = typeof event?.stats === "string" ? event.stats : JSON.stringify(event?.stats ?? {});
                      let aProb = 50;
                      let bProb = 50;
                      try {
                        const statsObj = JSON.parse(statsStr || "{}");
                        const pred = statsObj?.result_prediction;
                        const parseProb = (v: any) => {
                          const raw = typeof v === "string" ? v.replace("%", "").trim() : v;
                          let n = Number(raw);
                          if (!isFinite(n) || isNaN(n)) return 50;
                          if (n <= 1) n = n * 100;
                          return Math.max(0, Math.min(100, n));
                        };
                        if (Array.isArray(pred) && pred.length >= 2) {
                          aProb = parseProb(pred[0]?.value);
                          bProb = parseProb(pred[1]?.value);
                        }
                      } catch {}
                      setSelectedTeams({ a: { name: aName, prob: aProb }, b: { name: bName, prob: bProb } });
                      fetchBalance();                        }}
                      />
                      {selectedEventId === String(event.id ?? event.eventId ?? '') && (
                       
                        <EventDetails
                      eventId={String(event.id ?? event.eventId ?? "")}
                      onBack={() => {
                        setSelectedEventId(null);
                        setSelectedQuestion(null);
                        setSelectedOutcome(null);
                        setConfidenceOverride(null);
                        setAmount("");
                        setSelectedTeams(null);
                        setBalance(null);
                        setErrorMsg("");
                        setSuppressQuestionPredictionFetch(false);

                            setExitAmount('');
                            setExitConfidence(null);
                            setIsMobilePanelOpen(false);
                      }}
                      onPredict={(question,  predictionId) => {
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
                        if (predictionId) {
                          setSuppressQuestionPredictionFetch(true);
                          (async () => {
                            try {
                              const byId = await api.post<any>("/prediction/v1/getbyid", { predictionId });
                              const mine = byId?.prediction || null;
                              setSelectedQuestionPrediction(mine);
                            } catch (e) {
                              setSelectedQuestionPrediction(null);
                            }
                          })();
                        } else {
                          setSelectedQuestionPrediction(null);
                        }
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
                      disabled={Boolean(selectedQuestionPrediction && selectedQuestionPrediction.predictionStatus && selectedQuestionPrediction.predictionStatus !== "PREDICTION_STATUS_CANCELLED" && selectedQuestionPrediction.predictionStatus !== "PREDICTION_STATUS_EXITED")}

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
