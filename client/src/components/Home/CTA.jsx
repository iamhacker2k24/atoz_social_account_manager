import { Link } from "react-router-dom";
import { ArrowRightIcon, SparklesIcon, CheckCircle2Icon } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-20 sm:py-24 bg-white relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 md:p-20 text-center bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 border border-emerald-500/30 shadow-2xl shadow-emerald-950/40">
          {/* Ambient Glowing Blobs */}
          <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(16,185,129,0.25)_0%,transparent_70%)] blur-2xl" />
          <div className="absolute bottom-0 left-0 w-64 sm:w-72 h-64 sm:h-72 rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(5,150,105,0.2)_0%,transparent_70%)] blur-xl" />

          {/* Background Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            {/* Pill Badge */}
            <div className="mb-6 inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide uppercase px-4 py-1.5 rounded-full shadow-inner">
              <SparklesIcon className="size-3.5 text-emerald-400" />
              <span>Ready to Scale Your Audience?</span>
            </div>

            {/* Heading */}
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl leading-[1.12] font-normal text-white">
              Automate your social{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent italic font-serif">
                growth today
              </span>
            </h2>

            {/* Description */}
            <p className="mt-6 text-slate-300 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
              Join thousands of creators, founders, and marketers who rely on Scheduler to consistently publish high-performing content without burnout.
            </p>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto sm:max-w-none">
              <Link
                to="/login"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full font-bold hover:shadow-[0_10px_25px_rgba(16,185,129,0.4)] inline-flex items-center justify-center gap-2 text-base px-9 py-3.5 transition-all transform active:scale-[0.98]"
              >
                <span>Get Started Free</span>
                <ArrowRightIcon className="size-4" />
              </Link>
              <a
                href="#pricing"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-full font-semibold inline-flex items-center justify-center gap-2 text-base px-8 py-3.5 backdrop-blur-md transition-all active:scale-[0.98]"
              >
                <span>View Pricing Plans</span>
              </a>
            </div>

            {/* Extra assurance */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2Icon className="size-4 text-emerald-400" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2Icon className="size-4 text-emerald-400" />
                Cancel anytime
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2Icon className="size-4 text-emerald-400" />
                Instant setup
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
