import { useEffect, useState } from "react";
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  XIcon,
} from "lucide-react";

import { dummyPostsData, PLATFORMS } from "../assets/assets";

const Schuduler = () => {
  const [posts, setPosts] = useState([]);

  const [content, setContent] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [mediaFile, setMediaFile] = useState(null);

  const [loading, setLoading] = useState(false);

  // Fetch posts

  const fetchPosts = async () => {
    // Later replace this with API call
    setPosts(dummyPostsData);
  };

  useEffect(() => {
    fetchPosts();

    const interval = setInterval(() => {
      fetchPosts();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Filter posts

  const scheduled = posts.filter((post) => post.status === "scheduled");

  const published = posts.filter((post) => post.status === "published");

  // Toggle platform

  const togglePlatform = (id) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id)
        ? prev.filter((platformId) => platformId !== id)
        : [...prev, id],
    );
  };

  // Remove media

  const removeMedia = () => {
    setMediaFile(null);
  };

  // Schedule post

  const handleSchedule = async (e) => {
    e.preventDefault();

    if (selectedPlatforms.length === 0) {
      alert("Please select at least one platform.");
      return;
    }

    if (!content.trim()) {
      alert("Please enter some content.");
      return;
    }

    if (!scheduledDate || !scheduledTime) {
      alert("Please select date and time.");
      return;
    }

    setLoading(true);

    try {
      // Later:
      // await axios.post("/api/posts/schedule", {...})

      const newPost = {
        _id: Date.now().toString(),
        content,
        platforms: selectedPlatforms,
        media: mediaFile ? URL.createObjectURL(mediaFile) : null,
        scheduledAt: `${scheduledDate}T${scheduledTime}`,
        status: "scheduled",
      };

      setTimeout(() => {
        setPosts((prev) => [newPost, ...prev]);

        // Reset form
        setContent("");
        setScheduledDate("");
        setScheduledTime("");
        setSelectedPlatforms([]);
        setMediaFile(null);

        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Schedule post error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* COMPOSE PANEL*/}

      <div className="w-full lg:w-[460px] shrink-0">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-lg font-semibold text-slate-700">
              Compose Post
            </h2>
          </div>

          <form onSubmit={handleSchedule} className="space-y-5">
            {/* =================================================
                PLATFORMS
            ================================================= */}

            <div>
              <label className="block text-xs text-slate-500 uppercase mb-2">
                Platforms
              </label>

              <div className="flex flex-wrap gap-3">
                {PLATFORMS.map((p) => {
                  const active = selectedPlatforms.includes(p.id);

                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => togglePlatform(p.id)}
                      className={`flex items-center gap-1.5 p-3 rounded-md border transition-all duration-150 ${
                        active
                          ? "bg-red-50 border-red-300 text-red-500 scale-105"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      <p.icon className="size-4.5" />

                      <span className="text-xs">{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* =================================================
                CONTENT
            ================================================= */}

            <div>
              <label className="block text-xs text-slate-500 uppercase mb-2">
                Content
              </label>

              <textarea
                required
                rows={5}
                placeholder="What do you want to share today?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={280}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm placeholder-slate-400 outline-none resize-none focus:border-slate-300"
              />

              <div
                className={`text-right text-xs mt-1 font-medium ${
                  content.length > 270 ? "text-red-500" : "text-slate-400"
                }`}
              >
                {content.length}/280
              </div>
            </div>

            {/* =================================================
                MEDIA UPLOAD
            ================================================= */}

            <div>
              <label className="block text-xs text-slate-500 uppercase mb-2">
                Media <span className="normal-case">(optional)</span>
              </label>

              {mediaFile ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  {mediaFile.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(mediaFile)}
                      alt="preview"
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(mediaFile)}
                      className="w-full h-40 object-cover"
                      controls
                    />
                  )}

                  <button
                    type="button"
                    onClick={removeMedia}
                    className="absolute top-2 right-2 size-7 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <XIcon className="size-3.5" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="media-upload"
                  className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-red-300 hover:bg-red-50/30 transition-all group"
                >
                  <span className="text-sm text-slate-500 group-hover:text-red-500">
                    Click to upload image or video
                  </span>

                  <input
                    id="media-upload"
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setMediaFile(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              )}
            </div>

            {/* =================================================
                DATE
            ================================================= */}

            <div>
              <label className="block text-xs text-slate-500 uppercase mb-2">
                Date
              </label>

              <div className="relative">
                <CalendarDaysIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />

                <input
                  type="date"
                  required
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm outline-none"
                />
              </div>
            </div>

            {/* =================================================
                TIME
            ================================================= */}

            <div>
              <label className="block text-xs text-slate-500 uppercase mb-2">
                Time
              </label>

              <div className="relative">
                <ClockIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />

                <input
                  type="time"
                  required
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm outline-none"
                />
              </div>
            </div>

            {/* =================================================
                SUBMIT
            ================================================= */}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors"
            >
              {loading ? (
                <>
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  Schedule Post
                  <ArrowRightIcon className="size-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* QUEUE PANELS*/}

      <div className="flex-1 flex flex-col gap-6 min-w-0">
        {/* =================================================
            UPCOMING
        ================================================= */}

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
            <CalendarDaysIcon className="size-4 text-zinc-500" />

            <h3 className="text-sm font-semibold text-slate-900">Upcoming</h3>

            <span className="ml-auto text-xs font-bold bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-full">
              {scheduled.length}
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
            {scheduled.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-sm">
                No posts scheduled yet
              </div>
            ) : (
              scheduled.map((post) => (
                <div
                  key={post._id}
                  className="px-5 py-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {post.platforms?.map((platformId) => {
                        const meta = PLATFORMS.find((p) => p.id === platformId);

                        return meta ? (
                          <meta.icon
                            key={platformId}
                            className="size-3.5 text-slate-400"
                          />
                        ) : null;
                      })}
                    </div>

                    <span className="text-xs text-slate-400">
                      {post.scheduledAt
                        ? new Date(post.scheduledAt).toLocaleString()
                        : ""}
                    </span>
                  </div>

                  <p className="text-sm text-slate-700 line-clamp-2">
                    {post.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* =================================================
            PUBLISHED
        ================================================= */}

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">Published</h3>

            <span className="ml-auto text-xs font-bold bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-full">
              {published.length}
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
            {published.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-sm">
                No published posts yet
              </div>
            ) : (
              published.map((post) => (
                <div
                  key={post._id}
                  className="px-5 py-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {post.platforms?.map((platformId) => {
                        const meta = PLATFORMS.find((p) => p.id === platformId);

                        return meta ? (
                          <meta.icon
                            key={platformId}
                            className="size-3.5 text-slate-400"
                          />
                        ) : null;
                      })}
                    </div>

                    <span className="text-xs text-slate-400">Published</span>
                  </div>

                  <p className="text-sm text-slate-700 line-clamp-2">
                    {post.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schuduler;
