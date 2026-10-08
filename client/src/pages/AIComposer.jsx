import { useEffect, useState } from "react";
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  HistoryIcon,
  ImageIcon,
  Loader2Icon,
  XIcon,
} from "lucide-react";

import { dummyGenerationData, PLATFORMS } from "../assets/assets";

const AIComposer = () => {
  // AI COMPOSER STATE

  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("Professional");
  const [generateImage, setGenerateImage] = useState(true);
  const [loading, setLoading] = useState(false);

  const [generations, setGenerations] = useState([]);

  // SCHEDULER STATE

  const [activeScheduler, setActiveScheduler] = useState(null);

  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const [scheduling, setScheduling] = useState(false);

  // TONES

  const tones = ["Professional", "Creative", "Funny", "Minimalist", "Excited"];

  // FETCH GENERATIONS

  const fetchGenerations = async () => {
    // Later replace with API call
    setGenerations(dummyGenerationData);
  };

  useEffect(() => {
    fetchGenerations();
  }, []);

  // GENERATE AI POST

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      return;
    }

    setLoading(true);

    try {
      // -----------------------------------------------
      // Later replace with your backend API
      // -----------------------------------------------
      // const response = await axios.post(
      //   "/api/ai/generate",
      //   {
      //     prompt,
      //     tone,
      //     generateImage,
      //   }
      // );

      setTimeout(() => {
        setLoading(false);

        // Demo purpose
        fetchGenerations();
      }, 2000);
    } catch (error) {
      console.error("Generation error:", error);
      setLoading(false);
    }
  };

  // OPEN SCHEDULER

  const openScheduler = (generation) => {
    setActiveScheduler(generation);

    // Reset previous scheduler values
    setSelectedPlatforms([]);
    setScheduledDate("");
    setScheduledTime("");
  };

  // CLOSE SCHEDULER

  const closeScheduler = () => {
    if (scheduling) return;

    setActiveScheduler(null);
    setSelectedPlatforms([]);
    setScheduledDate("");
    setScheduledTime("");
  };

  // TOGGLE PLATFORM

  const togglePlatform = (platformId) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId],
    );
  };

  // SCHEDULE POST

  const handleSchedule = async () => {
    if (!activeScheduler) return;

    if (selectedPlatforms.length === 0) {
      alert("Please select at least one platform.");
      return;
    }

    if (!scheduledDate) {
      alert("Please select a date.");
      return;
    }

    if (!scheduledTime) {
      alert("Please select a time.");
      return;
    }

    setScheduling(true);

    try {
      // Later connect this to your backend

      // await axios.post("/api/posts/schedule", {
      //   generationId: activeScheduler._id,
      //   platforms: selectedPlatforms,
      //   date: scheduledDate,
      //   time: scheduledTime,
      // });

      setTimeout(() => {
        setScheduling(false);
        setActiveScheduler(null);

        setSelectedPlatforms([]);
        setScheduledDate("");
        setScheduledTime("");

        alert("Post scheduled successfully!");
      }, 1200);
    } catch (error) {
      console.error("Scheduling error:", error);
      setScheduling(false);
    }
  };

  // RETURN

  return (
    <div className="space-y-8">
      {/* AI COMPOSER*/}

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        {/* Heading */}

        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            What should we create today?
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Turn your idea into engaging social media content with AI.
          </p>
        </div>

        {/* =================================================
            PROMPT
        ================================================= */}

        <div className="relative group mt-6">
          <textarea
            className="w-full px-6 py-6 pb-16 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 transition resize-none h-40"
            placeholder="Share your idea... (e.g. A post about the launch of our new eco-friendly coffee beans)"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          {/* AI IMAGE BUTTON */}

          <div className="absolute bottom-4 right-2.5 flex items-center gap-3 text-sm">
            <button
              type="button"
              onClick={() => setGenerateImage(!generateImage)}
              className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg"
            >
              <span>AI Image</span>

              <div
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                  generateImage ? "bg-red-500" : "bg-slate-200"
                }`}
              >
                <span
                  className={`pointer-events-none size-4 rounded-full bg-white shadow-sm transition-transform duration-200 mt-0.5 ${
                    generateImage ? "translate-x-4.5" : "translate-x-0.5"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* =================================================
            TONE + GENERATE
        ================================================= */}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-5">
          {/* Tones */}

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-500">Tone:</span>

            {tones.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTone(item)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  tone === item
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Generate button */}

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium"
          >
            {loading ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <span>Generate</span>
                <ArrowRightIcon className="size-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI GENERATED POSTS*/}

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        {/* Header */}

        <div className="flex items-center justify-between text-slate-600 mb-6">
          <div className="flex items-center gap-2">
            <HistoryIcon className="size-5" />

            <h2 className="text-xl text-slate-800">Recent Generations</h2>
          </div>

          <span className="text-sm text-slate-500 bg-slate-50 px-2 py-1 rounded">
            {generations.length} total
          </span>
        </div>

        {/* =================================================
            GENERATION GRID
        ================================================= */}

        {generations.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            No generations yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {generations.map((gen) => (
              <div
                key={gen._id}
                className="group bg-white rounded-2xl border border-slate-100 p-5 hover:border-red-200 transition-all relative overflow-hidden"
              >
                <div className="flex flex-col h-full space-y-4">
                  {/* Date + Tone */}

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 uppercase tracking-wider">
                      {gen.createdAt
                        ? new Date(gen.createdAt).toLocaleString()
                        : ""}
                    </span>

                    <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-md">
                      {gen.tone}
                    </span>
                  </div>

                  {/* Prompt */}

                  {gen.prompt && (
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-xs text-slate-400 uppercase mb-1">
                        Prompt
                      </p>

                      <p className="text-sm text-slate-700 line-clamp-3">
                        {gen.prompt}
                      </p>
                    </div>
                  )}

                  {/* Generated content */}

                  <div className="flex-1">
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-6">
                      {gen.content}
                    </p>
                  </div>

                  {/* Image */}

                  {gen.mediaUrl && (
                    <img
                      src={gen.mediaUrl}
                      alt="Generated"
                      className="w-full aspect-video object-cover rounded-xl border border-slate-200"
                    />
                  )}

                  {/* Schedule */}

                  <button
                    type="button"
                    onClick={() => openScheduler(gen)}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
                  >
                    <CalendarDaysIcon className="size-4" />
                    Schedule Post
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SCHEDULER MODAL*/}

      {activeScheduler && (
        <div className="fixed inset-0 min-h-screen z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl border border-slate-100 overflow-hidden">
            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Schedule Post
                </h3>

                <p className="text-xs text-slate-500 mt-0.5">
                  Choose platforms, date and time
                </p>
              </div>

              <button
                type="button"
                onClick={closeScheduler}
                disabled={scheduling}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <XIcon className="size-5" />
              </button>
            </div>

            {/* =================================================
                MODAL BODY
            ================================================= */}

            <div className="max-h-[90vh] overflow-y-auto p-6 space-y-5">
              {/* Post preview */}

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {activeScheduler.prompt}
                </p>

                <div className="bg-white rounded-2xl p-5 border border-slate-100">
                  <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {activeScheduler.content}
                  </p>

                  {activeScheduler.mediaUrl && (
                    <img
                      src={activeScheduler.mediaUrl}
                      alt="preview"
                      className="w-full aspect-video object-cover rounded-xl border border-slate-200 shadow-sm mt-4"
                    />
                  )}
                </div>
              </div>

              {/* =================================================
                  PLATFORMS
              ================================================= */}

              <div>
                <label className="block text-xs text-slate-500 uppercase mb-2">
                  Platforms
                </label>

                <div className="flex flex-wrap gap-3">
                  {PLATFORMS.map((platform) => {
                    const active = selectedPlatforms.includes(platform.id);

                    return (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => togglePlatform(platform.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                          active
                            ? "border-red-300 bg-red-50 text-red-500"
                            : "border-slate-200 text-slate-500 hover:border-slate-300"
                        }`}
                      >
                        <platform.icon className="size-4" />

                        <span className="text-sm">
                          {platform.name || platform.id}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* =================================================
                  DATE + TIME
              ================================================= */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date */}

                <div>
                  <label className="block text-xs text-slate-500 uppercase mb-2">
                    Date
                  </label>

                  <div className="relative">
                    <CalendarDaysIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />

                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:border-slate-400"
                    />
                  </div>
                </div>

                {/* Time */}

                <div>
                  <label className="block text-xs text-slate-500 uppercase mb-2">
                    Time
                  </label>

                  <div className="relative">
                    <ClockIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />

                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:border-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* =================================================
                  SCHEDULE BUTTON
              ================================================= */}

              <button
                type="button"
                onClick={handleSchedule}
                disabled={scheduling}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-medium transition-colors"
              >
                {scheduling ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <CalendarDaysIcon className="size-4" />
                    Schedule Post
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIComposer;
