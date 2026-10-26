import { StarIcon, QuoteIcon, CheckCircleIcon } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Head of Growth @ TechScale",
    avatar: "S",
    avatarBg: "from-emerald-500 to-teal-600",
    text: "Scheduler has saved our team 12+ hours every week. The AI composer writes content that genuinely sounds like our brand voice, not generic fluff.",
    metrics: "2.4x reach increase",
  },
  {
    name: "Marcus Lin",
    role: "Indie Creator & Podcaster",
    avatar: "M",
    avatarBg: "from-teal-500 to-emerald-700",
    text: "I used to dread social posting. Now I queue up an entire week of content in 25 minutes. The smart multi-platform schedule alone is easily worth 10x the price.",
    metrics: "18k new followers",
  },
  {
    name: "Priya Desai",
    role: "Agency Founder @ HyperSocial",
    avatar: "P",
    avatarBg: "from-emerald-600 to-cyan-600",
    text: "Finally a scheduler that's clean, intuitive, and modern. The analytics overview makes it crystal clear what's scheduled, published, or needs attention.",
    metrics: "45+ accounts managed",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 sm:py-28 bg-slate-50/70 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="mb-4 inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold tracking-wider uppercase px-3.5 py-1.5 rounded-full shadow-2xs">
            <StarIcon className="size-3.5 fill-emerald-500 text-emerald-500" />
            <span>Community Love</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-slate-900 leading-[1.15]">
            Loved by{" "}
            <span className="text-emerald-600 italic font-serif">
              creators &amp; teams
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed">
            Join thousands of founders, marketers, and creators who scale their social presence effortlessly with Scheduler.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-6 sm:p-7 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-600/5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Stars */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className="size-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                    <CheckCircleIcon className="size-3 text-emerald-600" />
                    Verified User
                  </span>
                </div>

                {/* Quote */}
                <p className="text-slate-700 text-sm sm:text-[15px] leading-relaxed mb-6 font-normal">
                  "{t.text}"
                </p>
              </div>

              {/* Author & Metric */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div
                    className={`size-10 rounded-full bg-gradient-to-br ${t.avatarBg} flex items-center justify-center text-white text-sm font-bold shadow-xs shrink-0`}
                  >
                    {t.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-slate-900 truncate">
                      {t.name}
                    </div>
                    <div className="text-xs text-slate-500 truncate">{t.role}</div>
                  </div>
                </div>

                <div className="mt-3 inline-block text-[11px] font-medium text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-md">
                  Result: {t.metrics}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
