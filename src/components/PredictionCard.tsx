// import { TrendingUp, Clock } from "lucide-react";
// import { Card } from "./ui/Card";
// import { Button } from "./ui/Button";
// import { Badge } from "./ui/Badge";
// import { Progress } from "./ui/progress";
// //import { Progress } from "../ui/Progress";

// /* ---------------- TYPES ---------------- */

// export interface ApiPrediction {
//   eventName?: string;
//   eventDescription?: string;
//   eventShortName?: string;
//   eventStartDate?: string | number;

//   predictedOutcome?: string;
//   percentage?: number | string;
//   exitPercentage?: number | string;

//   investmentAmt?: number | string;
//   potentialReturns?: number | string;
// }

// /* ---------------- HELPERS ---------------- */

// const formatRelative = (date?: string | number) => {
//   if (!date) return "--";
//   const d = new Date(date);
//   const diff = Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
//   return diff <= 0 ? "Today" : `${diff}d`;
// };

// const splitTeams = (name?: string) => {
//   if (!name) return { left: "", right: "" };
//   const parts = name.split(/vs|VS|v\s/i);
//   return {
//     left: parts[0]?.trim() || "",
//     right: parts[1]?.trim() || "",
//   };
// };

// /* ---------------- CARD ---------------- */

// export const PredictionCard = ({
//   p,
//   onAction,
//   actionLabel = "Predict",
// }: {
//   p: ApiPrediction;
//   onAction?: () => void;
//   actionLabel?: string;
// }) => {
//   const pct = Number(p.percentage || 0);
//   const startsText = formatRelative(p.eventStartDate);
//   const teams = splitTeams(p.eventName);

//   const leftTag = teams.left ? teams.left.slice(0, 2).toUpperCase() : "";
//   const rightTag = teams.right ? teams.right.slice(0, 2).toUpperCase() : "";

//   return (
//     <Card className="rounded-2xl p-4 border border-white/10 bg-gray-800/80">
//       {/* TOP ROW */}
//       <div className="grid grid-cols-12 gap-4 items-center">
//         <div className="col-span-4 flex items-center gap-3">
//           <div className="px-2 py-0.5 rounded-full bg-blue-500 text-xs font-bold text-white">
//             {leftTag}
//           </div>

//           <div className="flex-1">
//             <div className="text-white font-semibold">{teams.left}</div>
//             {p.eventDescription && (
//               <div className="text-gray-400 text-xs">
//                 {p.eventDescription}
//               </div>
//             )}
//           </div>

//           <div className="mx-1 text-gray-300 font-semibold text-sm">Vs</div>

//           <div className="text-right flex items-center gap-3">
//             <div className="flex-1 text-right">
//               <div className="text-white font-semibold">{teams.right}</div>
//             </div>
//             <div className="px-2 py-0.5 rounded-full bg-yellow-500 text-xs font-bold text-black">
//               {rightTag}
//             </div>
//           </div>
//         </div>

//         {/* EVENT TAG */}
//         <div className="col-span-2 flex justify-center">
//           {p.eventShortName && <Badge className="text-xs px-2 py-1">{p.eventShortName}</Badge>}
//         </div>

//         {/* META */}
//         <div className="col-span-3 flex items-center justify-center gap-3">
//           <div className="grid items-center gap-1 rounded-xl border border-white/10 bg-gray-900/60 px-2 py-1 text-xs text-white">
//             <span>Predicted</span>
//             <span className="font-semibold">
//               {p.predictedOutcome || "-"}
//             </span>
//           </div>

//           <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-gray-900/60 px-2 py-1 text-xs text-white">
//             <Clock className="h-4 w-4 text-white/80" />
//             <span className="text-xs">Starts In</span>
//             <span className="font-semibold text-xs">{startsText}</span>
//           </div>
//         </div>

//         {/* ACTION */}
//         <div className="col-span-3 flex items-center justify-end gap-2">
//           <Button
//             onClick={onAction}
//             className="bg-green-500 hover:bg-green-600 py-2 px-3 text-sm"
//           >
//             {actionLabel}
//           </Button>

//           {p.exitPercentage && (
//             <div className="flex items-center gap-1 text-green-500 text-xs">
//               <TrendingUp className="h-4 w-4" />
//               <span className="text-xs">{p.exitPercentage}%</span>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* BOTTOM ROW */}
//       <div className="mt-3 grid grid-cols-12 items-center gap-3">
//         <div className="col-span-4 text-xs text-gray-300">
//           <div className="flex items-center gap-2">
//             <div className="px-2 py-1 rounded bg-gray-900/60 text-white">
//               <div className="text-[10px]">Investment</div>
//               <div className="font-semibold text-sm">
//                 {p.investmentAmt ?? "-"}
//               </div>
//             </div>

