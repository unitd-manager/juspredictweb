
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
  onOrderDetails,
  orderId,
}: {
  p: ApiPrediction;
  onAction?: () => void;
  actionLabel?: string;
  onOrderDetails?: () => void;
  orderId?: string;
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
                {p.predictedOutcome ?? "--"}
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

          <div className="flex flex-col gap-1 w-full">
            {onOrderDetails && (
              <Button
                onClick={onOrderDetails}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-1 text-xs w-full"
              >
                Order Details
              </Button>
            )}
            <Button
              onClick={onAction}
              className="bg-green-500 hover:bg-green-600 px-4 py-1 text-xs w-full"
            >
              {actionLabel}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
