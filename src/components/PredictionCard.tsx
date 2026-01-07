import { TrendingUp, Clock } from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { Progress } from "./ui/progress";
//import { Progress } from "../ui/Progress";

/* ---------------- TYPES ---------------- */

export interface ApiPrediction {
  eventName?: string;
  eventDescription?: string;
  eventShortName?: string;
  eventStartDate?: string | number;

  predictedOutcome?: string;
  percentage?: number | string;
  exitPercentage?: number | string;

  investmentAmt?: number | string;
  potentialReturns?: number | string;
}

/* ---------------- HELPERS ---------------- */

const formatRelative = (date?: string | number) => {
  if (!date) return "--";
  const d = new Date(date);
  const diff = Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return diff <= 0 ? "Today" : `${diff}d`;
};

const splitTeams = (name?: string) => {
  if (!name) return { left: "", right: "" };
  const parts = name.split(/vs|VS|v\s/i);
  return {
    left: parts[0]?.trim() || "",
    right: parts[1]?.trim() || "",
  };
};

/* ---------------- CARD ---------------- */

export const PredictionCard = ({
  p,
  onAction,
  actionLabel = "Predict",
}: {
  p: ApiPrediction;
  onAction?: () => void;
  actionLabel?: string;
}) => {
  const pct = Number(p.percentage || 0);
  const startsText = formatRelative(p.eventStartDate);
  const teams = splitTeams(p.eventName);

  const leftTag = teams.left ? teams.left.slice(0, 2).toUpperCase() : "";
  const rightTag = teams.right ? teams.right.slice(0, 2).toUpperCase() : "";

  return (
    <Card className="rounded-2xl p-4 border border-white/10 bg-gray-800/80">
      {/* TOP ROW */}
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-4 flex items-center gap-3">
          <div className="px-2 py-0.5 rounded-full bg-blue-500 text-xs font-bold text-white">
            {leftTag}
          </div>

          <div className="flex-1">
            <div className="text-white font-semibold">{teams.left}</div>
            {p.eventDescription && (
              <div className="text-gray-400 text-xs">
                {p.eventDescription}
              </div>
            )}
          </div>

          <div className="mx-1 text-gray-300 font-semibold text-sm">Vs</div>

          <div className="text-right flex items-center gap-3">
            <div className="flex-1 text-right">
              <div className="text-white font-semibold">{teams.right}</div>
            </div>
            <div className="px-2 py-0.5 rounded-full bg-yellow-500 text-xs font-bold text-black">
              {rightTag}
            </div>
          </div>
        </div>

        {/* EVENT TAG */}
        <div className="col-span-2 flex justify-center">
          {p.eventShortName && <Badge className="text-xs px-2 py-1">{p.eventShortName}</Badge>}
        </div>

        {/* META */}
        <div className="col-span-3 flex items-center justify-center gap-3">
          <div className="grid items-center gap-1 rounded-xl border border-white/10 bg-gray-900/60 px-2 py-1 text-xs text-white">
            <span>Predicted</span>
            <span className="font-semibold">
              {p.predictedOutcome || "-"}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-gray-900/60 px-2 py-1 text-xs text-white">
            <Clock className="h-4 w-4 text-white/80" />
            <span className="text-xs">Starts In</span>
            <span className="font-semibold text-xs">{startsText}</span>
          </div>
        </div>

        {/* ACTION */}
        <div className="col-span-3 flex items-center justify-end gap-2">
          <Button
            onClick={onAction}
            className="bg-green-500 hover:bg-green-600 py-2 px-3 text-sm"
          >
            {actionLabel}
          </Button>

          {p.exitPercentage && (
            <div className="flex items-center gap-1 text-green-500 text-xs">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">{p.exitPercentage}%</span>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="mt-3 grid grid-cols-12 items-center gap-3">
        <div className="col-span-4 text-xs text-gray-300">
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 rounded bg-gray-900/60 text-white">
              <div className="text-[10px]">Investment</div>
              <div className="font-semibold text-sm">
                {p.investmentAmt ?? "-"}
              </div>
            </div>

            <div className="px-2 py-1 rounded bg-gray-900/60 text-white">
              <div className="text-[10px]">Returns</div>
              <div className="font-semibold text-sm">
                {p.potentialReturns ?? "-"}
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-8 flex items-center gap-2">
          <div className="flex-1">
            {/* compact progress placeholder */}
            <Progress
              value={Math.max(0, Math.min(100, pct))}
              className="h-2 bg-gray-700"
            />
          </div>
          <div className="text-xs text-gray-300">{pct}% Full</div>
        </div>
      </div>
    </Card>
  );
};
