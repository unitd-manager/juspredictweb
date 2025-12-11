import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
//import { Footer2 } from '../components/Footer2';
import { api } from '../api/client';
import { Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface Transaction {
  id: string;
  date: string;
  description: string;
  match?: string;
  venue?: string;
  result?: string;
  amount: number;
  type: 'credit' | 'debit';
}

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  const pageSize = 10;

  // SAMPLE DATA (You can remove this if API is real)
 const allTransactions: Transaction[] = [
  { 
    id: '1',
    date: '26:10:2024',
    description: 'Football Prediction',
    match: 'Man Utd vs Liverpool',
    venue: 'Old Trafford',
    result: 'Won',
    amount: 10.0,
    type: 'credit'
  },
  { 
    id: '2',
    date: '25:10:2024',
    description: 'Football Prediction',
    match: 'Real Madrid vs Barcelona',
    venue: 'Santiago Bernabéu',
    result: 'Loss',
    amount: 8.0,
    type: 'debit'
  },
  { 
    id: '3',
    date: '24:10:2024',
    description: 'Football Prediction',
    match: 'Chelsea vs Arsenal',
    venue: 'Stamford Bridge',
    result: 'Won',
    amount: 15.5,
    type: 'credit'
  },
  { 
    id: '4',
    date: '23:10:2024',
    description: 'Basketball Prediction',
    match: 'Lakers vs Celtics',
    venue: 'Crypto.com Arena',
    result: 'Loss',
    amount: 5.0,
    type: 'debit'
  },
  { 
    id: '5',
    date: '22:10:2024',
    description: 'Cricket Prediction',
    match: 'India vs Australia',
    venue: 'Wankhede Stadium',
    result: 'Won',
    amount: 22.0,
    type: 'credit'
  },
  { 
    id: '6',
    date: '21:10:2024',
    description: 'Tennis Prediction',
    match: 'Djokovic vs Nadal',
    venue: 'Roland Garros',
    result: 'Won',
    amount: 7.5,
    type: 'credit'
  },
  { 
    id: '7',
    date: '20:10:2024',
    description: 'Basketball Prediction',
    match: 'Warriors vs Bulls',
    venue: 'United Center',
    result: 'Loss',
    amount: 6.0,
    type: 'debit'
  },
  { 
    id: '8',
    date: '19:10:2024',
    description: 'Volleyball Prediction',
    match: 'Brazil vs USA',
    venue: 'Maracanãzinho',
    result: 'Loss',
    amount: 3.0,
    type: 'debit'
  },
  { 
    id: '9',
    date: '18:10:2024',
    description: 'Cricket Prediction',
    match: 'Pakistan vs South Africa',
    venue: 'Gaddafi Stadium',
    result: 'Won',
    amount: 25.0,
    type: 'credit'
  },
  { 
    id: '10',
    date: '17:10:2024',
    description: 'Basketball Prediction',
    match: 'Heat vs Nuggets',
    venue: 'Kaseya Center',
    result: 'Won',
    amount: 8.25,
    type: 'credit'
  },

  // ⭐ EXTRA 10 NEW RECORDS BELOW

  { 
    id: '11',
    date: '16:10:2024',
    description: 'Football Prediction',
    match: 'AC Milan vs Inter',
    venue: 'San Siro',
    result: 'Loss',
    amount: 9.0,
    type: 'debit'
  },
  { 
    id: '12',
    date: '15:10:2024',
    description: 'Cricket Prediction',
    match: 'England vs New Zealand',
    venue: 'Lord\'s',
    result: 'Won',
    amount: 14.0,
    type: 'credit'
  },
  { 
    id: '13',
    date: '14:10:2024',
    description: 'Tennis Prediction',
    match: 'Alcaraz vs Medvedev',
    venue: 'US Open Court',
    result: 'Loss',
    amount: 6.0,
    type: 'debit'
  },
  { 
    id: '14',
    date: '13:10:2024',
    description: 'Football Prediction',
    match: 'PSG vs Bayern Munich',
    venue: 'Parc des Princes',
    result: 'Won',
    amount: 18.0,
    type: 'credit'
  },
  { 
    id: '15',
    date: '12:10:2024',
    description: 'Basketball Prediction',
    match: 'Suns vs Mavericks',
    venue: 'Footprint Center',
    result: 'Loss',
    amount: 4.0,
    type: 'debit'
  },
  { 
    id: '16',
    date: '11:10:2024',
    description: 'Cricket Prediction',
    match: 'Sri Lanka vs West Indies',
    venue: 'R. Premadasa Stadium',
    result: 'Won',
    amount: 12.0,
    type: 'credit'
  },
  { 
    id: '17',
    date: '10:10:2024',
    description: 'Volleyball Prediction',
    match: 'Italy vs Serbia',
    venue: 'Pala Alpitour',
    result: 'Won',
    amount: 9.5,
    type: 'credit'
  },
  { 
    id: '18',
    date: '09:10:2024',
    description: 'Football Prediction',
    match: 'Argentina vs Brazil',
    venue: 'Maracanã',
    result: 'Loss',
    amount: 7.0,
    type: 'debit'
  },
  { 
    id: '19',
    date: '08:10:2024',
    description: 'Tennis Prediction',
    match: 'Sinner vs Zverev',
    venue: 'ATP Finals Arena',
    result: 'Won',
    amount: 11.0,
    type: 'credit'
  },
  { 
    id: '20',
    date: '07:10:2024',
    description: 'Cricket Prediction',
    match: 'Bangladesh vs Afghanistan',
    venue: 'Dhaka Stadium',
    result: 'Loss',
    amount: 5.75,
    type: 'debit'
  }
];



  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // ❗️Optional API call — currently not used for data
        await api.post('/transactions/v1/list', {
          page,
          pageSize,
          filterType,
          filterStartDate,
          filterEndDate,
          sortOrder,
        });

        // Filtering
        let filtered = [...allTransactions];

        if (filterType !== 'all') {
          filtered = filtered.filter((t) => t.type === filterType);
        }
        if (filterStartDate) {
          filtered = filtered.filter((t) => new Date(t.date) >= new Date(filterStartDate));
        }
        if (filterEndDate) {
          filtered = filtered.filter((t) => new Date(t.date) <= new Date(filterEndDate));
        }

        // Sorting
        filtered.sort((a, b) => {
          if (sortOrder === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
          if (sortOrder === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
          if (sortOrder === 'amount-asc') return a.amount - b.amount;
          if (sortOrder === 'amount-desc') return b.amount - a.amount;
          return 0;
        });

        // Pagination
        const startIndex = (page - 1) * pageSize;
        const paginated = filtered.slice(startIndex, startIndex + pageSize);

        setTransactions((prev) => (page === 1 ? paginated : [...prev, ...paginated]));
        setHasMore(startIndex + pageSize < filtered.length);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch transactions.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [page, filterType, filterStartDate, filterEndDate, sortOrder]);

  const handleLoadMore = () => setPage((prev) => prev + 1);

  const handleFilterChange = (type: 'type' | 'startDate' | 'endDate', value: string) => {
    setPage(1);
    setTransactions([]);
    if (type === 'type') setFilterType(value as any);
    if (type === 'startDate') setFilterStartDate(value);
    if (type === 'endDate') setFilterEndDate(value);
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
                className="bg-dark-lighter text-gray-text p-2 rounded-md"
                value={filterType}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>

              <input
                type="date"
                className="bg-dark-lighter text-gray-text p-2 rounded-md"
                value={filterStartDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />

              <input
                type="date"
                className="bg-dark-lighter text-gray-text p-2 rounded-md"
                value={filterEndDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />

              <select
                className="bg-dark-lighter text-gray-text p-2 rounded-md"
                value={sortOrder}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="date-desc">Date (Newest first)</option>
                <option value="date-asc">Date (Oldest first)</option>
                <option value="amount-desc">Amount (High to Low)</option>
                <option value="amount-asc">Amount (Low to High)</option>
              </select>
            </div>

            {/* Content */}
            {error ? (
              <p className="text-center text-red-400">{error}</p>
            ) : transactions.length === 0 && !isLoading ? (
              <p className="text-center text-gray-text">No transactions yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-text uppercase tracking-wider">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-text uppercase tracking-wider">Description</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-text uppercase tracking-wider">Match</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-text uppercase tracking-wider">Venue</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-text uppercase tracking-wider">Result</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-text uppercase tracking-wider">Amount</th>
            
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-light">{transaction.date}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-light">{transaction.description}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-light">{transaction.match || 'N/A'}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-light">{transaction.venue || 'N/A'}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-light">{transaction.result || 'N/A'}</td>
                        <td className={`px-4 py-2 whitespace-nowrap text-sm font-bold text-right ${transaction.type === 'credit' ? 'text-primary' : 'text-red-400'}`}>
                          {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
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
                    <Button onClick={handleLoadMore} >
                      Load More
                    </Button>
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

export default Transactions;
