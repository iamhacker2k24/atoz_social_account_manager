import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  CheckIcon,
  ClockIcon,
  CopyIcon,
  HistoryIcon,
  ImageIcon,
  InfoIcon,
  Loader2Icon,
  SparklesIcon,
  XIcon,
} from "lucide-react";

import { dummyGenerationData, PLATFORMS } from "../assets/assets";

const API_BASE_URL = "http://localhost:3000/api";

const getToken = () => {
  return (
    Cookies.get("token") ||
    Cookies.get("jwt") ||
    localStorage.getItem("token") ||
    ""
  );
};

const SAMPLE_PROMPT =
  "I am going to launch a mobile study app for students, built with React Native. Highlight how it can help students study more effectively.";

const AIComposer = () => {
  // AI COMPOSER STATE
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("Normal");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  // AI IMAGE COMING SOON STATE
  const [imageNotice, setImageNotice] = useState("");

  // RECENT GENERATIONS
  const [generations, setGenerations] = useState([]);

  // SCHEDULER STATE
  const [activeScheduler, setActiveScheduler] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [scheduling, setScheduling] = useState(false);

  // TONES
  const tones = [
    "Normal",
    "Professional",
    "Creative",
    "Funny",
    "Minimalist",
    "Excited",
  ];

  // FETCH GENERATIONS (dummy data + saved localStorage generations)
  const fetchGenerations = () => {
    try {
      const saved = localStorage.getItem("ai_composer_recent_generations");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setGenerations([...parsed, ...dummyGenerationData]);
          return;
        }
      }
    } catch (e) {
      console.error("Failed to load saved generations:", e);
    }
    setGenerations(dummyGenerationData);
  };

  useEffect(() => {
    fetchGenerations();
  }, []);

  // GENERATE AI POST via POST http://localhost:3000/api/posts/genAiposts
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        prompt: prompt.trim(),
        tone: tone.toLowerCase(),
      };

      const response = await axios.post(
        `${API_BASE_URL}/posts/genAiposts`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      const content =
        typeof data === "string" ? data : data?.content || "";
      const imagePrompt = data?.imagePrompt || "";

      if (!content) {
        throw new Error("No post content was returned by the AI server.");
      }

      const newGeneration = {
        _id: "gen_" + Date.now(),
        user: "current_user",
        prompt: prompt.trim(),
        content: content,
        imagePrompt: imagePrompt,
        mediaUrl: "",
        mediaType: "text",
        tone: tone,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Prepend to generations list
      setGenerations((prev) => {
        const updated = [newGeneration, ...prev];
        try {
          // Persist only non-dummy generations to localStorage
          const savedItems = updated.filter(
            (item) => !dummyGenerationData.some((d) => d._id === item._id)
          );
          localStorage.setItem(
            "ai_composer_recent_generations",
            JSON.stringify(savedItems)
          );
        } catch (storageErr) {
          console.error("Storage error:", storageErr);
        }
        return updated;
      });

      // Clear the prompt input
      setPrompt("");

      // Automatically open the preview / scheduler screen for this newly generated post
      openScheduler(newGeneration);
    } catch (err) {
      console.error("Generation error:", err);
      const errorMsg =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        err.message ||
        "Failed to generate post. Make sure the server at http://localhost:3000 is running.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // OPEN SCHEDULER / DETAIL SCREEN FOR ANY GENERATION
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
        : [...prev, platformId]
    );
  };

  // COPY TEXT HELPER
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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

    const dateObj = new Date(`${scheduledDate}T${scheduledTime}`);
    if (isNaN(dateObj.getTime())) {
      alert("Invalid date or time selected.");
      return;
    }

    setScheduling(true);

    try {
      const formData = new FormData();
      formData.append("content", activeScheduler.content);
      formData.append("platforms", JSON.stringify(selectedPlatforms));

      const timezone =
        Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";
      formData.append("timezone", timezone);
      formData.append("scheduledFor", dateObj.toISOString());

      const token = getToken();
      const headers = token ? { Authorization: `Bearer ${token}`, token } : {};

      await axios.post(`${API_BASE_URL}/posts/composepost`, formData, {
        withCredentials: true,
        headers,
      });

      alert("Post scheduled successfully!");
      closeScheduler();
    } catch (error) {
      console.error("Scheduling error:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.msg ||
        error.message ||
        "Could not connect to post scheduler endpoint.";
      alert(`Schedule status: ${errorMsg}`);
    } finally {
      setScheduling(false);
    }
  };

  // SHOW AI IMAGE COMING SOON TOAST
  const triggerImageComingSoon = () => {
    setImageNotice("AI Image generation is coming soon!");
    setTimeout(() => {
      setImageNotice("");
    }, 3500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* AI COMPOSER */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        {/* Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <SparklesIcon className="size-6 text-slate-900" />
              What should we create today?
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Turn your ideas into engaging social media content with AI.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setPrompt(SAMPLE_PROMPT)}
            className="self-start sm:self-auto text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 font-medium transition-colors"
          >
            Load Sample Prompt
          </button>
        </div>

        {/* PROMPT TEXTAREA */}
        <div className="relative group mt-6">
          <textarea
            className="w-full px-5 py-4 pb-16 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition resize-none h-44 text-sm leading-relaxed"
            placeholder="Share your idea... (e.g. I am going to launch a mobile study app for students, built with React Native. Highlight how it can help students study more effectively.)"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          {/* AI IMAGE BUTTON (Black & White style, with Coming Soon notice) */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            {imageNotice && (
              <div className="bg-black text-white text-xs px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 border border-slate-700 transition-all">
                <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>{imageNotice}</span>
              </div>
            )}

            <button
              type="button"
              onClick={triggerImageComingSoon}
              title="AI Image Generation (Coming Soon)"
              className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 px-3 py-1.5 rounded-lg transition-all text-xs font-medium shadow-xs cursor-pointer"
            >
              <ImageIcon className="size-3.5 text-slate-700" />
              <span>AI Image</span>
              <span className="bg-black text-white text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded">
                Coming Soon
              </span>
              {/* Black & White monochrome switch */}
              <div className="relative inline-flex h-4 w-7 shrink-0 rounded-full bg-slate-200">
                <span className="pointer-events-none size-3 rounded-full bg-slate-600 shadow-sm mt-0.5 ml-0.5" />
              </div>
            </button>
          </div>
        </div>

        {/* ERROR NOTICE */}
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 flex items-center gap-2">
            <InfoIcon className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* TONE + GENERATE */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-5 pt-2 border-t border-slate-100">
          {/* Tones */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mr-1">
              Tone:
            </span>

            {tones.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTone(item)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  tone.toLowerCase() === item.toLowerCase()
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
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
            className="w-full sm:w-auto bg-slate-900 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                <span>Generating with AI...</span>
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

      {/* RECENT GENERATIONS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between text-slate-600 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-800">
              <HistoryIcon className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Generations
              </h2>
              <p className="text-xs text-slate-400">
                Click any generation card to open the preview and scheduler
                screen
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
            {generations.length} total
          </span>
        </div>

        {/* GENERATION GRID */}
        {generations.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            No generations yet. Create your first post above!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {generations.map((gen) => (
              <div
                key={gen._id}
                onClick={() => openScheduler(gen)}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-800 hover:shadow-lg p-5 transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer"
              >
                <div className="space-y-4">
                  {/* Date + Tone */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">
                      {gen.createdAt
                        ? new Date(gen.createdAt).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "Recent"}
                    </span>

                    <span className="text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md capitalize">
                      {gen.tone || "Normal"}
                    </span>
                  </div>

                  {/* Prompt */}
                  {gen.prompt && (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Prompt
                      </p>
                      <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                        {gen.prompt}
                      </p>
                    </div>
                  )}

                  {/* Generated content */}
                  <div>
                    <p className="text-xs text-slate-700 leading-relaxed line-clamp-5 whitespace-pre-line">
                      {gen.content}
                    </p>
                  </div>

                  {/* Image Prompt (if available) */}
                  {gen.imagePrompt && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1">
                        <ImageIcon className="size-3" /> AI Image Idea
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-2 italic">
                        "{gen.imagePrompt}"
                      </p>
                    </div>
                  )}

                  {/* Image (if dummy or uploaded) */}
                  {gen.mediaUrl && (
                    <img
                      src={gen.mediaUrl}
                      alt="Generated media"
                      className="w-full aspect-video object-cover rounded-xl border border-slate-200"
                    />
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(gen.content, gen._id);
                    }}
                    className="p-2.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    title="Copy post content"
                  >
                    {copiedId === gen._id ? (
                      <CheckIcon className="size-4 text-emerald-600" />
                    ) : (
                      <CopyIcon className="size-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openScheduler(gen);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white rounded-lg py-2.5 text-xs font-semibold transition-colors"
                  >
                    <CalendarDaysIcon className="size-3.5" />
                    Schedule / View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SCHEDULER & PREVIEW MODAL (The requested screen for each item) */}
      {activeScheduler && (
        <div className="fixed inset-0 min-h-screen z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CalendarDaysIcon className="size-4 text-slate-800" />
                  Post Details & Scheduler
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review generated post, select platforms, and schedule
                </p>
              </div>

              <button
                type="button"
                onClick={closeScheduler}
                disabled={scheduling}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <XIcon className="size-5" />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="overflow-y-auto p-6 space-y-5 flex-1">
              {/* Post prompt & metadata */}
              {activeScheduler.prompt && (
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Prompt
                    </span>
                    <span className="text-[10px] font-semibold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded capitalize">
                      Tone: {activeScheduler.tone || "Normal"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {activeScheduler.prompt}
                  </p>
                </div>
              )}

              {/* Generated Content Box */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Generated Post Content
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        activeScheduler.content,
                        "modal_" + activeScheduler._id
                      )
                    }
                    className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    {copiedId === "modal_" + activeScheduler._id ? (
                      <>
                        <CheckIcon className="size-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <CopyIcon className="size-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto pr-1">
                  {activeScheduler.content}
                </div>

                {/* Image Prompt if available */}
                {activeScheduler.imagePrompt && (
                  <div className="mt-3 pt-3 border-t border-slate-100 bg-slate-50/50 p-2.5 rounded-lg text-xs text-slate-500">
                    <p className="font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <ImageIcon className="size-3" /> Suggested AI Image Prompt:
                    </p>
                    <p className="italic">"{activeScheduler.imagePrompt}"</p>
                  </div>
                )}

                {/* Media Image */}
                {activeScheduler.mediaUrl && (
                  <img
                    src={activeScheduler.mediaUrl}
                    alt="Preview"
                    className="w-full aspect-video object-cover rounded-xl border border-slate-200 shadow-xs mt-3"
                  />
                )}
              </div>

              {/* PLATFORMS */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Select Platforms
                </label>

                <div className="flex flex-wrap gap-2.5">
                  {PLATFORMS.map((platform) => {
                    const active = selectedPlatforms.includes(platform.id);

                    return (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => togglePlatform(platform.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                          active
                            ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <platform.icon className="size-3.5" />
                        <span>{platform.name || platform.id}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* DATE + TIME */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Schedule Date
                  </label>

                  <div className="relative">
                    <CalendarDaysIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-slate-900 focus:bg-white transition"
                    />
                  </div>
                </div>

                {/* Time */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Schedule Time
                  </label>

                  <div className="relative">
                    <ClockIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-slate-900 focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeScheduler}
                disabled={scheduling}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleSchedule}
                disabled={scheduling}
                className="flex items-center gap-2 bg-slate-900 hover:bg-black disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm"
              >
                {scheduling ? (
                  <>
                    <Loader2Icon className="size-3.5 animate-spin" />
                    <span>Scheduling...</span>
                  </>
                ) : (
                  <>
                    <CalendarDaysIcon className="size-3.5" />
                    <span>Schedule Post</span>
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
