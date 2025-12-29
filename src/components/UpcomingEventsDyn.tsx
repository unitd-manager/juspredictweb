"use client"

import { Calendar, CheckCircle } from "lucide-react"
import { FaFootballBall } from "react-icons/fa";
import { GiBaseballBat, GiBasketballBall, GiCricketBat, GiHockey, GiTennisBall } from "react-icons/gi";
import { Button } from "./ui/Button"
import { useEffect, useState } from "react"
import { api } from "../api/api"
//import { predictionApi } from "../api/prediction"
//import { predictionApi } from "../api/prediction"

/* ---------------- TYPES ---------------- */

export interface PredictionOption {
  id: string
  label: string
  percentage?: number
}

export interface Match {
  id: string
  sport: string
  title: string
  date: string
  time: string
  venue: string
  timer: string
  status: "live" | "upcoming" | "completed"
  question: string
  questionId?: string
  options?: PredictionOption[]
}

/* -------- EVENT QUESTION MAP -------- */

type EventQuestion = {
  questionId: string
  questionText: string
  options: PredictionOption[]
}
// interface CreateOrderResponse {
//   status?: {
//     type?: "SUCCESS" | "ERROR"
//     details?: { code?: string; message?: string }[]
//   }
//   orderId?: string
// }

type EventQuestionMap = Record<string, EventQuestion>

/* ---------------- PREDICTION MODAL ---------------- */
export interface PredictionModalEvent {
  id: string
  title: string
  question: string
  questionId?: string
  options: PredictionOption[]
}

// interface PredictionModalProps {
//   open: boolean
//   onClose: () => void
//   event: PredictionModalEvent | null
// }


interface PredictionModalProps {
  open: boolean
  onClose: () => void
  event: {
    id: string
    title: string
    question: string
    questionId?: string
    options?: {
      id: string
      label: string
      percentage?: number
    }[]
  } | null
}

export const PredictionModal: React.FC<PredictionModalProps> = ({
  open,
  onClose,
  event,
}) => {
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null)
  const [confidence, setConfidence] = useState<number>(50)
  const [amount, setAmount] = useState<number>(100)
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false)

  const [balance, setBalance] = useState<any | null>(null);

  /* ---------------- RESET ON OPEN/CLOSE ---------------- */

  useEffect(() => {
    if (!open) {
      setSelectedOutcome(null)
      setConfidence(50)
      setAmount(100)
      setShowSuccessMessage(false)
    }
  }, [open])

  /* ---------------- FETCH BALANCE WHEN MODAL OPENS ---------------- */

  useEffect(() => {
    if (open) {
      fetchBalance()
    }
  }, [open])

  /* ---------------- SUBMIT ---------------- */

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

  const handleMakePrediction = async () => {
    if (!event || !event.questionId) return
    if (!selectedOutcome || amount <= 0) return

    try {
      const payload = {
        eventId: event.id,
        questionId: event.questionId,
        amount: amount.toString(),

        predictionDetails: {
          selectedPredictionOutcome: selectedOutcome,
          selectedPredictionChoice: true,
        },

        modifiers: {
          creditDiscount: "0",
          creditMarkup: "0",
          percentage: confidence.toString(),
          updatedPercentage: "0",
        },
      }

      console.log("CreateOrder Payload →", payload)

      const res = await api.post("/order/v1/createorder", payload)

      if ((res as any)?.status?.type === "SUCCESS") {
        setShowSuccessMessage(true)
        setTimeout(() => {
          setShowSuccessMessage(false)
          onClose()
        }, 2000)
      } else {
        console.error("CreateOrder failed:", res)
      }
    } catch (err) {
      console.error("Prediction failed", err)
    }
  }

  if (!open || !event) return null

  /* ---------------- SUCCESS STATE ---------------- */

  if (showSuccessMessage) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
        <div className="bg-[#111] w-full max-w-md rounded-xl p-6 shadow-xl flex flex-col items-center justify-center h-[200px]">
          <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
            <CheckCircle className="w-8 h-8" />
            Order placed successfully!
          </h2>
          <p className="text-gray-400 text-center">
            Your prediction has been submitted.
          </p>
        </div>
      </div>
    )
  }

  /* ---------------- MODAL ---------------- */

  const availableBalance = getAvailableBalance(balance)

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-[#111] w-full max-w-md rounded-xl p-6 shadow-xl relative animate-fadeIn">

        {/* Close */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-xl font-bold text-white mb-1">
          Make Your Prediction
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Own your call. Trade with confidence.
        </p>

        {/* Question */}
        <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 mb-4">
          <h3 className="text-white font-semibold mb-1">
            {event.question}
          </h3>
          <span className="text-gray-400 text-sm">
            {event.title}
          </span>
        </div>

        {/* Balance (dynamic) */}
        <div className="bg-[#0b3d2e] border border-[#0f8a54] text-[#00ff87] p-4 rounded-lg mb-4 font-bold">
          Available Balance: {formatCurrency(availableBalance)}
        </div>

        {/* OPTIONS (DYNAMIC) */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {(event.options ?? []).map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedOutcome(opt.id)}
              className={`bg-[#1a1a1a] border py-3 rounded-lg text-white transition ${
                selectedOutcome === opt.id
                  ? "border-primary"
                  : "border-white/10"
              }`}
            >
              {opt.label}
              <br />
              <span className="text-gray-400 text-xs">
                {opt.percentage ?? 0}%
              </span>
            </button>
          ))}
        </div>

        <span className="text-gray-400 text-xs text-center block mb-3">
          Select an Outcome
        </span>

        {/* Confidence */}
        <div className="flex items-center justify-between mb-2">
          <label className="text-gray-400 text-sm">Confidence</label>
          <span className="text-gray-400 text-sm">
            {confidence}%
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={confidence}
          onChange={(e) => setConfidence(Number(e.target.value))}
          className="w-full mb-4"
        />

        {/* Amount */}
        <label className="text-gray-400 text-sm">Amount</label>
        <input
          type="number"
          className="w-full bg-[#1a1a1a] border border-white/10 p-3 rounded-lg text-white mb-4"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />

        {/* Quick Amounts */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[10, 50, 100, 500].map((a) => (
            <button
              key={a}
              onClick={() => setAmount(a)}
              className="bg-[#1a1a1a] border border-white/10 text-white py-2 rounded-lg"
            >
              ${a}
            </button>
          ))}
        </div>

        {/* Submit */}
        <button
          onClick={handleMakePrediction}
          disabled={!selectedOutcome || amount <= 0}
          className={`w-full py-3 rounded-lg font-semibold text-white ${
            selectedOutcome && amount > 0
              ? "bg-primary hover:bg-primary/90"
              : "bg-gray-700 opacity-70 cursor-not-allowed"
          }`}
        >
          Predict Now
        </button>

      </div>
    </div>
  )
}


