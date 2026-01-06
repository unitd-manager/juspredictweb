// src/pages/TransactionsDyn.tsx
import React, { useState, useEffect } from "react";
import { PageHeader } from "../components/PageHeader";
import { Loader2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { activityApi } from "../api/activity";

/* ---------------------------------------------------
   HELPERS
--------------------------------------------------- */

const stripPrefix = (value?: string, prefix?: string) => {
  if (!value) return "-";
  if (!prefix) return value;
  return value.startsWith(prefix) ? value.replace(prefix, "") : value;
};

function getUserIdFromToken() {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub || payload.user || payload.id || null;
  } catch {
    return null;
  }
}

/* ---------------------------------------------------
   TYPES
--------------------------------------------------- */

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "credit" | "debit";
  typeName: string;
  subTypeName: string;
}

/* ---------------------------------------------------
   COMPONENT
--------------------------------------------------- */

const TransactionsDyn: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [filterType, setFilterType] = useState<"all" | "credit" | "debit">("all");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [sortOrder, setSortOrder] = useState<
    "date-desc" | "date-asc" | "amount-desc" | "amount-asc"
  >("date-desc");

  const pageSize = 10;

  /* ---------------------------------------------------
     FETCH
  --------------------------------------------------- */

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const userId = getUserIdFromToken();
        if (!userId) {
          setError("User not found.");
          return;
        }

        const payload = {
          userId,
          activityType: [],
          activitySubType: [],
          startDate: filterStartDate || "",
          endDate: filterEndDate || "",
          pageRequest: {
            pageNumber: page,
            pageSize,
          },
        };

        const response = await activityApi.getTransactions(payload);
        const apiList = response?.activities ?? [];

        let mapped: Transaction[] = apiList.map((item: any) => ({
          id: item.activityId,
          date: item.activityTime ?? "",
          description: item.activityDescription ?? "—",
          amount: Number(item.activityAmount ?? 0),
          type: Number(item.activityAmount ?? 0) >= 0 ? "credit" : "debit",

          // ✅ PREFIX STRIPPED HERE
          typeName: stripPrefix(item.activityType, "ACTIVITY_TYPE_"),
          subTypeName: stripPrefix(item.activitySubType, "ACTIVITY_SUBTYPE_"),
        }));

        /* ---------- UI FILTERS ---------- */

        if (filterType !== "all") {
          mapped = mapped.filter((t) => t.type === filterType);
        }

        if (filterStartDate) {
          mapped = mapped.filter(
            (t) => new Date(t.date) >= new Date(filterStartDate)
          );
        }

        if (filterEndDate) {
          mapped = mapped.filter(
            (t) => new Date(t.date) <= new Date(filterEndDate)
          );
        }

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

        setTransactions((prev) =>
          page === 1 ? mapped : [...prev, ...mapped]
        );
      } catch (err) {
        console.error(err);
        setError("Failed to fetch transactions.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [page, filterType, filterStartDate, filterEndDate, sortOrder]);

  /* ---------------------------------------------------
     HANDLERS
  --------------------------------------------------- */

  const resetAndReload = () => {
    setPage(1);
    setHasMore(true);
    setTransactions([]);
  };

  const handleLoadMore = () => setPage((p) => p + 1);

  /* ---------------------------------------------------
     UI
  --------------------------------------------------- */

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
            <h3 className="text-lg font-bold text-white mb-4">
              Recent Transactions
            </h3>

            {/* FILTERS */}
            <div className="mb-4 flex flex-wrap gap-4">
              <select
                className="bg-dark-lighter p-2 rounded-md"
                value={filterType}
                onChange={(e) => {
                  resetAndReload();
                  setFilterType(e.target.value as any);
                }}
              >
                <option value="all">All</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>

              <input
                type="date"
                className="bg-dark-lighter p-2 rounded-md"
                value={filterStartDate}
                onChange={(e) => {
                  resetAndReload();
                  setFilterStartDate(e.target.value);
                }}
              />

              <input
                type="date"
                className="bg-dark-lighter p-2 rounded-md"
                value={filterEndDate}
                onChange={(e) => {
                  resetAndReload();
                  setFilterEndDate(e.target.value);
                }}
              />

              <select
                className="bg-dark-lighter p-2 rounded-md"
                value={sortOrder}
                onChange={(e) => {
                  resetAndReload();
                  setSortOrder(e.target.value as any);
                }}
              >
                <option value="date-desc">Date ↓</option>
                <option value="date-asc">Date ↑</option>
                <option value="amount-desc">Amount ↓</option>
                <option value="amount-asc">Amount ↑</option>
              </select>
            </div>

            {/* TABLE */}
            {error ? (
              <p className="text-center text-red-400">{error}</p>
            ) : transactions.length === 0 && !isLoading ? (
              <p className="text-center">No transactions found.</p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-white/10">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs uppercase">
                          Date
                        </th>
                        <th className="px-4 py-2 text-left text-xs uppercase">
                          Description
                        </th>
                        <th className="px-4 py-2 text-left text-xs uppercase">
                          Category
                        </th>
                        <th className="px-4 py-2 text-left text-xs uppercase">
                          Activity
                        </th>
                        <th className="px-4 py-2 text-right text-xs uppercase">
                          Amount
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-white/10">
                      {transactions.map((t) => (
                        <tr key={t.id}>
                          <td className="px-4 py-2 text-sm">
                            {new Date(t.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            {t.description}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            {t.typeName}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            {t.subTypeName}
                          </td>
                          <td
                            className={`px-4 py-2 text-sm font-bold text-right ${
                              t.type === "credit"
                                ? "text-primary"
                                : "text-red-400"
                            }`}
                          >
                            {t.type === "credit" ? "+" : "-"}$
                            {Math.abs(t.amount).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {isLoading && (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                )}

                {!isLoading && hasMore && (
                  <div className="text-center mt-4">
                    <Button onClick={handleLoadMore}>Load More</Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsDyn;
