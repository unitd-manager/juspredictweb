import React from 'react';
import {
  Scale,
  BrainCircuit,
  Shield,
  Users,
  Sparkles,
  Lightbulb,
  Mail,
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { CardDescription } from '../components/ui/CardDescription';
import { Input } from '../components/ui/Input';
import { Avatar, AvatarFallback } from '../components/ui/Avatar';

const values = [
  {
    icon: Lightbulb,
    label: 'Mission',
    title: 'Mission',
    description:
      'To democratise access to razor-sharp legal knowledge, making insights once locked in casebooks and chambers instantly available for every legal mind.',
  },
  {
    icon: Shield,
    label: 'Integrity',
    title: 'Integrity',
    description:
      'We are committed to the highest standards of accuracy, transparency, and accountability in every prediction and product we build.',
  },
  {
    icon: Sparkles,
    label: 'Innovation',
    title: 'Innovation',
    description:
      'We blend AI, data science, and deep domain expertise to reimagine how legal decisions are understood, compared, and forecast.',
  },
  {
    icon: Shield,
    label: 'Trust',
    title: 'Trust',
    description:
      'Trust is our north star. From data handling to model design, every decision is anchored in ethical and responsible innovation.',
  },
  {
    icon: BrainCircuit,
    label: 'Experimentation',
    title: 'Experimentation',
    description:
      'We constantly experiment, refine, and iterate — pushing the boundaries of what\'s possible in legal intelligence.',
  },
  {
    icon: Users,
    label: 'Empowerment',
    title: 'Empowerment',
    description:
      'We exist to empower litigators, researchers, and decision-makers to act with confidence backed by data-driven insights.',
  },
];

const coreTeam = [
  { initials: 'AS', name: 'Aarav Sharma', role: 'CEO' },
  { initials: 'PS', name: 'Priya Singh', role: 'CTO' },
  { initials: 'LD', name: 'Lead Developer', role: 'Lead Developer' },
];

const itTeam = [
  { initials: 'AS', name: 'Aarav Sharma', role: 'Lead Engineer' },
  { initials: 'SA', name: 'Solutions Architect', role: 'Solutions Architect' },
  { initials: 'PS', name: 'Priya Singh', role: 'Product Engineer' },
];

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-bg text-gray-light">
      {/* Page Header */}
      <PageHeader
        title="About JusPredict"
        tagline="Redefining the legal landscape through data-driven intelligence and innovation."
        compact={true}
        isSubpage={true}
      />

      <main className="relative overflow-hidden">
        {/* Hero Content Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              {/* Left Content */}
              <div className="space-y-6">
                <p className="inline-flex items-center rounded-full border border-white/20 bg-dark-card px-4 py-1 text-xs font-semibold uppercase tracking-widest text-gray-text">
                  Legal Tech · AI Insights · Future Ready
                </p>
                <h1 className="text-3xl lg:text-4xl font-bold leading-tight text-white">
                  Unveiling Top-rated
                  <span className="block bg-gradient-to-r from-primary to-team-blue bg-clip-text text-transparent">
                    Future of Legal Tech
                  </span>
                </h1>
                <p className="text-base lg:text-lg text-gray-text leading-relaxed max-w-xl">
                  At JusPredict, we are redefining the legal landscape through data-driven legal intelligence —
                  empowering litigators, law firms, and institutions with actionable insights, prediction tools,
                  and intuitive visual analytics.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-primary text-black hover:bg-primary/90 rounded-lg px-6">
                    Know it
                  </Button>
                  <Button variant="outline" className="rounded-lg px-6">
                    Our Platform
                  </Button>
                </div>
              </div>

              {/* Right Feature Card */}
              <div className="relative">
                <Card className="border-white/10 bg-dark-card overflow-hidden">
                  <CardContent className="p-6 lg:p-8 space-y-6">
                    {/* Header with Icon and Accuracy */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="inline-flex items-center gap-3 rounded-lg bg-dark-bg/50 px-3 py-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/80 to-team-blue/80 text-white">
                          <Scale className="h-5 w-5" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-semibold uppercase tracking-widest text-gray-muted">
                            Legal Outcome Radar
                          </p>
                          <p className="text-xs text-gray-text">
                            Visualise arguments, precedents & probabilities.
                          </p>
                        </div>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-dark-bg/50 px-3 py-2 text-right">
                        <p className="text-xs font-medium text-gray-muted">Prediction Accuracy</p>
                        <p className="text-lg font-semibold text-primary">92.8%</p>
                      </div>
                    </div>

                    {/* Two Feature Cards */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2 rounded-lg border border-white/10 bg-dark-bg/50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-muted">
                          Case Intelligence
                        </p>
                        <p className="text-sm text-gray-text">
                          Map similar cases, arguments and judicial leanings in seconds instead of days.
                        </p>
                      </div>
                      <div className="space-y-2 rounded-lg border border-white/10 bg-dark-bg/50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-muted">
                          Real-time Insights
                        </p>
                        <p className="text-sm text-gray-text">
                          Tap into continuously updated legal datasets and evolving case law.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-muted mb-3">Our Purpose</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-white">
                Mission &amp; Vision
              </h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-white/10 bg-dark-card/70">
                <CardHeader>
                  <span className="inline-flex w-fit rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary mb-3">
                    Our Mission
                  </span>
                  <CardTitle className="text-xl">Redefining access to legal insight</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription>
                    To democratise access to razor-sharp legal knowledge, making complex jurisprudence
                    simple, searchable, and insight-rich for every legal professional, from chambers to
                    courtrooms worldwide.
                  </CardDescription>
                  <Button size="sm" className="bg-primary text-black hover:bg-primary/90 rounded-lg">
                    Know it
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-dark-card/70">
                <CardHeader>
                  <span className="inline-flex w-fit rounded-full bg-team-blue/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-team-blue mb-3">
                    Our Vision
                  </span>
                  <CardTitle className="text-xl">A smarter, fairer legal future</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription>
                    To design intelligent tools that help legal teams anticipate outcomes, craft sharper
                    strategies, and unlock a more transparent and data-driven justice ecosystem.
                  </CardDescription>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    About it
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-muted mb-3">Our Values</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-white">
                The principles behind every prediction
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <Card
                    key={value.title + value.label}
                    className="border-white/10 bg-dark-card/70 hover:border-primary/40 transition-all duration-300"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/80 to-team-blue/80 text-white flex-shrink-0">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-gray-muted mb-1">
                            {value.label}
                          </p>
                          <CardTitle className="text-base">{value.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription>{value.description}</CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Process / Journey Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="max-w-[1400px] mx-auto">
            <Card className="border-white/10 bg-dark-card/70 overflow-hidden">
              <CardContent className="grid gap-8 py-10 sm:grid-cols-3">
                <div className="space-y-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-dark-bg font-bold">
                    1
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-muted">
                    Connect
                  </p>
                  <p className="text-sm font-semibold text-white">Onboard your matters</p>
                  <CardDescription>
                    Seamlessly sync case data and briefs from your existing tools into JusPredict.
                  </CardDescription>
                </div>
                <div className="space-y-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-dark-bg font-bold">
                    2
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-muted">
                    Analyse
                  </p>
                  <p className="text-sm font-semibold text-white">Discover deep patterns</p>
                  <CardDescription>
                    Surface precedent patterns, judge tendencies, and argument strengths in seconds.
                  </CardDescription>
                </div>
                <div className="space-y-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-dark-bg font-bold">
                    3
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-muted">
                    Act
                  </p>
                  <p className="text-sm font-semibold text-white">Strategise with confidence</p>
                  <CardDescription>
                    Build data-backed strategies and communicate risk clearly to every stakeholder.
                  </CardDescription>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Team Sections */}
        <section className="px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Core Team */}
              <div className="space-y-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-muted mb-3">
                    Meet The Team
                  </p>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white">
                    The minds building the future of legal AI
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {coreTeam.map((member) => (
                    <div key={member.name + member.role} className="flex flex-col items-center gap-4">
                      <Avatar className="h-20 w-20 border border-white/10 bg-gradient-to-br from-primary/80 to-team-blue/80">
                        <AvatarFallback className="text-white font-semibold text-lg">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1 text-center">
                        <p className="text-sm font-semibold text-white">{member.name}</p>
                        <p className="text-xs text-gray-muted">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* IT Team */}
              <div className="space-y-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-muted mb-3">
                    Meet IT Team
                  </p>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white">
                    The builders behind the experience
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {itTeam.map((member) => (
                    <div key={member.name + member.role} className="flex flex-col items-center gap-4">
                      <Avatar className="h-20 w-20 border border-white/10 bg-gradient-to-br from-primary/80 to-team-blue/80">
                        <AvatarFallback className="text-white font-semibold text-lg">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1 text-center">
                        <p className="text-sm font-semibold text-white">{member.name}</p>
                        <p className="text-xs text-gray-muted">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter CTA Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="max-w-[1400px] mx-auto">
            <Card className="border-primary/40 bg-gradient-to-r from-primary/10 via-team-blue/5 to-primary/10 overflow-hidden">
              <CardContent className="flex flex-col gap-6 py-10 sm:py-12 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-3 max-w-xl">
                  <p className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                    <Mail className="h-3 w-3" />
                    Join Our Newsletter
                  </p>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white">
                    Stay ahead of every legal innovation wave
                  </h2>
                  <p className="text-sm text-gray-text">
                    Be the first to know about new features, research drops, and curated legal-tech insights
                    from the JusPredict team.
                  </p>
                </div>
                <form className="w-full lg:w-auto lg:max-w-md space-y-3">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="bg-dark-bg/80 border-white/10 h-10 text-sm"
                    />
                    <Button className="bg-primary text-black hover:bg-primary/90 h-10 px-6 text-sm rounded-lg font-semibold whitespace-nowrap">
                      Subscribe
                    </Button>
                  </div>
                  <p className="text-xs text-gray-text">
                    We respect your inbox. No spam, just sharp legal-tech intel.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