/* ---------------- UPCOMING EVENTS ---------------- */

export const UpcomingEventsDyn = () => {
  const [events, setEvents] = useState<Match[]>([])
  const [eventQuestions, setEventQuestions] = useState<EventQuestionMap>({})
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)

  // ✅ TAB STATE (NEW)
  const [activeTab, setActiveTab] = useState<
    "all" | "live" | "trending" | "upcoming"
  >("all")

  /* -------- FETCH EVENTS -------- */
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      try {
        const res = await api.post<any>("/event/v1/listevents", {
          status: ["EVENT_STATUS_UPCOMING", "EVENT_STATUS_ACTIVE"],
          category: "EVENT_CATEGORY_SPORTS",
          eventHierarchy: "CHILD_EVENT",
          pageNumber: 1,
          pageSize: 20,
        })

        const evs = res.events ?? []

        const mapped: Match[] = evs.map((e: any) => {
          const teams = e.sportEvent?.teams ?? []
          const start = new Date(Number(e.startDate) * 1000)

          return {
            id: e.id,
            sport:
              e.sportEvent?.sportType?.replace("SPORT_TYPE_", "") ?? "CRICKET",
            title:
              teams.length === 2
                ? `${teams[0].shortName} vs ${teams[1].shortName}`
                : e.shortName,
            date: start.toLocaleDateString(),
            time: start.toLocaleTimeString(),
            venue: e.venues?.[0]?.name ?? "TBD",
            timer:
              e.status === "EVENT_STATUS_ACTIVE" ? "Live" : "Upcoming",
            status:
              e.status === "EVENT_STATUS_ACTIVE"
                ? "live"
                : "upcoming",
            question: "Loading market...",
          }
        })

        setEvents(mapped)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  /* -------- FETCH QUESTIONS -------- */
  useEffect(() => {
    if (events.length === 0) return

    const fetchQuestions = async () => {
      const map: EventQuestionMap = {}

      await Promise.all(
        events.map(async (event) => {
          try {
            const res = await api.post<any>("/event/v1/getquestions", {
              eventId: event.id,
              getEventQuestions: true,
              questionsPageInfo: { pageNumber: 1, pageSize: 1 },
            })

            if (res.status?.type !== "SUCCESS") return

            const q = res.questions?.[0]
            if (!q) return

            map[event.id] = {
              questionId: q.questionId,
              questionText: q.description || q.name || "Prediction Market",
          options:
  q.activity?.marketDataDetails?.map((m: any) => ({
    id: m.outcome,          
    label: m.outcome,       
    percentage: Number(m.impliedProbability) || 0,
  })) ?? []


            }
          } catch (err) {
            console.error("Question fetch failed", err)
          }
        })
      )

      setEventQuestions(map)
    }

    fetchQuestions()
  }, [events])

  /* -------- FILTERED EVENTS (NEW) -------- */
  const filteredEvents =
    activeTab === "all"
      ? events
      : events.filter((e) => e.status === activeTab)

  /* -------- RENDER -------- */
  return (
    <section className="py-12 bg-[#1A1A1D]">
      <div className="max-w-[1400px] mx-auto px-4">

        {/* ✅ TABS (SAME AS STATIC) */}
        <div className="flex flex-wrap gap-2 bg-dark-card p-1 rounded-lg border border-white/10 mb-6">
          {["all", "live", "trending", "upcoming"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all
                ${
                  activeTab === tab
                    ? "bg-accent-yellow text-black shadow-sm"
                    : "text-gray-text hover:text-white"
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {isLoading && (
          <p className="text-gray-400 mb-4">Loading events…</p>
        )}

        {/* ✅ EVENT GRID */}
        <div className="grid md:grid-cols-4 gap-4">
          {filteredEvents.map((event) => {
            const q = eventQuestions[event.id]

            return (
              <div
                key={event.id}
                className="bg-[#1F2C34] border border-white/5 rounded-xl p-4
                  hover:border-primary/30 transition-all duration-300
                  group relative overflow-hidden flex flex-col justify-between"
              >
                {/* Header */}
                <div className="flex justify-between mb-2">
                  {/* Sport icon instead of text */}
                  <span className="px-2 py-1 rounded-md bg-gray-500 text-white text-[10px] font-medium border border-gray-400 flex items-center gap-1">
                    {event.sport === "CRICKET" && <GiCricketBat />}
                    {event.sport === "FOOTBALL" && <FaFootballBall />}
                    {event.sport === "TENNIS" && <GiTennisBall />}
                    {event.sport === "BASKETBALL" && <GiBasketballBall />}
                    {event.sport === "BASEBALL" && <GiBaseballBat />}
                    {event.sport === "HOCKEY" && <GiHockey />}
                    {/* fallback text if no icon mapped */}
                    {!["CRICKET","FOOTBALL","TENNIS","BASKETBALL","BASEBALL","HOCKEY"].includes(event.sport) && event.sport}
                  </span>

                  <span
                    className={`px-2 py-1 rounded-md text-white text-[10px] font-medium border
                      ${
                        event.status === "live"
                          ? "bg-red-700 border-red-600"
                          : "bg-primary/80 border-primary/70"
                      }`}
                  >
                    {event.timer}
                  </span>
                </div>

                {/* Title */}
                <p
                  className={`.bg-\[\#0D0D10\] {
    --tw-bg-opacity: .1;
    background-color: rgb(255 255 255 / var(--tw-bg-opacity, .1));
}
                    ${
                      event.status === "live"
                        ? "text-red-400 group-hover:text-red-300"
                        : "text-white group-hover:text-primary"
                    }`}
                >
                  {event.title}
                </p>

                {/* Question */}
                <p className="text-sm text-gray-300 mb-3 leading-tight font-medium h-10 flex items-center">
                  {q?.questionText ?? "Loading ..."}
                </p>

                {/* Options */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {(q?.options ?? []).slice(0, 2).map((opt, idx) => (
                    <div
                      key={opt.id}
                      className="bg-[#1e1e1e] border border-white/10 rounded-lg py-2 text-center"
                    >
                      <span
                        className={`font-semibold ${
                          idx === 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {opt.label} {opt.percentage}%
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 flex gap-1">
                    <Calendar size={12} /> {event.date}
                  </span>

                  <Button
                    size="sm"
                    className=".bg-\[\#0D0D10\] {
    --tw-bg-opacity: .1;
    background-color: rgb(255 255 255 / var(--tw-bg-opacity, .1));
}"
                    onClick={() => {
                      const token = localStorage.getItem("auth_token");
                      if (!token) {
                        alert("Please login to make predictions");
                        window.location.href = "/login";
                        return;
                      }
                      setSelectedMatch({
                        ...event,
                        question: q?.questionText!,
                        questionId: q?.questionId!,
                        options: q?.options!,
                      });
                    }}
                  >
                    Predict
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* MODAL */}
        <PredictionModal
          open={!!selectedMatch}
          onClose={() => setSelectedMatch(null)}
          event={selectedMatch}
        />
      </div>
    </section>
  )
}

