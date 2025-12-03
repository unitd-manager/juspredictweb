import React, { useState } from "react";
import { Clock, TrendingUp, TrendingDown, Users, CheckCircle } from "lucide-react";
import {  useNavigate } from "react-router-dom";

import { Button } from "./ui/Button";

interface Team {
  name: string;
  code: string;
  odds: number;
  color: string;
}

interface Match {
  id: number;
  sport: string;
  team1: Team;
  team2: Team;
  predictions: string;
  startsIn: string;
  pool: string;
  fill: number;
  trend: string;
}

const matches: Match[] = [
  {
    id: 1,
    sport: "Cricket",
    team1: { name: "India", code: "IN", odds: 1.85, color: "bg-team-blue" },
    team2: { name: "Australia", code: "AU", odds: 2.10, color: "bg-team-gold" },
    predictions: "12,435",
    startsIn: "2h 30m",
    pool: "$45,230",
    fill: 62,
    trend: "+15%",
  },
  {
    id: 2,
    sport: "Football",
    team1: { name: "Barcelona", code: "BL", odds: 1.65, color: "bg-team-red" },
    team2: { name: "Real Madrid", code: "RM", odds: 2.35, color: "bg-team-purple" },
    predictions: "18,234",
    startsIn: "4h 15m",
    pool: "$82,150",
    fill: 91,
    trend: "+28%",
  },
  {
    id: 3,
    sport: "Basketball",
    team1: { name: "Lakers", code: "L", odds: 1.90, color: "bg-team-teal" },
    team2: { name: "Warriors", code: "W", odds: 1.95, color: "bg-team-green" },
    predictions: "9,876",
    startsIn: "1h 45m",
    pool: "$82,150",
    fill: 49,
    trend: "-5%",
  },
];


// -------------------------------------------------------
//                  PREDICTION MODAL
// -------------------------------------------------------

interface PredictionModalProps {
  open: boolean;
  onClose: () => void;
  match: Match | null;
}

const PredictionModal: React.FC<PredictionModalProps> = ({ open, onClose, match }) => {
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(50); // Default confidence
  const [amount, setAmount] = useState<number>(100); // Default amount
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

  const handlePredict = () => {
    if (selectedOutcome && amount > 0) {
      console.log("Prediction Submitted:", {
        matchId: match?.id,
        selectedOutcome,
        confidence,
        amount,
      });
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        onClose();
      }, 2000); // Show message for 2 seconds
    }
  };

  if (!open || !match) return null;

  if (showSuccessMessage) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
        <div className="bg-[#111] w-full max-w-md rounded-xl p-6 shadow-xl relative animate-fadeIn flex flex-col items-center justify-center h-[200px]">
          <h2 className="text-2xl font-bold text-primary mb-4 text-center flex items-center justify-center gap-2">
            <CheckCircle className="w-8 h-8" /> Order placed successfully!
          </h2>
          <p className="text-gray-400 text-center">Your prediction has been submitted.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-[#111] w-full max-w-md rounded-xl p-6 shadow-xl relative animate-fadeIn">

        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-white mb-1">Make Your Prediction</h2>
        <p className="text-sm text-gray-400 mb-4">Own your call. Trade with confidence.</p>

        {/* Question Box */}
        <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 mb-4">
          <h3 className="text-white font-semibold mb-1">Over 2.5 goals?</h3>
          <span className="text-gray-400 text-sm">Over/Under</span>
        </div>

        {/* Balance */}
        <div className="bg-[#0b3d2e] border border-[#0f8a54] text-[#00ff87] p-4 rounded-lg mb-4 font-bold">
          Available Balance: $5000.00
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            className={`bg-[#1a1a1a] border ${selectedOutcome === "Over" ? "border-primary" : "border-white/10"} py-3 rounded-lg text-white`}
            onClick={() => setSelectedOutcome("Over")}
          >
            Over 2.5 <br />
            <span className="text-gray-400 text-xs">58%</span>
          </button>
          <button
            className={`bg-[#1a1a1a] border ${selectedOutcome === "Under" ? "border-primary" : "border-white/10"} py-3 rounded-lg text-white`}
            onClick={() => setSelectedOutcome("Under")}
          >
            Under 2.5 <br />
            <span className="text-gray-400 text-xs">42%</span>
          </button>
        </div>
<span className="text-gray-400 text-xs text-center block">Select an Outcome</span>
        {/* Confidence */}
        <div className="flex items-center justify-between mb-4">
          <label className="text-gray-400 text-sm">Confidence</label>
          <span className="text-gray-400 text-sm">{confidence}%</span>
        </div>
        <input
          type="range"
          className="w-full"
          min="0"
          max="100"
          value={confidence}
          onChange={(e) => setConfidence(Number(e.target.value))}
        />

        {/* Amount */}
        <label className="text-gray-400 text-sm">Amount</label>
        <input
          type="number"
          className="w-full bg-[#1a1a1a] border border-white/10 p-3 rounded-lg text-white mb-4"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {["10", "50", "100", "500"].map((a) => (
            <button
              key={a}
              className="bg-[#1a1a1a] border border-white/10 text-white py-2 rounded-lg"
              onClick={() => setAmount(Number(a))}
            >
              ${a}
            </button>
          ))}
        </div>

        {/* Submit Button */}
        <button
          className={`w-full text-white py-3 rounded-lg font-semibold ${selectedOutcome && amount > 0 ? "bg-primary hover:bg-primary/90" : "bg-gray-700 opacity-70 cursor-not-allowed"}`}
          onClick={handlePredict}
          disabled={!selectedOutcome || amount <= 0}
        >
          Predict Now
        </button>
      </div>
    </div>
  );
};