//             <div className="px-2 py-1 rounded bg-gray-900/60 text-white">
//               <div className="text-[10px]">Returns</div>
//               <div className="font-semibold text-sm">
//                 {p.potentialReturns ?? "-"}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-span-8 flex items-center gap-2">
//           <div className="flex-1">
//             {/* compact progress placeholder */}
//             <Progress
//               value={Math.max(0, Math.min(100, pct))}
//               className="h-2 bg-gray-700"
//             />
//           </div>
//           <div className="text-xs text-gray-300">{pct}% Full</div>
//         </div>
//       </div>
//     </Card>
//   );
// };
// import { TrendingUp, Clock } from "lucide-react";
// import { Card } from "./ui/Card";
// import { Button } from "./ui/Button";
// import { Badge } from "./ui/Badge";
// import { Progress } from "./ui/progress";

// export const PredictionCard = () => {
//   return (
//     <Card className="rounded-2xl p-4 border border-white/10 bg-gray-800/80">
//       {/* TOP ROW */}
//       <div className="grid grid-cols-12 gap-4 items-center">
//         {/* TEAMS */}
//         <div className="col-span-4 flex items-center gap-3">
//           <div className="px-2 py-0.5 rounded-full bg-blue-500 text-xs font-bold text-white">
//             IN
//           </div>

//           <div className="flex-1">
//             <div className="text-white font-semibold">India</div>
//             <div className="text-gray-400 text-xs">
//               International Match
//             </div>
//           </div>

//           <div className="mx-1 text-gray-300 font-semibold text-sm">Vs</div>

//           <div className="text-right flex items-center gap-3">
//             <div className="flex-1 text-right">
//               <div className="text-white font-semibold">Pakistan</div>
//             </div>
//             <div className="px-2 py-0.5 rounded-full bg-yellow-500 text-xs font-bold text-black">
//               PA
//             </div>
//           </div>
//         </div>

//         {/* QUESTION */}
//         <div className="col-span-2 flex justify-center">
//           <Badge className="text-xs px-2 py-1">
//             Will there be a Super Over?
//           </Badge>
//         </div>

//         {/* META */}
//         <div className="col-span-3 flex items-center justify-center gap-3">
//           <div className="grid items-center gap-1 rounded-xl border border-white/10 bg-gray-900/60 px-2 py-1 text-xs text-white">
//             <span>Predicted</span>
//             <span className="font-semibold">Yes</span>
//           </div>

//           <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-gray-900/60 px-2 py-1 text-xs text-white">
//             <Clock className="h-4 w-4 text-white/80" />
//             <span className="text-xs">Starts In</span>
//             <span className="font-semibold text-xs">2d</span>
//           </div>
//         </div>

//         {/* ACTION */}
//         <div className="col-span-3 flex items-center justify-end gap-2">
//           <Button className="bg-green-500 hover:bg-green-600 py-2 px-3 text-sm">
//             Exit Prediction
//           </Button>

//           <div className="flex items-center gap-1 text-green-500 text-xs">
//             <TrendingUp className="h-4 w-4" />
//             <span>12%</span>
//           </div>
//         </div>
//       </div>

//       {/* BOTTOM ROW */}
//       <div className="mt-3 grid grid-cols-12 items-center gap-3">
//         <div className="col-span-4 text-xs text-gray-300">
//           <div className="flex items-center gap-2">
//             <div className="px-2 py-1 rounded bg-gray-900/60 text-white">
//               <div className="text-[10px]">Investment</div>
//               <div className="font-semibold text-sm">₹100</div>
//             </div>

//             <div className="px-2 py-1 rounded bg-gray-900/60 text-white">
//               <div className="text-[10px]">Returns</div>
//               <div className="font-semibold text-sm">₹150</div>
//             </div>
//           </div>
//         </div>

//         <div className="col-span-8 flex items-center gap-2">
//           <div className="flex-1">
//             <Progress value={60} className="h-2 bg-gray-700" />
//           </div>
//           <div className="text-xs text-gray-300">60% Full</div>
//         </div>
//       </div>
//     </Card>
//   );
// };
import { TrendingUp, Clock, User2Icon } from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Progress } from "./ui/progress";

/* ---------------- TYPES ---------------- */

export interface ApiPrediction {
  eventName?: string;
  question?: string;
  venue?: string;
users?:string| number;
  eventStartDate?: string | number;
  eventEndDate?: string | number;

  predictedOutcome?: string;
  percentage?: number | string;
  exitPercentage?: number | string;

  investmentAmt?: number | string;
  potentialReturns?: number | string;
}

