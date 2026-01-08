import { TrendingUp, Clock } from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Progress } from "./ui/progress";

/* ---------------- TYPES ---------------- */

export interface ApiPrediction {
  eventName?: string;
  question?: string;
  venue?: string;
  eventStartDate?: string | number;

  predictedOutcome?: string;
  percentage?: number | string;
  exitPercentage?: number | string;

  investmentAmt?: number | string;
  potentialReturns?: number | string;
}

/* ---------------- HELPERS ---------------- */

const splitTeams = (name?: string) => {
  if (!name) return { left: "India", right: "Pakistan" };
  const parts = name.split(/vs|VS|v\s/i);
  return {
    left: parts[0]?.trim() || "India",
    right: parts[1]?.trim() || "Pakistan",
  };
};

const getFlag = (team: string) => {
  if (/india/i.test(team)) return "🇮🇳";
  if (/pak/i.test(team)) return "🇵🇰";
  if (/aus/i.test(team)) return "🇦🇺";
  if (/eng/i.test(team)) return "🇬🇧";
  return "🏳️";
};

const formatRelative = (date?: string | number) => {
  if (!date) return "Today";
  const d = new Date(date);
  const diff = Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return diff <= 0 ? "Today" : `${diff}d`;
};

/* ---------------- CARD ---------------- */

export const PredictionsCard = ({
  p,
  onAction,
  actionLabel = "Exit Prediction",
}: {
  p: ApiPrediction;
  onAction?: () => void;
  actionLabel?: string;
}) => {
  const teams = splitTeams(p.eventName);
  const pct = Math.max(0, Math.min(100, Number(p.percentage || 0)));

  return (
    <Card className="rounded-xl p-4 border border-white/10 bg-gray-800/80">

      {/* ===== GRID: 3 COLUMNS, 2 ROWS ===== */}
      <div className="grid grid-cols-12 gap-4 items-start">

        {/* ================= COLUMN 1 ================= */}
        <div className="col-span-5 space-y-2">
          {/* Row 1: Event */}
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <span>{getFlag(teams.left)}</span>
            <span>{teams.left}</span>
            <span className="text-gray-400 text-xs">vs</span>
            <span>{teams.right}</span>
            <span>{getFlag(teams.right)}</span>
          </div>

          {/* Row 2: Question */}
          <div className="text-sm text-white leading-snug">
            {p.question ||
              "Will there be a Super Over played in this match considering pitch conditions, team form, weather forecast, and match pressure situation?"}
          </div>
        </div>

        {/* ================= COLUMN 2 ================= */}
        <div className="col-span-4 space-y-2">

          {/* Row 1: Predicted / Invested / Returns */}
          <div className="flex flex-wrap gap-2 text-xs text-gray-300">
            <span className="bg-gray-900/60 px-2 py-1 rounded">
              Predicted:{" "}
              <span className="text-primary font-semibold">
                {p.predictedOutcome || "Yes"}
              </span>
            </span>

            <span className="bg-gray-900/60 px-2 py-1 rounded">
              ₹ {p.investmentAmt ?? 50}
            </span>

            <span className="bg-gray-900/60 px-2 py-1 rounded">
              ₹ {p.potentialReturns ?? 75}
            </span>
          </div>

          {/* Row 2: Progress */}
          <div className="flex items-center gap-2">
            <Progress value={pct} className="h-1.5 bg-gray-700 flex-1" />
            <span className="text-xs text-gray-300">{pct}%</span>
          </div>
        </div>

        {/* ================= COLUMN 3 ================= */}
        <div className="col-span-3 flex flex-col items-end justify-between h-full">

          {/* Row 1: Button */}
          <Button
            onClick={onAction}
            className="bg-green-500 hover:bg-green-600 px-4 py-1 text-xs"
          >
            {actionLabel}
          </Button>

          {/* Row 2: Exit % / Time */}
          <div className="flex items-center gap-2 text-xs text-gray-300 mt-2">
            <Clock className="h-3 w-3" />
            <span>{formatRelative(p.eventStartDate)}</span>

            {p.exitPercentage && (
              <span className="flex items-center gap-1 text-green-400 ml-2">
                <TrendingUp className="h-3 w-3" />
                {p.exitPercentage}%
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