// -------------------------------------------------------
//                 MAIN COMPONENT
// -------------------------------------------------------

interface LivePredictionsProps {
}

export const LivePredictions: React.FC<LivePredictionsProps> = () => {

  const navigate = useNavigate();

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (match: Match) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMatch(null);
    setIsModalOpen(false);
  };

  return (
    <section className="py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Live <span className="text-primary">Match Predictions</span>
          </h2>
          <p className="text-gray-text">Make your predictions and compete with the community</p>
        </div>

        <div className="space-y-6">
          {matches.map((match) => (
            <div
              key={match.id}
              className="bg-dark-card border border-primary/20 rounded-[18px] p-4 lg:px-8 lg:py-6 hover:border-primary/40 transition-all duration-300 shadow-card"
            >
              {/* Layout */}
              <div className="flex flex-col gap-4 lg:gap-0 lg:flex-row lg:items-center lg:gap-12">

                {/* Matchup Section */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between flex-1 w-full lg:w-auto gap-4 lg:gap-0">
                  {/* Team 1 */}
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className={`w-10 lg:w-12 h-10 lg:h-12 rounded-[24px] ${match.team1.color} flex items-center justify-center font-bold text-white text-sm lg:text-lg shrink-0`}>
                      {match.team1.code}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-white text-base lg:text-xl leading-none mb-1 truncate lg:truncate-none">{match.team1.name}</h3>
                      <span className="text-xs lg:text-sm text-gray-text font-medium">
                        Odds: <span className="text-[#00FF73]">{match.team1.odds}</span>
                      </span>
                    </div>
                  </div>

                  {/* VS */}
                  <div className="flex flex-col items-center px-2 lg:px-4">
                    <span className="text-lg lg:text-2xl font-bold text-gray-500 mb-1 lg:mb-2">Vs</span>
                    <span className={`text-[10px] lg:text-[12px] px-2 lg:px-3 py-0.5 lg:py-1 rounded-full bg-[#173025] text-[#0CFF66] border border-[#106E3C] font-medium`}>
                      {match.sport}
                    </span>
                  </div>

                  {/* Team 2 */}
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div
                      className={`w-10 lg:w-12 h-10 lg:h-12 rounded-[24px] ${match.team2.color} flex items-center justify-center font-bold text-white text-sm lg:text-lg shrink-0`}
                    >
                      {match.team2.code}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-white text-base lg:text-xl leading-none mb-1 truncate lg:truncate-none">{match.team2.name}</h3>
                      <span className="text-xs lg:text-sm text-gray-text font-medium">
                        Odds: <span className="text-[#00FF73]">{match.team2.odds}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Divider for Desktop */}
                <div className="hidden lg:block w-px h-16 bg-white/10"></div>

                {/* Stats & Action Right */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full lg:w-auto gap-4 lg:gap-8 lg:xl:gap-12">

                  <div className="flex gap-4 lg:gap-8">
                    <div className="flex flex-col bg-[#131315] p-2 lg:p-3 rounded-[11px] flex-1 lg:flex-none lg:min-w-[100px]">
                      <span className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                        <Users size={12} /> Predictions
                      </span>
                      <span className="text-base lg:text-lg font-bold text-white">{match.predictions}</span>
                    </div>

                    <div className="flex flex-col bg-[#131315] p-2 lg:p-3 rounded-[11px] flex-1 lg:flex-none lg:min-w-[100px]">
                      <span className="text-xs text-gray-500 flex items-center gap-1 mb-1 truncate">
                        <Clock size={12} /> Starts In
                      </span>
                      <span className="text-base lg:text-lg font-bold text-white">{match.startsIn}</span>
                    </div>
                  </div>

                  {/* Predict Button */}
                  <div className="flex flex-col items=stretch  lg:items-end gap-2 w-full lg:w-auto">
                    <Button
                      onClick={() => openModal(match)}
                      className="bg-primary text-black font-bold px-6 lg:px-8 py-2 lg:py-3 rounded-lg hover:bg-primary/90 h-auto text-sm lg:text-base w-full lg:w-auto"
                    >
                      Predict
                    </Button>

                    <span
                      className={`text-[10px] lg:text-[12px] font-medium flex items-center justify-center lg:justify-end gap-1 ${
                        match.trend.startsWith("+")
                          ? "text-[#33CE78]"
                          : "text-[#DF3801]"
                      }`}
                    >
                      {match.trend.startsWith("+") ? (
                        <TrendingUp size={12} />
                      ) : (
                        <TrendingDown size={12} />
                      )}
                      {match.trend}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Prize Pool :
                  <span className="text-[20px] font-bold text-[#00FF73] ml-1">
                    {match.pool}
                  </span>
                </div>

                <div className="flex items-center gap-3 w-48">
                  <div className="flex-1 h-2 bg-black rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00FC71] to-[#058640] rounded-full"
                      style={{ width: `${match.fill}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-text">{match.fill}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 px-8"
          onClick={()=>navigate('/sports')} >
            View All Matches
          </Button>
        </div>
      </div>

      {/* MODAL */}
      <PredictionModal open={isModalOpen} onClose={closeModal} match={selectedMatch} />
    </section>
  );
};
