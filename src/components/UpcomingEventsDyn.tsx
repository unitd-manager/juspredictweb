// "use client"

// import { CheckCircle } from "lucide-react"
// import { Button } from "./ui/Button"
// import { useEffect, useState } from "react"
// import { api } from "../api/api"

// /* ---------------- TYPES ---------------- */

// export interface QuestionOption {
//   id: string
//   label: string
//   percentage: number
// }

// export interface QuestionCard {
//   questionId: string
//   question: string
//   questionType: string
//   options: QuestionOption[]
//   users: number
//   volume: string
// }

// /* ---------------- PREDICTION MODAL ---------------- */

// interface PredictionModalProps {
//   open: boolean
//   onClose: () => void
//   question: QuestionCard | null
// }

// export const PredictionModal: React.FC<PredictionModalProps> = ({
//   open,
//   onClose,
//   question,
// }) => {
//   const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null)
//   const [confidence, setConfidence] = useState<number>(50)
//   const [amount, setAmount] = useState<number>(100)
//   const [showSuccessMessage, setShowSuccessMessage] = useState(false)
//   const [balance, setBalance] = useState<any | null>(null)

//   /* ---------------- RESET ---------------- */
//   useEffect(() => {
//     if (!open) {
//       setSelectedOutcome(null)
//       setConfidence(50)
//       setAmount(100)
//       setShowSuccessMessage(false)
//       setBalance(null)
//     }
//   }, [open])

//   /* ---------------- FETCH BALANCE ---------------- */
//   useEffect(() => {
//     if (!open) return

//     const fetchBalance = async () => {
//       try {
//         const res = await api.post<any>("/balances/v1/get", {})
//         if (res?.status?.type === "SUCCESS") {
//           setBalance(res)
//         }
//       } catch (e) {
//         console.error("Balance fetch failed", e)
//       }
//     }

//     fetchBalance()
//   }, [open])

//   const getAvailableBalance = () => {
//     const n =
//       Number(balance?.availableBalance) ||
//       Number(balance?.available) ||
//       0
//     return isNaN(n) ? 0 : n
//   }

//   const handlePredict = async () => {
//     if (!question || !selectedOutcome || amount <= 0) return

//     try {
//       const payload = {
//         questionId: question.questionId,
//         amount: amount.toString(),
//         predictionDetails: {
//           selectedPredictionOutcome: selectedOutcome,
//           selectedPredictionChoice: true,
//         },
//         modifiers: {
//           creditDiscount: "0",
//           creditMarkup: "0",
//           percentage: confidence.toString(),
//           updatedPercentage: "0",
//         },
//       }

//       const res = await api.post("/order/v1/createorder", payload)

//       if (res?.status?.type === "SUCCESS") {
//         setShowSuccessMessage(true)
//         setTimeout(() => {
//           setShowSuccessMessage(false)
//           onClose()
//         }, 1500)
//       }
//     } catch (err) {
//       console.error("Prediction failed", err)
//     }
//   }

//   if (!open || !question) return null

//   /* ---------------- SUCCESS STATE ---------------- */
//   if (showSuccessMessage) {
//     return (
//       <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
//         <div className="bg-[#111] rounded-xl p-6 text-center w-full max-w-sm">
//           <CheckCircle className="w-10 h-10 text-primary mx-auto mb-3" />
//           <p className="text-white font-semibold">
//             Prediction placed successfully!
//           </p>
//         </div>
//       </div>
//     )
//   }

//   /* ---------------- MODAL ---------------- */
//   return (
//     <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
//       <div className="bg-[#111] w-full max-w-md rounded-xl p-6 relative">

//         {/* Close */}
//         <button
//           className="absolute top-3 right-3 text-gray-400 hover:text-white"
//           onClick={onClose}
//         >
//           ✕
//         </button>

//         {/* Header */}
//         <h2 className="text-xl font-bold text-white mb-1">
//           Make Your Prediction
//         </h2>
//         <p className="text-sm text-gray-400 mb-4">
//           Own your call. Trade with confidence.
//         </p>

//         {/* Question */}
//         <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 mb-4">
//           <h3 className="text-white font-semibold">
//             {question.question}
//           </h3>
//         </div>

//         {/* Balance */}
//         <div className="bg-[#0b3d2e] border border-[#0f8a54] text-[#00ff87] p-3 rounded-lg mb-4 font-bold text-sm">
//           Available Balance: ${getAvailableBalance().toFixed(2)}
//         </div>

