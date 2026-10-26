import { CheckIcon, SparklesIcon, CircleCheckBigIcon } from "lucide-react";
import { Link } from "react-router-dom";

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    description: "Perfect for creators and individuals just getting started with social automation.",
    features: [
      "2 social accounts connected",
      "15 scheduled posts / month",
      "AI content generator (10 credits/mo)",
      "Standard analytics overview",
      "Community support",
    ],
    cta: "Get Started Free",
    highlight: false,
    badge: null,
  },
  {
    name: "Pro Creator",
    price: "$29",
    period: "/month",
    description: "Everything you need to automate your social pipeline and 10x your audience growth.",
    features: [
      "Unlimited connected accounts",
      "Unlimited post scheduling & queues",
      "AI content generator (300 credits/mo)",
      "Smart optimal time suggestions",
      "Multi-channel simultaneous publishing",
      "Priority 24/7 support",
    ],
    cta: "Start 14-day Free Trial",
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Agency & Teams",
    price: "$79",
    period: "/month",
    description: "For agencies and high-output teams managing multiple brands and client accounts.",
    features: [
      "Everything in Pro Creator",
      "Up to 5 team member seats",
      "Unlimited AI generation credits",
      "Custom AI brand personas & tones",
      "Client approval workflows",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    highlight: false,
    badge: null,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 sm:py-28 bg-white relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="mb-4 inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold tracking-wider uppercase px-3.5 py-1.5 rounded-full shadow-2xs">
            <CircleCheckBigIcon className="size-3.5 text-emerald-600" />
            <span>Transparent Pricing</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-slate-900 leading-[1.15]">
            Simple plans for every stage{" "}
            <span className="text-emerald-600 italic font-serif">
              of growth
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed">
            Start completely free, scale as your channels expand. No hidden platform fees or surprise invoices.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl sm:rounded-3xl p-7 sm:p-8 flex flex-col justify-between relative transition-all duration-300 ${
                plan.highlight
                  ? "bg-gradient-to-b from-emerald-600 via-emerald-600 to-emerald-700 text-white shadow-2xl shadow-emerald-600/30 border-2 border-emerald-500 scale-[1.02] md:scale-105 z-10"
                  : "bg-white text-slate-900 border border-slate-200/90 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-600/5"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-950 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md flex items-center gap-1.5">
                  <SparklesIcon className="size-3 text-emerald-400" />
                  <span>{plan.badge}</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3
                    className={`text-lg font-bold ${
                      plan.highlight ? "text-emerald-100" : "text-emerald-700"
                    }`}
                  >
                    {plan.name}
                  </h3>
                </div>

                <div className="flex items-baseline gap-1 my-4">
                  <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      plan.highlight ? "text-emerald-200" : "text-slate-500"
                    }`}
                  >
                    {plan.period}
                  </span>
                </div>

                <p
                  className={`text-sm leading-relaxed mb-6 ${
                    plan.highlight ? "text-emerald-100" : "text-slate-600"
                  }`}
                >
                  {plan.description}
                </p>

                <div
                  className={`h-px w-full my-6 ${
                    plan.highlight ? "bg-emerald-500/50" : "bg-slate-100"
                  }`}
                />

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <div
                        className={`size-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          plan.highlight
                            ? "bg-emerald-500/60 text-white"
                            : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        }`}
                      >
                        <CheckIcon className="size-3 stroke-[2.5]" />
                      </div>
                      <span
                        className={
                          plan.highlight ? "text-emerald-50" : "text-slate-700"
                        }
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/login"
                className={`w-full text-center py-3.5 px-6 rounded-full font-semibold text-sm transition-all duration-200 transform active:scale-[0.98] ${
                  plan.highlight
                    ? "bg-white text-emerald-800 hover:bg-emerald-50 shadow-lg shadow-emerald-950/20"
                    : "bg-slate-900 text-white hover:bg-emerald-600 shadow-sm"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
