import { ArrowRightIcon, CheckCircle2Icon, SparklesIcon, Share2Icon, CalendarCheckIcon } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Share2Icon,
    title: "Connect Your Social Profiles",
    description:
      "Link Twitter/X, LinkedIn, Facebook, and Instagram in under 30 seconds with secure authentication and zero token headaches.",
    highlight: "One-click connection",
  },
  {
    step: "02",
    icon: SparklesIcon,
    title: "Create or AI-Generate Content",
    description:
      "Draft customized posts or let our AI composer generate viral hooks, tailored tones, and engaging captions with media attachments.",
    highlight: "AI-assisted drafting",
  },
  {
    step: "03",
    icon: CalendarCheckIcon,
    title: "Schedule, Queue & Scale",
    description:
      "Select your platforms, pick peak engagement slots, and let Scheduler handle automated distribution and live analytics tracking.",
    highlight: "Full automation",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-white relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="mb-4 inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold tracking-wider uppercase px-3.5 py-1.5 rounded-full shadow-2xs">
            <CheckCircle2Icon className="size-3.5 text-emerald-600" />
            <span>Effortless Setup</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-slate-900 leading-[1.15]">
            Up and running in{" "}
            <span className="text-emerald-600 italic font-serif">minutes</span>
          </h2>

          <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed">
            No complicated onboarding or technical hurdles. Connect your accounts, write or generate content, and publish everywhere.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
          {steps.map((s, idx) => (
            <div
              key={s.step}
              className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 bg-slate-50/70 border border-slate-200/80 hover:border-emerald-300 hover:bg-white hover:shadow-xl hover:shadow-emerald-600/5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="size-12 rounded-2xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-emerald-600/25 group-hover:scale-105 transition-transform">
                    {s.step}
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    {s.highlight}
                  </span>
                </div>

                <div className="size-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600 mb-4 group-hover:bg-emerald-50 transition-colors">
                  <s.icon className="size-5" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                  {s.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {s.description}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <div className="size-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400">
                    <ArrowRightIcon className="size-3.5" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