//         {/* OPTIONS */}
//         <div className="grid grid-cols-2 gap-3 mb-4">
//           {question.options.map((opt) => (
//             <button
//               key={opt.id}
//               onClick={() => setSelectedOutcome(opt.id)}
//               className={`py-3 rounded-lg border text-white transition ${
//                 selectedOutcome === opt.id
//                   ? "border-primary"
//                   : "border-white/10"
//               }`}
//             >
//               {opt.label}
//               <div className="text-xs text-gray-400">
//                 {opt.percentage}%
//               </div>
//             </button>
//           ))}
//         </div>

//         <span className="text-xs text-gray-400 block text-center mb-3">
//           Select an Outcome
//         </span>

//         {/* Confidence */}
//         <div className="flex justify-between text-sm text-gray-400 mb-1">
//           <span>Confidence</span>
//           <span>{confidence}%</span>
//         </div>

//         <input
//           type="range"
//           min="0"
//           max="100"
//           value={confidence}
//           onChange={(e) => setConfidence(Number(e.target.value))}
//           className="w-full mb-4"
//         />

//         {/* Amount */}
//         <label className="text-sm text-gray-400">Amount</label>
//         <input
//           type="number"
//           className="w-full bg-[#1a1a1a] border border-white/10 p-3 rounded-lg text-white mb-3"
//           value={amount}
//           onChange={(e) => setAmount(Number(e.target.value))}
//         />

//         {/* Quick Amounts */}
//         <div className="grid grid-cols-4 gap-2 mb-4">
//           {[10, 50, 100, 500].map((a) => (
//             <button
//               key={a}
//               onClick={() => setAmount(a)}
//               className="bg-[#1a1a1a] border border-white/10 text-white py-2 rounded-lg"
//             >
//               ${a}
//             </button>
//           ))}
//         </div>

//         {/* Submit */}
//         <Button
//           className="w-full"
//           disabled={!selectedOutcome || amount <= 0}
//           onClick={handlePredict}
//         >
//           Predict Now
//         </Button>
//       </div>
//     </div>
//   )
// }


// /* ---------------- QUESTIONS LIST ---------------- */

// export const UpcomingEventsDyn = () => {
//   const [questions, setQuestions] = useState<QuestionCard[]>([])
//   const [selectedQuestion, setSelectedQuestion] =
//     useState<QuestionCard | null>(null)

//   const [page, setPage] = useState(1)
//   const [pageSize] = useState(8)
//   const [isLoading, setIsLoading] = useState(false)
//   const [hasMore, setHasMore] = useState(true)

//   /* -------- FETCH QUESTIONS (LOAD MORE) -------- */
//   const fetchQuestions = async () => {
//     if (isLoading || !hasMore) return

//     setIsLoading(true)
//     try {
//       const res = await api.post<any>("/event/v1/getquestions", {
//         pageRequest: {
//           pageNumber: page,
//           pageSize,
//         },
//       })

//       if (res?.status?.type !== "SUCCESS") return

//       const newQuestions: QuestionCard[] = (res.questions ?? []).map(
//         (q: any) => ({
//           questionId: q.questionId,
//           question: q.description || q.name || "Prediction Market",
//           questionType: q.questionType,
//           users: q.activity?.questionUsers ?? 0,
//           volume: q.activity?.questionVolume ?? "0",
//           options:
//             q.activity?.marketDataDetails?.map((m: any) => ({
//               id: m.outcome,
//               label: m.outcome,
//               percentage: Number(m.impliedProbability) || 0,
//             })) ?? [],
//         })
//       )

//       setQuestions((prev) => [...prev, ...newQuestions])

//       const totalPages = res.pageInfo?.totalPages ?? 1
//       if (page >= totalPages) {
//         setHasMore(false)
//       } else {
//         setPage((p) => p + 1)
//       }
//     } catch (err) {
//       console.error("Failed to fetch questions", err)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   /* -------- INITIAL LOAD -------- */
//   useEffect(() => {
//     fetchQuestions()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   return (
//     <section className="py-12 bg-[#1A1A1D]">
//       <div className="max-w-[1400px] mx-auto px-4">

