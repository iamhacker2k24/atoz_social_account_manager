import {
  CalendarDaysIcon,
  Wand2Icon,
  Share2Icon,
  ZapIcon,
  BarChart3Icon,
  HashIcon,
  LayersIcon,
} from "lucide-react";

const features = [
  {
    icon: CalendarDaysIcon,
    title: "Smart Multi-Post Scheduling",
    description:
      "Queue posts across Twitter, LinkedIn, Facebook, and Instagram with customized timing, intervals, and optimal peak hours.",
  },
  {
    icon: Wand2Icon,
    title: "AI Caption & Copy Generator",
    description:
      "Generate platform-tailored hooks, storytelling captions, and engaging calls-to-action with our built-in Claude & GPT AI models.",
  },
  {
    icon: BarChart3Icon,
    title: "Unified Activity Dashboard",
    description:
      "Get a real-time command center for all published content, queue status, scheduled timeline, and account sync metrics.",
  },
  {
    icon: Share2Icon,
    title: "One-Click Multi-Platform Sync",
    description:
      "Seamlessly connect your business accounts, creator profiles, and pages. Post simultaneously or customize per network.",
  },
  {
    icon: ZapIcon,
    title: "Instant Live Publishing",
    description:
      "Need to react to breaking trends immediately? Publish directly with instant preview verification and error safety checks.",
  },
  {
    icon: HashIcon,
    title: "AI Viral Hashtags & SEO",
    description:
      "Get smart, trending hashtag recommendations tailored to your niche to maximize discoverability and algorithmic reach.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-slate-50/70 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="mb-4 inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold tracking-wider uppercase px-3.5 py-1.5 rounded-full shadow-2xs">
            <ZapIcon className="size-3.5 text-emerald-600" />
            <span>Built for Modern Growth</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-slate-900 leading-[1.15]">
            Automate your entire{" "}
            <span className="text-emerald-600 italic font-serif">
              social media workflow
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            From smart calendar queueing to AI content creation — Scheduler takes the repetitive busywork off your plate so you can scale effortlessly.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-600/5 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="size-12 rounded-xl flex items-center justify-center mb-5 bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 group-hover:shadow-md group-hover:shadow-emerald-600/25 transition-all duration-300">
                  <f.icon className="size-6 transition-transform group-hover:scale-110" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2.5 group-hover:text-emerald-700 transition-colors">
                  {f.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {f.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform">
                <span>Learn more →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