/* ---------------- HELPERS ---------------- */
const splitTeams = (name?: string) => {
  if (!name) return { left: "--", right: "--" };
  const parts = name.split(/vs|VS|v\s/i);
  return {
    left: parts[0]?.trim() || "--",
    right: parts[1]?.trim() || "--",
  };
};

const getFlag = (team: string) => {
  if (/india/i.test(team)) return "🇮🇳";
  if (/pak/i.test(team)) return "🇵🇰";
  if (/aus/i.test(team)) return "🇦🇺";
  if (/eng/i.test(team)) return "🇬🇧";
  return "🏳️";
};

/* ✅ seconds → milliseconds safe conversion */
const toMillis = (ts?: string | number) => {
  if (!ts) return null;
  const n = Number(ts);
  if (!isFinite(n)) return null;
  return n < 1e12 ? n * 1000 : n;
};

/* ✅ SMART START LABEL */
const getEventTimeLabel = (
  start?: string | number,
  end?: string | number
) => {
  const startMs = toMillis(start);
  const endMs = toMillis(end);

  if (!startMs) return "--";

  const now = Date.now();
  const startDate = new Date(startMs);

  const timeStr = startDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const dateStr = startDate.toLocaleDateString([], {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // 🔴 LIVE
  if (startMs <= now && (!endMs || now <= endMs)) {
    return "Live Now";
  }

  // ⏳ FUTURE
  if (startMs > now) {
    const diffDays = Math.ceil((startMs - now) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return `Starts Today, ${timeStr}`;
    if (diffDays === 1) return `Starts Tomorrow, ${timeStr}`;
    return `Starts ${dateStr}, ${timeStr}`;
  }

  // ✅ PAST
  return `Started on ${dateStr}, ${timeStr}`;
};

/* ---------------- CARD ---------------- */

export const PredictionCard = ({
  p,
  onAction,
  actionLabel = "Exit Prediction",
}: {
  p: ApiPrediction;
  onAction?: () => void;
  actionLabel?: string;
}) => {
  const teams = splitTeams(p.eventName);
  const pct = Math.max(0, Math.min(100, Number(p.percentage ?? 0)));

console.log('p',p);
  return (
    <Card className="rounded-xl p-4 border border-white/10 bg-gray-800/80">
      <div className="grid grid-cols-12 gap-4">

        {/* ROW 1 */}

        <div className="col-span-3 flex items-center gap-2 text-sm font-semibold text-white">
          <span>{getFlag(teams.left)}</span>
          <span>{teams.left}</span>
          <span className="text-gray-400 text-xs">vs</span>
          <span>{teams.right}</span>
          <span>{getFlag(teams.right)}</span>
        </div>

        <div className="col-span-7">
          <div className="bg-gray-900/70 border border-white/10 rounded-lg px-3 py-2 text-sm font-medium text-white">
            {p.question || "--"}
          </div>
        </div>

        <div className="col-span-2" />

        {/* ROW 2 */}

        <div className="col-span-3 flex flex-col gap-1 text-xs text-gray-300">
          <span>📍 {p.venue || "--"}</span>
          {/* <span className="flex items-center gap-1 pl-6">
            <Clock className="h-3 w-3" />
            {getEventTimeLabel(p.eventStartDate, p.eventEndDate)}
          </span>
          <span className="flex items-center gap-1 pl-6">
            <User2Icon className="h-3 w-3" />
            {p.users || "--"}
          </span> */}
        </div>

        <div className="col-span-7 flex flex-col gap-2">
          <div className="flex flex-wrap gap-3 text-xs text-gray-300">
            <span className="bg-gray-900/60 px-2 py-1 rounded">
              Predicted:
              <span className="text-primary font-semibold ml-1">
                {p.predictedOutcome || "--"}
              </span>
            </span>

            <span className="bg-gray-900/60 px-2 py-1 rounded">
              Invested:
              <span className="text-white font-semibold ml-1">
                ₹ {p.investmentAmt ?? "--"}
              </span>
            </span>

            <span className="bg-gray-900/60 px-2 py-1 rounded">
              Returns:
              <span className="text-white font-semibold ml-1">
                ₹ {p.potentialReturns ?? "--"}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Progress value={pct} className="h-2 bg-gray-700 flex-1" />
            <span className="text-xs">{pct}%</span>
          </div>
        </div>

        <div className="col-span-2 flex flex-col items-end gap-1">
          {p.exitPercentage !== undefined && (
            <span className="flex items-center gap-1 text-green-400 text-xs">
              <TrendingUp className="h-3 w-3" />
              {p.exitPercentage}%
            </span>
          )}

          <Button
            onClick={onAction}
            className="bg-green-500 hover:bg-green-600 px-4 py-1 text-xs"
          >
            {actionLabel}
          </Button>
        </div>
      </div>
    </Card>
  );
};
