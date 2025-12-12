import { Calendar,CheckCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { useState,useEffect } from 'react';
import { eventApi } from '../api/event';


export interface Match {
  id: string;          // FIXED
  sport: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  timer: string;
  status: string;
  question: string;
}

// -------------------------------------------------------
//                  PREDICTION MODAL
// -------------------------------------------------------
interface PredictionModalProps {
  open: boolean;
  onClose: () => void;
  event: Match | null;
}

const PredictionModal: React.FC<PredictionModalProps> = ({ open, onClose, event }) => {
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(50); // Default confidence
  const [amount, setAmount] = useState<number>(100); // Default amount
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

  const handlePredict = () => {
    if (selectedOutcome && amount > 0) {
      console.log("Prediction Submitted:", {
        matchId: event?.id,
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

  if (!open || !event) return null;

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


export const UpcomingEventsDyn = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [events, setEvents] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (event: Match) => {
    setSelectedMatch(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMatch(null);
    setIsModalOpen(false);
  };

  // -------------------------------------------------------
  // FETCH EVENTS FROM API
  // -------------------------------------------------------
useEffect(() => {
  const loadEvents = async () => {
    try {
      setIsLoading(true);

      const res = await eventApi.listEvents();
      console.log("EVENT RESPONSE:", res); // check shape

      const apiEvents = res.events ?? [];

      const mapped: Match[] = apiEvents.map((e: any) => ({
        id: e.eventId ?? "",
        sport: e.sport ?? "Sports",
        title: e.eventName ?? "Event",
        date: e.eventStartDate ?? "",
        time: e.eventStartTime ?? "",
        venue: e.eventLocation ?? "",
        timer: "Upcoming", // or calculate based on start date
        status: e.eventType?.toLowerCase() ?? "upcoming",
        question: e.eventDescription ?? "No question available",
      }));

      setEvents(mapped);
    } catch (err) {
      console.error("Failed to load events", err);
    } finally {
      setIsLoading(false);
    }
  };

  loadEvents();
}, []);

  // FILTERING
  const filteredEvents =
    activeTab === "all"
      ? events
      : events.filter((e) => e.status === activeTab);

  return (
    <section className="py-12 bg-[#1A1A1D] relative">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TABS */}
        <div className="flex flex-wrap gap-2 bg-dark-card p-1 rounded-lg mb-6">
          {["all", "sports", "live", "trending", "upcoming"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-md text-sm font-medium ${
                activeTab === tab
                  ? "bg-accent-yellow text-black shadow-sm"
                  : "text-gray-text hover:text-white"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* LOADING STATE */}
        {isLoading && (
          <p className="text-gray-400 text-center py-10">Loading events...</p>
        )}

        {/* EVENTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {!isLoading &&
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-dark-card border border-white/5 rounded-xl p-4 hover:border-primary/30 transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Sport & Timer */}
                <div className="flex justify-between mb-2">
                  <span className="px-2 py-1 rounded-md bg-gray-500 text-white text-[10px] font-medium">
                    {event.sport}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-md text-white text-[10px] font-medium ${
                      event.status === "live"
                        ? "bg-red-600 border-red-500"
                        : "bg-primary border-primary"
                    }`}
                  >
                    {event.timer}
                  </span>
                </div>

                {/* Title */}
                <p
                  className={`text-sm font-semibold mb-1 ${
                    event.status === "live"
                      ? "text-red-400"
                      : "text-white group-hover:text-primary"
                  }`}
                >
                  {event.title}
                </p>

                {/* Question */}
                <p className="text-sm text-gray-300 mb-3 leading-tight h-10">
                  {event.question}
                </p>

                {/* YES/NO demo percentages (replace with market API later) */}
                <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                  <div className="bg-[#1a1a1a] border border-white/10 rounded-md p-2 text-center">
                    <div className="text-green-400 font-semibold">Yes</div>
                    <div className="text-gray-300">62%</div>
                  </div>
                  <div className="bg-[#1a1a1a] border border-white/10 rounded-md p-2 text-center">
                    <div className="text-red-400 font-semibold">No</div>
                    <div className="text-gray-300">38%</div>
                  </div>
                </div>

                {/* Date + Predict Button */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Calendar size={12} />
                    {event.date}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => openModal(event)}
                    className={`${
                      event.status === "live"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-primary hover:bg-primary/90"
                    } text-black font-bold px-3`}
                  >
                    Predict
                  </Button>
                </div>
              </div>
            ))}

          {!isLoading && filteredEvents.length === 0 && (
            <p className="text-gray-400 text-center py-10">
              No events available.
            </p>
          )}
        </div>
      </div>

      <PredictionModal open={isModalOpen} onClose={closeModal} event={selectedMatch} />
    </section>
  );
};

