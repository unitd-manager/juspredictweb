import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Users, DollarSign, AlertCircle, Loader2 } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Footer2 } from '../components/Footer2';
import { Button } from '../components/ui/Button';
import { api } from '../api/client';

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
    // fallback
  }

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

  return (
    <div className="rounded-xl border border-white/10 bg-dark-card p-6 mt-2">
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
export const Sports: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<any | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [confidenceOverride, setConfidenceOverride] = useState<number | null>(null);
  const [selectedTeams, setSelectedTeams] = useState<{
    a: { name: string; prob: number };
    b: { name: string; prob: number };
  } | null>(null);
  console.log(selectedTeams);
  const [balance, setBalance] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'all'|'open' | 'live' | 'completed' | 'cancelled' | 'exited'>('live');
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-dark-bg text-gray-light">
      <PageHeader
        title="Live Prediction Markets"
        tagline="Make your prediction. Own your call. Skill-based matching with transparent odds."
        compact={true}
        isSubpage={true}
      />

      <div className="px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Sports */}
            <aside className="w-full lg:w-64 lg:flex-shrink-0">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sticky top-24">
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
              {/* Horizontal Tabs */}
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

              {isLoading ? (
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
                        }}
                        onQuickPredict={(question, eventId) => {
                          const id = String(event.id ?? event.eventId ?? eventId ?? '');
                          setSelectedEventId(id);
                          setSelectedQuestion(question);
                          setSelectedOutcome(null);
                          setConfidenceOverride(null);
                          setAmount('');
                          setErrorMsg('');
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
                          }}
                          onPredict={(question) => {
                            setSelectedQuestion(question);
                            setSelectedOutcome(null);
                            setConfidenceOverride(null);
                            setAmount('');
                            setErrorMsg('');
                            fetchBalance();
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
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sticky top-24">
                <h3 className="text-sm text-gray-text mb-1">Make Your Prediction</h3>
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
                      }}
                      className="w-full py-3 bg-primary text-dark-bg hover:bg-primary/90 rounded-lg font-semibold transition-all"
                    >
                      Ok
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
          </div>
        </div>
      </div>

      <Footer2 />
    </div>
  );
};

export default Sports;