//         {/* QUESTIONS GRID */}
//         <div className="grid md:grid-cols-4 gap-4">
//           {questions.map((q) => (
//             <div
//               key={q.questionId}
//               className="bg-[#1F2C34] border border-white/5 rounded-xl p-4
//               hover:border-primary/30 transition-all flex flex-col justify-between"
//             >
//               {/* HEADER */}
//               <div className="flex justify-between mb-2">
//                 <span className="px-2 py-1 rounded-md bg-gray-600 text-white text-[10px]">
//                   {q.questionType.replace("QUESTION_TYPE_", "")}
//                 </span>
//                 <span className="px-2 py-1 rounded-md bg-primary/80 text-black text-[10px]">
//                   Active
//                 </span>
//               </div>

//               {/* QUESTION */}
//               <p className="text-white font-semibold text-sm mb-3 h-12">
//                 {q.question}
//               </p>

//               {/* OPTIONS */}
//               <div className="grid grid-cols-2 gap-2 mb-4">
//                 {q.options.slice(0, 4).map((opt) => (
//                   <div
//                     key={opt.id}
//                     className="bg-[#1e1e1e] border border-white/10 rounded-lg py-2 text-center"
//                   >
//                     <span className="text-green-400 font-semibold text-sm">
//                       {opt.label}
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               {/* FOOTER */}
//               <div className="flex justify-between items-center text-xs text-gray-400">
//                 <span>👥 {q.users}</span>
//                 <Button
//                   size="sm"
//                   onClick={() => {
//                     const token = localStorage.getItem("auth_token")
//                     if (!token) {
//                       window.location.href = "/login"
//                       return
//                     }
//                     setSelectedQuestion(q)
//                   }}
//                 >
//                   Predict
//                 </Button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* LOAD MORE */}
//         {hasMore && (
//           <div className="flex justify-center mt-8">
//             <Button
//               onClick={fetchQuestions}
//               disabled={isLoading}
//               className="px-8"
//             >
//               {isLoading ? "Loading..." : "Load More"}
//             </Button>
//           </div>
//         )}

//         {!hasMore && (
//           <p className="text-center text-gray-500 mt-6 text-sm">
//             No more questions available
//           </p>
//         )}

//         {/* MODAL */}
//         <PredictionModal
//           open={!!selectedQuestion}
//           onClose={() => setSelectedQuestion(null)}
//           question={selectedQuestion}
//         />
//       </div>
//     </section>
//   )
// }

// export default UpcomingEventsDyn
"use client"

import { CheckCircle } from "lucide-react"
import { Button } from "./ui/Button"
import { useEffect, useState } from "react"
import { api } from "../api/api"

/* ---------------- TYPES ---------------- */

export interface QuestionOption {
  id: string
  label: string
  percentage: number
}

export interface QuestionCard {
  questionId: string
  eventId?: string
  question: string
  questionType: string
  options: QuestionOption[]
  users: number
  volume: string
}

/* ---------------- PREDICTION MODAL ---------------- */

interface PredictionModalProps {
  open: boolean
  onClose: () => void
  question: QuestionCard | null
}

export const PredictionModal: React.FC<PredictionModalProps> = ({
  open,
  onClose,
  question,
}) => {
  const [selectedOutcome, setSelectedOutcome] = useState<QuestionOption | null>(null)
  const [confidence, setConfidence] = useState<number>(50)
  const [amount, setAmount] = useState<number>(100)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [balance, setBalance] = useState<any | null>(null)
console.log('question',question);
  /* RESET */
  useEffect(() => {
    if (!open) {
      setSelectedOutcome(null)
      setConfidence(50)
      setAmount(100)
      setShowSuccessMessage(false)
      setBalance(null)
    }
  }, [open])

  /* FETCH BALANCE */
  useEffect(() => {
    if (!open) return

    const fetchBalance = async () => {
      try {
        const res = await api.post<any>("/balances/v1/get", {})
        if (res?.status?.type === "SUCCESS") {
          setBalance(res)
        }
      } catch (e) {
        console.error("Balance fetch failed", e)
      }
    }

    fetchBalance()
  }, [open])

  const getAvailableBalance = () => {
    const n =
      Number(balance?.availableBalance) ||
      Number(balance?.available) ||
      0
    return isNaN(n) ? 0 : n
  }

  const formatCurrency = (n: number) => `$${n.toFixed(2)}`;
  const handlePredict = async () => {
    if (!question || !selectedOutcome || amount <= 0) return

    try {
      const payload = {
        questionId: question.questionId,
        eventId: question.eventId,
        amount: amount.toString(),
        predictionDetails: {
          selectedPredictionOutcome: selectedOutcome?.label,
          selectedPredictionChoice: true,
        },
        modifiers: {
          creditDiscount: "0",
          creditMarkup: "0",
          percentage: confidence.toString(),
          updatedPercentage: "0",
        },
      }

      const res = await api.post<any>("/order/v1/createorder", payload)

      if (res?.status?.type === "SUCCESS") {
        setShowSuccessMessage(true)
        setTimeout(() => {
          setShowSuccessMessage(false)
          onClose()
        }, 1500)
      }
    } catch (err) {
      console.error("Prediction failed", err)
    }
  }

  if (!open || !question) return null

  if (showSuccessMessage) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-[#111] rounded-xl p-6 text-center w-full max-w-sm">
          <CheckCircle className="w-10 h-10 text-primary mx-auto mb-3" />
          <p className="text-white font-semibold">
            Prediction placed successfully!
          </p>
        </div>
      </div>
    )
  }

 if (!question) return null;

