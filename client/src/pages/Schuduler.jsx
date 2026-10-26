import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  AlertCircleIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  ClockIcon,
  ExternalLinkIcon,
  PlusIcon,
  RefreshCwIcon,
  SendIcon,
  XIcon,
} from "lucide-react";

import { PLATFORMS } from "../assets/assets";

const API_BASE_URL = "http://localhost:3000/api";

const getToken = () => {
  return (
    Cookies.get("token") ||
    Cookies.get("jwt") ||
    localStorage.getItem("token") ||
    ""
  );
};

const getAuthConfig = () => {
  const token = getToken();
  return {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}`, token } : {}),
    },
  };
};

const Schuduler = () => {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const [content, setContent] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);

  const [loading, setLoading] = useState(false);
  const [postingNow, setPostingNow] = useState(false);

  // Fetch real posts from backend API
  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/posts/publishedpost`,
        getAuthConfig(),
      );

      if (Array.isArray(response.data)) {
        setPosts(response.data);
      } else if (response.data && Array.isArray(response.data.posts)) {
        setPosts(response.data.posts);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    const interval = setInterval(() => {
      fetchPosts();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Filter posts into 3 categories: Upcoming (scheduled), Published, and Failed
  const scheduled = posts.filter(
    (post) => (post.status || "").toLowerCase() === "scheduled",
  );

  const published = posts.filter(
    (post) => (post.status || "").toLowerCase() === "published",
  );

  const failed = posts.filter(
    (post) => (post.status || "").toLowerCase() === "failed",
  );

  // Toggle platform

  const togglePlatform = (id) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id)
        ? prev.filter((platformId) => platformId !== id)
        : [...prev, id],
    );
  };

  // Handle file uploads (up to 10 photos/videos)
  const handleFileChange = (e) => {
    if (e.target.files) {
      const incoming = Array.from(e.target.files);
      setMediaFiles((prev) => {
        const combined = [...prev, ...incoming].slice(0, 10);
        return combined;
      });
    }
  };

  // Remove individual media file
  const removeMedia = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Post (handles both Publish Now and Schedule Post via POST /api/posts/composepost)
  const submitPost = async (publishNow = false) => {
    if (selectedPlatforms.length === 0) {
      alert("Please select at least one platform.");
      return;
    }

    if (!content.trim()) {
      alert("Please enter some content.");
      return;
    }

    let scheduledIso = null;
    if (!publishNow) {
      if (!scheduledDate || !scheduledTime) {
        alert("Please select both a date and time for scheduling.");
        return;
      }

      const dateObj = new Date(`${scheduledDate}T${scheduledTime}`);
      if (isNaN(dateObj.getTime())) {
        alert("Invalid date or time selected.");
        return;
      }
      scheduledIso = dateObj.toISOString();
    }

    if (publishNow) {
      setPostingNow(true);
    } else {
      setLoading(true);
    }

    try {
      const formData = new FormData();
      formData.append("content", content.trim());
      formData.append("platforms", JSON.stringify(selectedPlatforms));

      const timezone =
        Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";
      formData.append("timezone", timezone);

      if (publishNow) {
        formData.append("publishNow", "true");
        // No need to add scheduledFor when publishNow is true
      } else {
        formData.append("scheduledFor", scheduledIso);
        // No need to add publishNow when scheduledFor is added
      }

      // "media" is field name for up to 10 photos or videos
      mediaFiles.slice(0, 10).forEach((file) => {
        formData.append("media", file);
      });

      const token = getToken();
      const headers = token ? { Authorization: `Bearer ${token}`, token } : {};

      await axios.post(`${API_BASE_URL}/posts/composepost`, formData, {
        withCredentials: true,
        headers,
      });

      alert(
        publishNow
          ? "Post published successfully!"
          : "Post scheduled successfully!",
      );

      // Reset form
      setContent("");
      setScheduledDate("");
      setScheduledTime("");
      setSelectedPlatforms([]);
      setMediaFiles([]);

      // Auto-refresh posts list
      await fetchPosts();
    } catch (error) {
      console.error("Error submitting post:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.msg ||
        error.message ||
        "Failed to submit post.";
      alert(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
      setPostingNow(false);
    }
  };

  const handleSchedule = (e) => {
    e.preventDefault();
    submitPost(false);
  };

  const handlePostNow = (e) => {
    e.preventDefault();
    submitPost(true);
  };

  // Helper to render post cards in queue panels
  const renderPostCard = (post, queueType) => {
    const media = post.mediaItems?.[0];
    const liveResult = post.platformResults?.find((r) => r.platformPostUrl);
    const dateValue = post.scheduledFor || post.scheduledAt;

    return (
      <div
        key={post._id || post.postId}
        className="px-5 py-4 hover:bg-slate-50/80 transition-colors flex gap-3.5 items-start"
      >
        {/* Media Thumbnail */}
        {media?.url && (
          <div className="size-12 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
            {media.type === "video" ? (
              <video src={media.url} className="size-full object-cover" />
            ) : (
              <img
                src={media.url}
                alt="post media"
                className="size-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            {/* Platforms */}
            <div className="flex items-center gap-1.5">
              {post.platforms?.map((platformId) => {
                const meta = PLATFORMS.find(
                  (p) => p.id === platformId.toLowerCase(),
                );
                return meta ? (
                  <meta.icon
                    key={platformId}
                    className="size-3.5 text-slate-500"
                  />
                ) : null;
              })}
            </div>

            {/* Status & Info */}
            <div className="flex items-center gap-2">
              {liveResult?.platformPostUrl && (
                <a
                  href={liveResult.platformPostUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="View live post"
                  className="text-xs text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 font-medium hover:underline"
                >
                  View
                  <ExternalLinkIcon className="size-3" />
                </a>
              )}

              {queueType === "failed" && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                  Failed
                </span>
              )}

              <span className="text-xs text-slate-400">
                {dateValue
                  ? new Date(dateValue).toLocaleString([], {
                      dateStyle: "short",
                      timeStyle: "short",
                    })
                  : ""}
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed">
            {post.content}
          </p>
        </div>
      </div>
    );
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
            {/* 
                PLATFORMS
             */}

            <div>
              <label className="block text-xs text-slate-500 uppercase mb-2">
                Platforms
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PLATFORMS.map((p) => {
                  const active = selectedPlatforms.includes(p.id);

                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => togglePlatform(p.id)}
                      title={p.name}
                      className={`flex items-center justify-center gap-1.5 py-2.5 px-1.5 rounded-xl border text-xs transition-all duration-150 cursor-pointer ${
                        active
                          ? "bg-red-50 border-red-400 text-red-600 font-semibold shadow-xs scale-[1.02]"
                          : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <p.icon className="size-4 shrink-0" />
                      <span className="truncate">{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 
                CONTENT
             */}

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

            {/* 
                MEDIA UPLOAD (Up to 10 photos or videos)
             */}

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs text-slate-500 uppercase">
                  Media <span className="normal-case">(optional, max 10)</span>
                </label>
                {mediaFiles.length > 0 && (
                  <span className="text-xs text-slate-400">
                    {mediaFiles.length}/10 selected
                  </span>
                )}
              </div>

              {mediaFiles.length > 0 ? (
                <div className="space-y-3">
                  {/* Grid of uploaded thumbnails */}
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {mediaFiles.map((file, idx) => {
                      const isVideo = file.type.startsWith("video/");
                      const previewUrl = URL.createObjectURL(file);

                      return (
                        <div
                          key={idx}
                          className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-square"
                        >
                          {isVideo ? (
                            <video
                              src={previewUrl}
                              className="size-full object-cover"
                            />
                          ) : (
                            <img
                              src={previewUrl}
                              alt={file.name}
                              className="size-full object-cover"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => removeMedia(idx)}
                            title="Remove file"
                            className="absolute top-1 right-1 size-5 bg-slate-900/70 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <XIcon className="size-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add more button if less than 10 */}
                  {mediaFiles.length < 10 && (
                    <label
                      htmlFor="media-upload-more"
                      className="flex items-center justify-center gap-2 py-2.5 px-3 border border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-red-400 hover:bg-red-50/20 text-xs text-slate-600 hover:text-red-600 transition-all"
                    >
                      <PlusIcon className="size-3.5" />
                      <span>
                        Add more files ({10 - mediaFiles.length} remaining)
                      </span>
                      <input
                        id="media-upload-more"
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                </div>
              ) : (
                <label
                  htmlFor="media-upload"
                  className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-red-300 hover:bg-red-50/30 transition-all group"
                >
                  <span className="text-sm text-slate-500 group-hover:text-red-500">
                    Click to upload photos or videos (max 10)
                  </span>

                  <input
                    id="media-upload"
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>

            {/* 
                DATE & TIME (Side-by-Side)
             */}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 uppercase mb-2">
                  Date{" "}
                  <span className="text-[11px] text-slate-400 lowercase font-normal">
                    (optional)
                  </span>
                </label>

                <div className="relative">
                  <CalendarDaysIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />

                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm outline-none focus:border-slate-300 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 uppercase mb-2">
                  Time{" "}
                  <span className="text-[11px] text-slate-400 lowercase font-normal">
                    (optional)
                  </span>
                </label>

                <div className="relative">
                  <ClockIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />

                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm outline-none focus:border-slate-300 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 
                ACTIONS: POST NOW & SCHEDULE POST
             */}

            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Post Now Button */}
              <button
                type="button"
                onClick={handlePostNow}
                disabled={loading || postingNow}
                className="flex items-center justify-center gap-2 py-3 px-3 bg-red-500 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-all shadow-xs cursor-pointer"
              >
                {postingNow ? (
                  <>
                    <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <SendIcon className="size-4" />
                    Post Now
                  </>
                )}
              </button>

              {/* Schedule Post Button */}
              <button
                type="submit"
                disabled={loading || postingNow}
                className="flex items-center justify-center gap-2 py-3 px-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-all shadow-xs cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <ClockIcon className="size-4" />
                    Schedule Post
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* QUEUE PANELS */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        {/* Top Queue Bar with Refresh */}
        <div className="flex items-center justify-between pb-1">
          <h2 className="text-base font-bold text-slate-800">Post Activity</h2>
          <button
            type="button"
            onClick={fetchPosts}
            disabled={loadingPosts}
            title="Refresh posts"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-white rounded-full transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCwIcon
              className={`size-3.5 ${loadingPosts ? "animate-spin text-red-500" : ""}`}
            />
            <span>Refresh</span>
          </button>
        </div>

        {/* 
            1. UPCOMING (SCHEDULED) */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
            <CalendarDaysIcon className="size-4 text-blue-500" />
            <h3 className="text-sm font-semibold text-slate-900">Upcoming</h3>
            <span className="ml-auto text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full">
              {scheduled.length}
            </span>
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
            {scheduled.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-sm">
                No posts scheduled yet
              </div>
            ) : (
              scheduled.map((post) => renderPostCard(post, "scheduled"))
            )}
          </div>
        </div>

        {/* 
            2. PUBLISHED */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
            <CheckCircle2Icon className="size-4 text-emerald-500" />
            <h3 className="text-sm font-semibold text-slate-900">Published</h3>
            <span className="ml-auto text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              {published.length}
            </span>
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
            {published.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-sm">
                No published posts yet
              </div>
            ) : (
              published.map((post) => renderPostCard(post, "published"))
            )}
          </div>
        </div>

        {/* 
            3. FAILED (NEW) */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
            <AlertCircleIcon className="size-4 text-red-500" />
            <h3 className="text-sm font-semibold text-slate-900">Failed</h3>
            <span className="ml-auto text-xs font-semibold bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full">
              {failed.length}
            </span>
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
            {failed.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-sm">
                No failed posts
              </div>
            ) : (
              failed.map((post) => renderPostCard(post, "failed"))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schuduler;
