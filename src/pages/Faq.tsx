import React, { useEffect, useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Card, CardContent } from '../components/ui/Card';
import { CardDescription } from '../components/ui/CardDescription';
import { api } from '../api/client';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

// Fallback FAQ data for sports prediction platform
const DEFAULT_FAQS: FaqItem[] = [
  {
    id: 1,
    question: 'What is JusPredict?',
    answer: 'JusPredict is a cutting-edge prediction platform that combines AI, data science, and domain expertise to help you make informed predictions on sports outcomes. We provide real-time insights, predictive analytics, and a community-driven experience for sports enthusiasts.',
  },
  {
    id: 2,
    question: 'How do I get started with JusPredict?',
    answer: 'Getting started is simple! Sign up for an account, complete your profile, verify your email, and you\'ll have access to live prediction markets. Start by exploring our featured events and making your first prediction to earn rewards.',
  },
  {
    id: 3,
    question: 'What sports are available on JusPredict?',
    answer: 'We offer predictions across multiple sports including Cricket, Football, Basketball, Soccer, Tennis, and more. Our platform continuously adds new sports and events based on user demand. Check our Sports page to see the latest available markets.',
  },
  {
    id: 4,
    question: 'How are prediction odds calculated?',
    answer: 'Our odds are calculated using advanced machine learning algorithms that analyze historical data, team statistics, player performance, weather conditions, and community sentiment. The odds update in real-time as new data becomes available and more predictions are made.',
  },
  {
    id: 5,
    question: 'Can I withdraw my winnings?',
    answer: 'Yes! Once you accumulate winnings in your account, you can withdraw them through our secure payment methods. Withdrawals are typically processed within 3-5 business days. Check our support page for specific withdrawal policies and minimum amounts.',
  },
  {
    id: 6,
    question: 'What is the minimum prediction amount?',
    answer: 'The minimum prediction amount is $10. This allows everyone to participate in our prediction markets regardless of their budget. You can increase your stake as you become more comfortable with the platform.',
  },
  {
    id: 7,
    question: 'How do I join a Clan?',
    answer: 'Clans are communities of users who share predictions and compete together. You can create your own clan from the Clan page, or request to join existing public clans. Clan leaders can invite members and set clan-specific rules and leaderboards.',
  },
  {
    id: 8,
    question: 'What happens if an event is postponed or cancelled?',
    answer: 'If an event is postponed, your predictions remain active for the rescheduled date. If an event is cancelled, all predictions on that event will be refunded to your account. We notify users immediately of any changes to scheduled events.',
  },
  {
    id: 9,
    question: 'Is JusPredict available in my country?',
    answer: 'JusPredict is available in most countries, but regulations vary by location. Please check our Terms of Service or contact our support team to confirm availability in your specific region. We\'re continuously expanding our service to more regions.',
  },
  {
    id: 10,
    question: 'How do I improve my prediction accuracy?',
    answer: 'Improve your predictions by studying team statistics, analyzing historical performance, following expert insights on our platform, and learning from your prediction history. Our Portfolio page shows your performance metrics to help you refine your strategy.',
  },
];

const Faq: React.FC = () => {
  const [faqs, setFaqs] = useState<FaqItem[]>(DEFAULT_FAQS);
  const [loading, setLoading] = useState<boolean>(true);
  //const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<number>(1); // First item open by default

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await api.post('/misc/v1/faq', {});
        console.log('API Response Data:', data);

        // Handle different response structures
        let faqData: FaqItem[] = [];

        if (data && typeof data === 'object') {
          // Check if data has a faqs property
          if ('faqs' in data && Array.isArray(data.faqs) && data.faqs.length > 0) {
            faqData = data.faqs;
          }
          // Check if data is directly an array
          else if (Array.isArray(data) && data.length > 0) {
            faqData = data;
          }
          // Check if data has a data property with faqs
          else if ('data' in data && Array.isArray(data.data) && data.data.length > 0) {
            faqData = data.data;
          }
        }

        // Use API data if available, otherwise use defaults
        if (faqData.length > 0) {
          setFaqs(faqData);
        } else {
          // API returned empty or no valid data, use defaults
          setFaqs(DEFAULT_FAQS);
        }
      } catch (error: any) {
        console.error('Error fetching FAQs:', error);
        // Don't show error if API fails, just use default FAQs
        console.log('Using default FAQs as fallback');
        setFaqs(DEFAULT_FAQS);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg text-gray-light">
      {/* Page Header */}
      <PageHeader
        title="FAQ"
        tagline="Get answers to your most common questions about JusPredict"
        compact={true}
        isSubpage={true}
      />

      <main className="relative overflow-hidden">
        {/* FAQ Content Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="max-w-[1400px] mx-auto">
            {loading ? (
              <div className="space-y-6">
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                    <HelpCircle className="h-6 w-6 text-primary animate-spin" />
                  </div>
                  <p className="text-gray-text text-lg">Loading FAQs...</p>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-3xl mx-auto space-y-3">
                {faqs.map((faq) => {
                  const isOpen = openId === faq.id;
                  return (
                    <Card
                      key={faq.id}
                      className="border-white/10 bg-dark-card/70 hover:border-primary/40 transition-all duration-300 overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenId(isOpen ? -1 : faq.id)}
                        className="w-full text-left"
                      >
                        <CardContent className="py-4 lg:py-5 flex items-center justify-between gap-4">
                          <h4 className="text-base lg:text-lg font-semibold text-white leading-snug flex-1">
                            {faq.question}
                          </h4>
                          <ChevronDown
                            className={`h-5 w-5 text-primary flex-shrink-0 transition-transform duration-300 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </CardContent>
                      </button>

                      {/* Expanded Content */}
                      {isOpen && (
                        <div className="border-t border-white/5 px-6 pb-4 lg:pb-5">
                          <CardDescription className="text-sm leading-relaxed pt-4">
                            {faq.answer}
                          </CardDescription>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Faq;
