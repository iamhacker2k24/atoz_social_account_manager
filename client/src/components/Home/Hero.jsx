import { Link } from "react-router-dom";
import { ArrowRightIcon, CheckCircle2Icon, SparklesIcon, TrendingUpIcon } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-6 pb-20 sm:pb-28">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      {/* Emerald Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] sm:w-[950px] h-[480px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.12)_0%,rgba(5,150,105,0.04)_45%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-48 left-1/4 -translate-x-1/2 w-72 h-72 rounded-full bg-emerald-400/5 blur-3xl pointer-events-none" />
      <div className="absolute top-64 right-1/4 translate-x-1/2 w-80 h-80 rounded-full bg-teal-400/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-50/90 border border-emerald-200/80 text-emerald-800 text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full mb-6 sm:mb-8 shadow-xs backdrop-blur-sm transition-transform hover:scale-105">
          <span className="relative flex size-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
          </span>
          <span className="flex items-center gap-1.5 font-semibold">
            <SparklesIcon className="size-3.5 text-emerald-600" />
            Next-Gen Social Media Automation
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight text-slate-900 leading-[1.08]">
          Schedule smarter.
          <br />
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent italic font-serif">
            Grow faster.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Scheduler lets you create, schedule, and auto-engage across Twitter, LinkedIn, Facebook, and Instagram — powered by AI that writes captions and drives real audience growth.
        </p>

        {/* CTAs */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto sm:max-w-none">
          <Link
            to="/login"
            className="w-full sm:w-auto bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 hover:shadow-[0_10px_25px_rgba(16,185,129,0.35)] shadow-md shadow-emerald-600/20 inline-flex items-center justify-center gap-2 text-base px-8 py-3.5 transition-all transform active:scale-[0.98]"
          >
            <span>Start for free</span>
            <ArrowRightIcon className="size-4" />
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto bg-white/80 hover:bg-white text-slate-700 border border-slate-200/90 rounded-full font-semibold hover:border-emerald-300 hover:text-emerald-700 inline-flex items-center justify-center gap-2 text-base px-8 py-3.5 backdrop-blur-sm transition-all shadow-2xs active:scale-[0.98]"
          >
            <span>See how it works</span>
          </a>
        </div>

        {/* Trust bullets */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <CheckCircle2Icon className="size-4 text-emerald-600" />
            No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2Icon className="size-4 text-emerald-600" />
            Free forever tier
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2Icon className="size-4 text-emerald-600" />
            Setup in 2 minutes
          </span>
        </div>
      </div>

      {/* Modern Dashboard Mockup Preview */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="relative rounded-2xl sm:rounded-3xl p-1.5 sm:p-2.5 bg-gradient-to-b from-emerald-100/60 via-slate-100 to-white shadow-2xl shadow-emerald-500/10 border border-emerald-100/70">
          <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200/80 bg-white">
            {/* Window chrome header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50/90 border-b border-slate-200/80">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-red-400" />
                <div className="size-3 rounded-full bg-amber-400" />
                <div className="size-3 rounded-full bg-emerald-400" />
                <span className="ml-2 hidden sm:inline-block text-xs font-medium text-slate-400">
                  scheduler.app/dashboard
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full font-medium">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>All Systems Live</span>
              </div>
            </div>

            {/* Mock content */}
            <div className="p-4 sm:p-7 bg-slate-50/50">
              {/* Stat row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5">
                {[
                  { val: "18", label: "Scheduled Posts", change: "+14%" },
                  { val: "64", label: "Published Live", change: "+28%" },
                  { val: "4", label: "Active Channels", change: "100% Synced" },
                  { val: "99.8%", label: "Engagement Score", change: "+4.2%" },
                ].map((s, idx) => (
                  <div
                    key={s.label}
                    className="rounded-xl sm:rounded-2xl p-3.5 sm:p-4 bg-white border border-slate-200/70 shadow-2xs hover:border-emerald-200 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
                        {s.val}
                      </div>
                      <span className="text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                        {s.change}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Feed preview */}
              <div className="rounded-xl sm:rounded-2xl p-4 sm:p-5 bg-white border border-slate-200/70 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <TrendingUpIcon className="size-4 text-emerald-600" />
                    <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                      Live Queue &amp; Automation Feed
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">Real-time sync</span>
                </div>

                {[
                  {
                    channel: "LinkedIn & X",
                    text: "Productivity framework: 3 AI rules that doubled our organic reach in 30 days.",
                    status: "Published",
                    time: "Just now",
                  },
                  {
                    channel: "Instagram & Facebook",
                    text: "Behind the scenes: How our automated weekly calendar is planned and queued.",
                    status: "Scheduled",
                    time: "Today, 4:30 PM",
                  },
                  {
                    channel: "AI Assistant",
                    text: "Auto-generated replies to 8 top audience inquiries with sentiment analysis.",
                    status: "Automated",
                    time: "12m ago",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 sm:p-3 rounded-xl bg-slate-50/70 hover:bg-emerald-50/40 border border-slate-100 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="size-2 rounded-full bg-emerald-500 mt-1.5 sm:mt-0 shrink-0" />
                      <div>
                        <span className="text-xs font-semibold text-emerald-800 mr-2">
                          [{item.channel}]
                        </span>
                        <span className="text-xs sm:text-sm text-slate-700">{item.text}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                        {item.status}
                      </span>
                      <span className="text-xs text-slate-400">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
