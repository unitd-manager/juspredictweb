import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
import { api } from '../api/api';
import { Loader2, ArrowLeft, DollarSign, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';

interface OrderDetailsData {
  orderDetails: {
    earnings: string;
    eventDescription: string;
    eventId: string;
    eventName: string;
    eventShortName: string;
    eventStartDate: string;
    eventStatus: string;
    investmentAmt: string;
    lastActivity: string;
    matchedAmt: string;
    orderId: string;
    orderStatus: string;
    orderType: string;
    percentage: string;
    potentialReturns: string;
    predictedOutcome: string;
    predictedOutcomeChoice: string;
    predictionOutcome: string;
    question: string;
    questionId: string;
  };
  status: {
    details?: Array<{
      code: string;
      message: string;
      type: string;
    }>;
    type: string;
  };
}

const OrderDetails: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();

  const [orderData, setOrderData] = useState<OrderDetailsData['orderDetails'] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError('No order ID provided');
      return;
    }

    const fetchOrderDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.post<OrderDetailsData>('/order/v1/details', {
          orderId: orderId,
        });

        console.log('Order Details Response:', response);

        if (response?.status?.type === 'SUCCESS' && response?.orderDetails) {
          setOrderData(response.orderDetails);
        } else {
          setError(
            response?.status && 'details' in response.status && Array.isArray((response.status as any).details)
              ? (response.status as any).details[0]?.message || 'Failed to fetch order details'
              : 'Failed to fetch order details'
          );
        }
      } catch (err: any) {
        console.error('Failed to fetch order details:', err);
        setError(err?.message || 'Failed to fetch order details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PREDICTION_EVENT_STATUS_ACTIVE':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'PREDICTION_EVENT_STATUS_COMPLETED':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'PREDICTION_EVENT_STATUS_CANCELLED':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPredictionOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'PREDICTIONOUTCOME_SUCCESS':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'PREDICTIONOUTCOME_FAILURE':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'PREDICTIONOUTCOME_UNSPECIFIED':
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Convert enum-like values to human-readable labels
  const humanizeEnum = (val?: string) => {
    if (!val) return '--';
    // Known prefixes to remove
    const cleaned = String(val)
      .replace(/^PREDICTION_EVENT_STATUS_/, '')
      .replace(/^EVENT_STATUS_/, '')
      .replace(/^PREDICTIONOUTCOME_/, '')
      .replace(/^PREDICTION_STATUS_/, '')
      .replace(/^PREDICTIONTIMEINFORCE_/, '')
      .replace(/^QUESTION_TYPE_/, '')
      .replace(/^ORDER_TYPE_/, '')
      .replace(/^ORDERSTATUS_/, '')
      .replace(/^PREDICTION_/, '')
      .replace(/_/g, ' ')
      .toLowerCase();

    // Title case
    return cleaned
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ')
      .trim();
  };

  const mapPredictionOutcome = (val?: string) => {
    if (!val) return '--';
    const m: Record<string, string> = {
      PREDICTIONOUTCOME_SUCCESS: 'Success',
      PREDICTIONOUTCOME_FAILURE: 'Failure',
      PREDICTIONOUTCOME_UNSPECIFIED: 'Unspecified',
    };
    return m[val] || humanizeEnum(val);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (value: string | number) => {
    const num = Number(value);
    if (!isFinite(num)) return '--';
    return `$${num.toFixed(2)}`;
  };

  if (!orderId) {
    return (
      <div className="min-h-screen bg-dark-bg text-gray-light">
        <PageHeader title="Order Details" tagline="" compact={true} isSubpage={true} />
        <div className="px-4 sm:px-6 lg:px-8 pb-10">
          <div className="max-w-[1200px] mx-auto">
            <div className="rounded-2xl border border-white/10 bg-dark-card p-8">
              <div className="flex items-center gap-3 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span>No order ID provided</span>
              </div>
              <Button
                onClick={() => navigate(-1)}
                className="mt-4 bg-primary text-dark-bg hover:bg-primary/90"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-gray-light">
      <PageHeader title="Order Details" tagline="" compact={true} isSubpage={true} />

      <div className="px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-[1200px] mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-text hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          {/* Loading State */}
          {isLoading && (
            <div className="rounded-2xl border border-white/10 bg-dark-card p-8 flex flex-col items-center justify-center min-h-[400px]">
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
              <p className="text-gray-text">Loading order details...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-red-400 font-semibold mb-1">Error</h3>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Order Details Table */}
          {orderData && !isLoading && (
            <div className="rounded-2xl border border-white/10 bg-dark-card overflow-hidden">
              {/* Header */}
              <div className="bg-dark-lighter px-6 py-4 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">Order Information</h2>
                {/* <p className="text-sm text-gray-text mt-1">ID: {orderData.orderId}</p> */}
              </div>

              {/* Main Details Table */}
              <div className="divide-y divide-white/10">
                {/* Order ID Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-b border-white/10">
                  {/* <div className="px-6 py-4 border-r border-white/5">
                    <div className="text-xs text-gray-text font-medium mb-1">Order ID</div>
                    <div className="text-white font-semibold break-all">{orderData.orderId}</div>
                  </div> */}
                  <div className="px-6 py-4 border-r border-white/5">
                    <div className="text-xs text-gray-text font-medium mb-1">Order Type</div>
                    <div className="text-white font-semibold">{humanizeEnum(orderData.orderType)}</div>
                  </div>
                  <div className="px-6 py-4">
                    <div className="text-xs text-gray-text font-medium mb-1">Order Status</div>
                    <Badge className={`inline-block ${getStatusColor(orderData.orderStatus)}`}>
                      {orderData.orderStatus || '--'}
                    </Badge>
                  </div>
                </div>

                {/* Event Information */}
                <div className="px-6 py-4">
                  <h3 className="text-sm font-bold text-white mb-4">Event Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* <div>
                      <div className="text-xs text-gray-text font-medium mb-1">Event ID</div>
                      <div className="text-white break-all">{orderData.eventId}</div>
                    </div> */}
                    <div>
                      <div className="text-xs text-gray-text font-medium mb-1">Event Name</div>
                      <div className="text-white">{orderData.eventName || '--'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-text font-medium mb-1">Event Short Name</div>
                      <div className="text-white">{orderData.eventShortName || '--'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-text font-medium mb-1">Event Description</div>
                      <div className="text-white">{orderData.eventDescription || '--'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-text font-medium mb-1">Event Start Date</div>
                      <div className="text-white text-sm">{formatDate(orderData.eventStartDate)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-text font-medium mb-1">Event Status</div>
                      <Badge className={`inline-block ${getStatusColor(orderData.eventStatus)}`}>
                        {humanizeEnum(orderData.eventStatus)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Question Information */}
                <div className="px-6 py-4">
                  <h3 className="text-sm font-bold text-white mb-4">Question Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* <div>
                      <div className="text-xs text-gray-text font-medium mb-1">Question ID</div>
                      <div className="text-white break-all">{orderData.questionId}</div>
                    </div> */}
                    <div>
                      <div className="text-xs text-gray-text font-medium mb-1">Question</div>
                      <div className="text-white">{orderData.question || '--'}</div>
                    </div>
                    <div className="md:col-span-2">
                        <div className="text-xs text-gray-text font-medium mb-1">Predicted Outcome</div>
                        <div className="text-white">{humanizeEnum(orderData.predictedOutcome)}</div>
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="px-6 py-4">
                  <h3 className="text-sm font-bold text-white mb-4">Financial Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-dark-lighter rounded-lg p-4 border border-white/5">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-gray-text" />
                        <div className="text-xs text-gray-text font-medium">Investment Amount</div>
                      </div>
                      <div className="text-2xl font-bold text-white">{formatCurrency(orderData.investmentAmt)}</div>
                    </div>
                    <div className="bg-dark-lighter rounded-lg p-4 border border-white/5">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-gray-text" />
                        <div className="text-xs text-gray-text font-medium">Matched Amount</div>
                      </div>
                      <div className="text-2xl font-bold text-white">{formatCurrency(orderData.matchedAmt)}</div>
                    </div>
                    <div className="bg-dark-lighter rounded-lg p-4 border border-white/5">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-gray-text" />
                        <div className="text-xs text-gray-text font-medium">Potential Returns</div>
                      </div>
                      <div className="text-2xl font-bold text-primary">{formatCurrency(orderData.potentialReturns)}</div>
                    </div>
                    <div className="bg-dark-lighter rounded-lg p-4 border border-white/5">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-gray-text" />
                        <div className="text-xs text-gray-text font-medium">Earnings</div>
                      </div>
                      <div className={`text-2xl font-bold ${Number(orderData.earnings) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(orderData.earnings)}
                      </div>
                    </div>
                    <div className="bg-dark-lighter rounded-lg p-4 border border-white/5">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-xs text-gray-text font-medium">Percentage</div>
                      </div>
                      <div className="text-2xl font-bold text-white">{orderData.percentage}%</div>
                    </div>
                  </div>
                </div>

                {/* Prediction Outcome */}
                <div className="px-6 py-4">
                  <h3 className="text-sm font-bold text-white mb-4">Prediction Result</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-xs text-gray-text font-medium mb-1">Prediction Outcome</div>
                      <Badge className={`inline-block ${getPredictionOutcomeColor(orderData.predictionOutcome)}`}>
                        {mapPredictionOutcome(orderData.predictionOutcome)}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-xs text-gray-text font-medium mb-1">Predicted Outcome Choice</div>
                      <div className="text-white">{orderData.predictedOutcomeChoice || '--'}</div>
                    </div>
                  </div>
                </div>

                {/* Activity Information */}
                <div className="px-6 py-4">
                  <h3 className="text-sm font-bold text-white mb-4">Activity</h3>
                  <div>
                    <div className="text-xs text-gray-text font-medium mb-1">Last Activity</div>
                    <div className="text-white text-sm">{formatDate(orderData.lastActivity)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* No Data State */}
          {!orderData && !isLoading && !error && (
            <div className="rounded-2xl border border-white/10 bg-dark-card p-8 text-center">
              <p className="text-gray-text">No order details available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
