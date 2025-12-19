"use client"

import React, { useEffect, useState } from "react"
import { HelpCircle, ChevronDown } from "lucide-react"
import { PageHeader } from "../components/PageHeader"
import { Card, CardContent } from "../components/ui/Card"
import { CardDescription } from "../components/ui/CardDescription"
import { api } from "../api/api"

/* ---------------- TYPES ---------------- */

interface ApiFaq {
  question: string
  answer: string
  category: string
  sequence: number
}

interface FaqItem {
  id: number
  question: string
  answer: string
}

/* ---------------- DEFAULT FALLBACK ---------------- */

const DEFAULT_FAQS: FaqItem[] = [
  {
    id: 1,
    question: "What is JusPredict?",
    answer:
      "JusPredict is a cutting-edge prediction platform that combines AI, data science, and domain expertise to help you make informed predictions on sports outcomes.",
  },
  {
    id: 2,
    question: "How do I get started with JusPredict?",
    answer:
      "Sign up for an account, complete your profile, verify your email, and start predicting on live events.",
  },
]

/* ---------------- COMPONENT ---------------- */

const Faq: React.FC = () => {
  const [faqs, setFaqs] = useState<FaqItem[]>(DEFAULT_FAQS)
  const [loading, setLoading] = useState(true)
  const [openId, setOpenId] = useState<number>(DEFAULT_FAQS[0]?.id ?? -1)

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await api.post<{
          faqs: ApiFaq[]
          status: { type: string }
        }>("/misc/v1/faq", {})

        if (res?.status?.type === "SUCCESS" && Array.isArray(res.faqs)) {
          const mapped: FaqItem[] = res.faqs
            .sort((a, b) => a.sequence - b.sequence)
            .map((f) => ({
              id: f.sequence,
              question: f.question,
              answer: f.answer,
            }))

          if (mapped.length > 0) {
            setFaqs(mapped)
            setOpenId(mapped[0].id)
            return
          }
        }

        // fallback
        setFaqs(DEFAULT_FAQS)
      } catch (err) {
        console.error("FAQ fetch failed, using defaults", err)
        setFaqs(DEFAULT_FAQS)
      } finally {
        setLoading(false)
      }
    }

    fetchFaqs()
  }, [])

  return (
    <div className="min-h-screen bg-dark-bg text-gray-light">
      {/* Header */}
      <PageHeader
        title="FAQ"
        tagline="Get answers to your most common questions about JusPredict"
        compact
        isSubpage
      />

      <main>
        <section className="px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="max-w-[1400px] mx-auto">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                  <HelpCircle className="h-6 w-6 text-primary animate-spin" />
                </div>
                <p className="text-gray-text text-lg">Loading FAQs...</p>
              </div>
            ) : (
              <div className="w-full max-w-3xl mx-auto space-y-3">
                {faqs.map((faq) => {
                  const isOpen = openId === faq.id

                  return (
                    <Card
                      key={faq.id}
                      className="border-white/10 bg-dark-card/70 hover:border-primary/40 transition-all"
                    >
                      <button
                        onClick={() => setOpenId(isOpen ? -1 : faq.id)}
                        className="w-full text-left"
                      >
                        <CardContent className="py-4 lg:py-5 flex justify-between gap-4">
                          <h4 className="text-base lg:text-lg font-semibold text-white flex-1">
                            {faq.question}
                          </h4>
                          <ChevronDown
                            className={`h-5 w-5 text-primary transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </CardContent>
                      </button>

                      {isOpen && (
                        <div className="border-t border-white/5 px-6 pb-4">
                          <CardDescription className="text-sm pt-4">
                            {faq.answer}
                          </CardDescription>
                        </div>
                      )}
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Faq