return (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 px-4 overflow-y-auto">
  <div className="flex items-start justify-center min-h-screen py-8">
    <div className="bg-[#111] w-full max-w-md rounded-xl p-6 relative max-h-[90vh] overflow-y-auto">

      <button
        className="absolute top-3 right-3 text-gray-400 hover:text-white"
        onClick={onClose}
      >
        ✕
      </button>

      <h2 className="text-xl font-bold text-white mb-1">
        Make Your Prediction
      </h2>
      <p className="text-sm text-gray-400 mb-4">
        Own your call. Trade with confidence.
      </p>

      {/* Question */}
      <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 mb-4">
        <h3 className="text-white font-semibold">
          {question?.question}
        </h3>
      </div>

      {/* Balance */}
      <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white">Available Balance</span>
          <span className="text-primary font-semibold">
            {formatCurrency(getAvailableBalance())}
          </span>
        </div>
      </div>

      {/* Outcomes */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {Array.isArray(question?.options) &&
          question.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                setSelectedOutcome(opt);
                setConfidence(Number(opt.percentage || 0));
              }}
              className={`p-3 rounded-lg border transition-all text-sm font-medium ${
                selectedOutcome?.id === opt.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-white/10 bg-dark-card text-white hover:border-primary/30"
              }`}
            >
              {opt.label}
              <div className="text-xs text-gray-text mt-1">
                {opt.percentage}%
              </div>
            </button>
          ))}
      </div>

      {/* Confidence Meter */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-text">Confidence</span>
          <span className="text-xs text-white font-semibold">
            {confidence}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={confidence}
          onChange={(e) => setConfidence(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Amount */}
      <div>
        <label className="block text-xs text-gray-text mb-2">
          Amount
        </label>
        <input
          className="w-full rounded-lg bg-dark-card border border-white/10 p-3 text-white placeholder:text-gray-muted focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all"
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="$100"
        />

        {amount && Number(amount) > 0 && (
          <div className="mt-2 text-xs text-gray-text">
            Remaining:{" "}
            {formatCurrency(
              Math.max(
                0,
                getAvailableBalance() - Number(amount)
              )
            )}
          </div>
        )}

        <div className="mt-3 grid grid-cols-4 gap-2">
          {(["10", "50", "100", "500"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setAmount(Number(v))}
              className="py-2 rounded-lg bg-dark-card border border-white/10 text-sm text-white hover:border-primary/30 transition-all"
            >
              ${v}
            </button>
          ))}
        </div>
      </div>

      {/* Potential Returns */}
      {selectedOutcome && amount && Number(amount) > 0 && (
        <div className="bg-dark-card border border-white/10 rounded-lg p-4 mt-4">
          <h4 className="text-sm text-white font-semibold mb-3">
            Potential Returns
          </h4>

          {(() => {
            const amt = Number(amount);
            const profit = (amt * confidence) / 100;
            const totalReturn = amt + profit;

            return (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-text">Investment</span>
                  <span className="text-white font-medium">
                    {formatCurrency(amt)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-text">Prediction</span>
                  <span className="text-white font-medium">
                    {confidence}%
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-text">Potential Profit</span>
                  <span className="text-primary font-semibold">
                    +{formatCurrency(profit)}
                  </span>
                </div>

                <div className="flex justify-between pt-2 border-t border-white/10">
                  <span className="text-white">Total Return</span>
                  <span className="text-white font-semibold">
                    {formatCurrency(totalReturn)}
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      <Button
        className="w-full mt-4"
        disabled={!selectedOutcome || Number(amount) <= 0}
        onClick={handlePredict}
      >
        Predict Now
      </Button>
    </div>
    </div>
  </div>
);


}

/* ---------------- QUESTIONS LIST ---------------- */

export const UpcomingEventsDyn = () => {
  const [questions, setQuestions] = useState<QuestionCard[]>([])
  const [selectedQuestion, setSelectedQuestion] =
    useState<QuestionCard | null>(null)

  const [activeTab, setActiveTab] = useState<
    "all" | "live" | "upcoming" | "cricket" | "NFL"
  >("all")

  const [page, setPage] = useState(1)
  const [pageSize] = useState(8)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  /* FETCH QUESTIONS */
  const fetchQuestions = async (reset = false) => {
    if (isLoading || (!hasMore && !reset)) return

    setIsLoading(true)

    try {
      const payload: any = {
        pageRequest: {
          pageNumber: reset ? 1 : page,
          pageSize,
        },
      }

      if (activeTab === "live") {
        payload.status = "QUESTION_STATUS_ACTIVE"
      }

      if (activeTab === "upcoming") {
        payload.status = "QUESTION_STATUS_UPCOMING"
      }

      const res = await api.post<any>("/event/v1/getquestions", payload)
      if (res?.status?.type !== "SUCCESS") return

      const newQuestions: QuestionCard[] = (res.questions ?? []).map(
        (q: any) => ({
          questionId: q.questionId,
          eventId: String(q.eventId ?? q.event?.id ?? ""),
          question: q.description || q.name || "Prediction Market",
          questionType: q.questionType,
          users: q.activity?.questionUsers ?? 0,
          volume: q.activity?.questionVolume ?? "0",
          options:
            q.activity?.marketDataDetails?.map((m: any) => ({
              id: m.outcome,
              label: m.outcome,
              percentage: Number(m.impliedProbability) || 0,
            })) ?? [],
        })
      )

      setQuestions((prev) =>
        reset ? newQuestions : [...prev, ...newQuestions]
      )

      const totalPages = res.pageInfo?.totalPages ?? 1
      if ((reset ? 1 : page) >= totalPages) {
        setHasMore(false)
      } else {
        setPage((p) => p + 1)
      }
    } catch (err) {
      console.error("Failed to fetch questions", err)
    } finally {
      setIsLoading(false)
    }
  }

  /* INITIAL LOAD */
  useEffect(() => {
    fetchQuestions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* TAB CHANGE RESET */
  useEffect(() => {
    setQuestions([])
    setPage(1)
    setHasMore(true)
    fetchQuestions(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  return (
    <section className="py-12 bg-[#1A1A1D]">
      <div className="max-w-[1400px] mx-auto px-4">

        {/* TABS */}
        <div className="flex flex-wrap gap-2 bg-dark-card p-1 rounded-lg border border-white/10 mb-6">
          {["all", "live", "upcoming", "cricket", "Nfl"].map((tab) => (
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

        {/* QUESTIONS GRID */}
        <div className="grid md:grid-cols-4 gap-4">
          {questions.map((q) => (
            <div
              key={q.questionId}
              className="bg-[#1F2C34] border border-white/5 rounded-xl p-4
              hover:border-primary/30 transition-all flex flex-col justify-between"
            >
              <div className="flex justify-between mb-2">
                <span className="px-2 py-1 rounded-md bg-gray-600 text-white text-[10px]">
                  {q.questionType.replace("QUESTION_TYPE_", "")}
                </span>
                <span className="px-2 py-1 rounded-md bg-primary/80 text-black text-[10px]">
                  Active
                </span>
              </div>

              <p className="text-white font-semibold text-sm mb-3 h-12">
                {q.question}
              </p>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {q.options.slice(0, 4).map((opt) => (
                  <div
                    key={opt.id}
                    className="bg-[#1e1e1e] border border-white/10 rounded-lg py-2 text-center"
                  >
                    <span className="text-green-400 font-semibold text-sm">
                      {opt.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>👥 {q.users}</span>
                <Button
                  size="sm"
                  onClick={() => {
                    const token = localStorage.getItem("auth_token")
                    if (!token) {
                      window.location.href = "/login"
                      return
                    }
                    setSelectedQuestion(q)
                  }}
                >
                  Predict
                </Button>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => fetchQuestions()}
              disabled={isLoading}
              className="px-8"
            >
              {isLoading ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}

        {!hasMore && (
          <p className="text-center text-gray-500 mt-6 text-sm">
            No more questions available
          </p>
        )}

        <PredictionModal
          open={!!selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
          question={selectedQuestion}
        />
      </div>
    </section>
  )
}

export default UpcomingEventsDyn
