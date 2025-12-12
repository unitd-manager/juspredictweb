// src/pages/TransactionsDyn.tsx
import React, { useState, useEffect } from "react";
import { PageHeader } from "../components/PageHeader";
import { Loader2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { activityApi } from "../api/activity";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "credit" | "debit";

  // Required fields (TS complained earlier)
  typeName: string;
  subTypeName: string;

  // Optional UI placeholders
  match?: string;
  venue?: string;
  result?: string;
}

const TransactionsDyn: React.FC = () => {
  const userId = localStorage.getItem("userId");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [filterType, setFilterType] = useState<"all" | "credit" | "debit">("all");
  const [filterStartDate, setFilterStartDate] = useState<string>("");
  const [filterEndDate, setFilterEndDate] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<
    "date-desc" | "date-asc" | "amount-desc" | "amount-asc"
  >("date-desc");

  const pageSize = 10;
function getUserIdFromToken() {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub || payload.user || null;
  } catch (err) {
    console.error("JWT decode error:", err);
    return null;
  }
}

  useEffect(() => {
    console.log("LOCAL STORAGE:", localStorage);


    const fetchTransactions = async () => {
      try {
        
        setIsLoading(true);
        setError(null);
const userId = getUserIdFromToken();


        if (!userId) {
          setError("User not found.");
          return;
        }

        // Build API request payload
        const payload = {
          userId,
          activityType: [], // allow all unless filtered
          activitySubType: [],
          startDate: filterStartDate || "",
          endDate: filterEndDate || "",
          pageRequest: { pageNumber: page, pageSize },
        };

        // Fetch from API
        const response = await activityApi.getTransactions(payload);

        const apiList = response.activities ?? [];

        // Map API → UI format
        let mapped: Transaction[] = apiList.map((item: any) => ({
          id: item.activityId,
          date: item.activityTime ?? "-",
          description: item.activityDescription ?? "No description",
          amount: Number(item.activityAmount ?? 0),
          type: Number(item.activityAmount ?? 0) >= 0 ? "credit" : "debit",

          // Required fields (TS fix)
          typeName: item.activityType ?? "",
          subTypeName: item.activitySubType ?? "",

          // Optional for later UI enhancements
          match: "-",
          venue: "-",
          result: "-",
        }));

        // Apply UI filters
        if (filterType !== "all") {
          mapped = mapped.filter((t) => t.type === filterType);
        }

        if (filterStartDate) {
          mapped = mapped.filter((t) => new Date(t.date) >= new Date(filterStartDate));
        }

        if (filterEndDate) {
          mapped = mapped.filter((t) => new Date(t.date) <= new Date(filterEndDate));
        }

        // Sorting
        mapped.sort((a, b) => {
          if (sortOrder === "date-asc")
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          if (sortOrder === "date-desc")
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          if (sortOrder === "amount-asc") return a.amount - b.amount;
          if (sortOrder === "amount-desc") return b.amount - a.amount;
          return 0;
        });

        if (mapped.length < pageSize) setHasMore(false);

        setTransactions((prev) => (page === 1 ? mapped : [...prev, ...mapped]));
      } catch (err) {
        console.error(err);
        setError("Failed to fetch transactions.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [page, filterType, filterStartDate, filterEndDate, sortOrder, userId]);

  const handleLoadMore = () => setPage((prev) => prev + 1);

  const handleFilterChange = (type: "type" | "startDate" | "endDate", value: string) => {
    setPage(1);
    setTransactions([]);
    if (type === "type") setFilterType(value as any);
    if (type === "startDate") setFilterStartDate(value);
    if (type === "endDate") setFilterEndDate(value);
  };

  const handleSortChange = (value: any) => {
    setPage(1);
    setTransactions([]);
    setSortOrder(value);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-gray-light">
      <PageHeader
        title="Transaction History"
        tagline="View your past transactions and activities."
        compact
        isSubpage
      />

      <div className="px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-dark-card rounded-xl border border-white/10 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Recent Transactions</h3>

            {/* Filters */}
            <div className="mb-4 flex flex-col sm:flex-row gap-4">
              <select
                className="bg-dark-lighter p-2 rounded-md"
                value={filterType}
                onChange={(e) => handleFilterChange("type", e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>

              <input
                type="date"
                className="bg-dark-lighter p-2 rounded-md"
                value={filterStartDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
              />

              <input
                type="date"
                className="bg-dark-lighter p-2 rounded-md"
                value={filterEndDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
              />

              <select
                className="bg-dark-lighter p-2 rounded-md"
                value={sortOrder}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="date-desc">Date (Newest first)</option>
                <option value="date-asc">Date (Oldest first)</option>
                <option value="amount-desc">Amount (High to Low)</option>
                <option value="amount-asc">Amount (Low to High)</option>
              </select>
            </div>

            {/* TABLE */}
            {error ? (
              <p className="text-center text-red-400">{error}</p>
            ) : transactions.length === 0 && !isLoading ? (
              <p className="text-center">No transactions yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs text-gray-text uppercase">Date</th>
                      <th className="px-4 py-2 text-left text-xs text-gray-text uppercase">Description</th>
                      <th className="px-4 py-2 text-left text-xs text-gray-text uppercase">Type</th>
                      <th className="px-4 py-2 text-left text-xs text-gray-text uppercase">Subtype</th>
                      <th className="px-4 py-2 text-right text-xs text-gray-text uppercase">Amount</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/10">
                    {transactions.map((t) => (
                      <tr key={t.id}>
                        <td className="px-4 py-2 text-sm">{t.date}</td>
                        <td className="px-4 py-2 text-sm">{t.description}</td>
                        <td className="px-4 py-2 text-sm">{t.typeName}</td>
                        <td className="px-4 py-2 text-sm">{t.subTypeName}</td>

                        <td
                          className={`px-4 py-2 text-sm font-bold text-right ${
                            t.type === "credit" ? "text-primary" : "text-red-400"
                          }`}
                        >
                          {t.type === "credit" ? "+" : "-"}${t.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {isLoading && (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}

                {!isLoading && hasMore && (
                  <div className="text-center mt-4">
                    <Button onClick={handleLoadMore}>Load More</Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsDyn;
