import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import {
  CheckCircle2Icon,
  ClockIcon,
  AlertCircleIcon,
  Share2Icon,
  RefreshCwIcon,
  ExternalLinkIcon,
  SearchIcon,
  LayoutGridIcon,
  ListIcon,
  LayersIcon,
  PlusIcon,
  CalendarDaysIcon,
  FilterIcon,
  ArrowUpDownIcon,
} from "lucide-react";
import { PLATFORMS } from "../assets/assets";

const API_BASE_URL = "http://localhost:3000/api";

// Retrieve authentication token from cookies or fallback storage
const getToken = () => {
  const cookieToken =
    Cookies.get("token") || Cookies.get("jwt") || Cookies.get("authToken");

  if (cookieToken) return cookieToken;

  const localToken =
    localStorage.getItem("token") || localStorage.getItem("jwt");

  if (localToken) return localToken;

  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
  if (match && match[1]) {
    return decodeURIComponent(match[1]);
  }

  return "";
};

const getAuthConfig = () => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    headers["token"] = token;
  }

  return {
    withCredentials: true,
    headers,
  };
};

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorNotice, setErrorNotice] = useState(null);

  // Different Options / Controls state
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'published' | 'scheduled' | 'failed'
  const [platformFilter, setPlatformFilter] = useState("all"); // 'all' | 'twitter' | 'linkedin' | 'facebook' | 'instagram'
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [sortOrder, setSortOrder] = useState("newest"); // 'newest' | 'oldest'
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPostIds, setExpandedPostIds] = useState(new Set());

  // Fetch real posts and accounts from APIs
  const fetchDashboardData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setErrorNotice(null);

    const token = getToken();
    if (!token) {
      setErrorNotice(
        "Authentication token not found. Please log in to view your dashboard.",
      );
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      // 1. Fetch live posts
      const postsPromise = axios.get(
        `${API_BASE_URL}/posts/publishedpost`,
        getAuthConfig(),
      );

      // 2. Fetch live connected accounts
      const accountsPromise = axios.get(
        `${API_BASE_URL}/oauth/sync`,
        getAuthConfig(),
      );

      const [postsRes, accountsRes] = await Promise.allSettled([
        postsPromise,
        accountsPromise,
      ]);

      if (
        postsRes.status === "fulfilled" &&
        Array.isArray(postsRes.value.data)
      ) {
        setPosts(postsRes.value.data);
      } else if (
        postsRes.status === "fulfilled" &&
        postsRes.value.data?.posts
      ) {
        setPosts(postsRes.value.data.posts);
      }

      if (
        accountsRes.status === "fulfilled" &&
        Array.isArray(accountsRes.value.data?.accounts)
      ) {
        setAccounts(accountsRes.value.data.accounts);
      } else if (
        accountsRes.status === "fulfilled" &&
        Array.isArray(accountsRes.value.data)
      ) {
        setAccounts(accountsRes.value.data);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setErrorNotice(
        "Failed to load dashboard data from server. Please verify your connection.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Calculate live statistics
  const stats = useMemo(() => {
    const published = posts.filter((p) => p.status === "published").length;
    const scheduled = posts.filter((p) => p.status === "scheduled").length;
    const failed = posts.filter((p) => p.status === "failed").length;

    return {
      total: posts.length,
      published,
      scheduled,
      failed,
      connectedAccounts: accounts.length,
    };
  }, [posts, accounts]);

  // Filter & Sort posts based on selected options
  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
        // Status filter
        if (statusFilter !== "all" && post.status !== statusFilter) {
          return false;
        }

        // Platform filter
        if (platformFilter !== "all") {
          const postPlatforms = (post.platforms || []).map((p) =>
            String(p).toLowerCase(),
          );
          if (!postPlatforms.includes(platformFilter.toLowerCase())) {
            return false;
          }
        }

        // Search query filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const contentMatch = (post.content || "")
            .toLowerCase()
            .includes(query);
          const platformMatch = (post.platforms || []).some((p) =>
            String(p).toLowerCase().includes(query),
          );
          if (!contentMatch && !platformMatch) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(
          a.scheduledFor || a.scheduledAt || a.createdAt || 0,
        ).getTime();
        const dateB = new Date(
          b.scheduledFor || b.scheduledAt || b.createdAt || 0,
        ).getTime();
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [posts, statusFilter, platformFilter, searchQuery, sortOrder]);

  const toggleExpandPost = (id) => {
    setExpandedPostIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getPlatformIcon = (platformId) => {
    const norm = String(platformId).toLowerCase();
    const found = PLATFORMS.find(
      (p) => p.id.toLowerCase() === norm || norm.includes(p.id.toLowerCase()),
    );
    return found ? found.icon : null;
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "published":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2Icon className="size-3" />
            Published
          </span>
        );
      case "scheduled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <ClockIcon className="size-3" />
            Scheduled
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            <AlertCircleIcon className="size-3" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {status || "Unknown"}
          </span>
        );
    }
  };

  return (
    <div className="space-y-7 pb-10">
      {/* 
          TOP HEADER & WELCOME
       */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Social Overview
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time feed and multi-platform analytics from your connected
            channels
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing || loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCwIcon
              className={`size-4 text-slate-500 ${
                refreshing ? "animate-spin text-red-500" : ""
              }`}
            />
            <span>Refresh</span>
          </button>

          <Link
            to="/schedule"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all shadow-xs"
          >
            <PlusIcon className="size-4" />
            <span>Compose Post</span>
          </Link>
        </div>
      </div>

      {/* Error Notice */}
      {errorNotice && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2.5">
            <AlertCircleIcon className="size-5 shrink-0 text-red-600" />
            <span>{errorNotice}</span>
          </div>
          <button
            onClick={() => fetchDashboardData(true)}
            className="underline font-medium hover:text-red-900 cursor-pointer ml-3"
          >
            Retry
          </button>
        </div>
      )}

      {/* 
          STATS CARDS (5 Multi-Platform Metrics)
       */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Posts */}
        <div
          onClick={() => setStatusFilter("all")}
          className={`cursor-pointer rounded-2xl border p-4.5 bg-white transition-all hover:shadow-sm ${
            statusFilter === "all"
              ? "border-slate-800 ring-2 ring-slate-800/10"
              : "border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Posts
            </span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <LayersIcon className="size-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
          <p className="text-xs text-slate-400 mt-1">Across all platforms</p>
        </div>

        {/* Published Posts */}
        <div
          onClick={() => setStatusFilter("published")}
          className={`cursor-pointer rounded-2xl border p-4.5 bg-white transition-all hover:shadow-sm ${
            statusFilter === "published"
              ? "border-emerald-500 ring-2 ring-emerald-500/10"
              : "border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Published
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2Icon className="size-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700">
            {stats.published}
          </div>
          <p className="text-xs text-emerald-600/70 mt-1">Live on socials</p>
        </div>

        {/* Scheduled Posts */}
        <div
          onClick={() => setStatusFilter("scheduled")}
          className={`cursor-pointer rounded-2xl border p-4.5 bg-white transition-all hover:shadow-sm ${
            statusFilter === "scheduled"
              ? "border-blue-500 ring-2 ring-blue-500/10"
              : "border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">
              Scheduled
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <ClockIcon className="size-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-700">
            {stats.scheduled}
          </div>
          <p className="text-xs text-blue-600/70 mt-1">In future queue</p>
        </div>

        {/* Failed Posts */}
        <div
          onClick={() => setStatusFilter("failed")}
          className={`cursor-pointer rounded-2xl border p-4.5 bg-white transition-all hover:shadow-sm ${
            statusFilter === "failed"
              ? "border-red-500 ring-2 ring-red-500/10"
              : "border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-red-700">
              Failed
            </span>
            <div className="p-2 rounded-xl bg-red-50 text-red-600">
              <AlertCircleIcon className="size-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-red-700">{stats.failed}</div>
          <p className="text-xs text-red-600/70 mt-1">Need attention</p>
        </div>

        {/* Connected Accounts */}
        <Link
          to="/accounts"
          className="rounded-2xl border border-slate-200 p-4.5 bg-white transition-all hover:shadow-sm hover:border-slate-300 col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-700">
              Accounts
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Share2Icon className="size-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-800">
            {stats.connectedAccounts}
          </div>
          <p className="text-xs text-purple-600/70 mt-1">Manage channels →</p>
        </Link>
      </div>

      {/* 
          INTERACTIVE OPTIONS & FILTERS BAR
       */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Status Options Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {[
              { id: "all", label: "All Posts", count: stats.total },
              { id: "published", label: "Published", count: stats.published },
              { id: "scheduled", label: "Scheduled", count: stats.scheduled },
              { id: "failed", label: "Failed", count: stats.failed },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === tab.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    statusFilter === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Right Controls: Platform filter, Sort, and View Mode Toggle */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-56">
              <SearchIcon className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-slate-300"
              />
            </div>

            {/* Platform Option Filter */}
            <div className="relative">
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                aria-label="Filter by platform"
                className="pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-slate-300 cursor-pointer appearance-none"
              >
                <option value="all">All Platforms</option>
                {PLATFORMS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <FilterIcon className="size-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Sort Order Option */}
            <button
              type="button"
              onClick={() =>
                setSortOrder((prev) =>
                  prev === "newest" ? "oldest" : "newest",
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title={`Sorting: ${sortOrder === "newest" ? "Newest First" : "Oldest First"}`}
            >
              <ArrowUpDownIcon className="size-3 text-slate-400" />
              <span className="hidden sm:inline capitalize">{sortOrder}</span>
            </button>

            {/* View Mode Toggle: Grid vs List */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Cards Grid View"
              >
                <LayoutGridIcon className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Table List View"
              >
                <ListIcon className="size-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Pill summary */}
        {(statusFilter !== "all" ||
          platformFilter !== "all" ||
          searchQuery) && (
          <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
            <span>Showing:</span>
            <span className="font-semibold text-slate-700">
              {filteredPosts.length} post{filteredPosts.length === 1 ? "" : "s"}
            </span>
            {(statusFilter !== "all" ||
              platformFilter !== "all" ||
              searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setStatusFilter("all");
                  setPlatformFilter("all");
                  setSearchQuery("");
                }}
                className="text-red-500 hover:underline cursor-pointer ml-1"
              >
                Reset filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* 
          POSTS FEED / CONTENT DISPLAY
       */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 flex flex-col items-center justify-center">
          <div className="size-9 border-3 border-red-500 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm font-medium text-slate-700">
            Loading posts from server...
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Fetching latest multi-platform updates
          </p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 flex flex-col items-center justify-center text-center">
          <div className="size-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
            <LayersIcon className="size-7" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">
            No posts found
          </h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm">
            {posts.length === 0
              ? "You haven't created or published any posts yet. Schedule your first post to see it here!"
              : "No posts match your selected filter criteria. Try choosing another status or platform."}
          </p>
          {posts.length === 0 ? (
            <Link
              to="/schedule"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-all"
            >
              <PlusIcon className="size-4" />
              Schedule Post Now
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                setStatusFilter("all");
                setPlatformFilter("all");
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        /* 
           OPTION 1: CARDS GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPosts.map((post) => {
            const postId = post._id || post.postId || Math.random().toString();
            const mediaItem = post.mediaItems?.[0];
            const mediaUrl = mediaItem?.url || post.mediaUrl;
            const isVideo =
              mediaItem?.type === "video" || post.mediaType === "video";
            const isExpanded = expandedPostIds.has(postId);
            const liveResult = (post.platformResults || []).find(
              (r) => r.platformPostUrl,
            );
            const dateValue =
              post.scheduledFor || post.scheduledAt || post.createdAt;

            return (
              <div
                key={postId}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Media Thumbnail Header if exists */}
                  {mediaUrl && (
                    <div className="relative w-full h-44 bg-slate-100 overflow-hidden border-b border-slate-100">
                      {isVideo ? (
                        <video
                          src={mediaUrl}
                          className="size-full object-cover"
                          controls
                        />
                      ) : (
                        <img
                          src={mediaUrl}
                          alt="Post media"
                          className="size-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                    </div>
                  )}

                  <div className="p-5">
                    {/* Top Row: Platforms & Status */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        {(post.platforms || []).map((plat) => {
                          const Icon = getPlatformIcon(plat);
                          return Icon ? (
                            <div
                              key={plat}
                              className="size-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700"
                              title={String(plat)}
                            >
                              <Icon className="size-3.5" />
                            </div>
                          ) : (
                            <span
                              key={plat}
                              className="text-[10px] font-semibold uppercase bg-slate-100 px-1.5 py-0.5 rounded text-slate-600"
                            >
                              {plat}
                            </span>
                          );
                        })}
                      </div>

                      {renderStatusBadge(post.status)}
                    </div>

                    {/* Post Content */}
                    <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                      {isExpanded ||
                      (post.content && post.content.length <= 140)
                        ? post.content
                        : `${(post.content || "").slice(0, 140)}...`}
                    </p>

                    {post.content && post.content.length > 140 && (
                      <button
                        type="button"
                        onClick={() => toggleExpandPost(postId)}
                        className="text-xs text-red-500 hover:text-red-600 font-medium mt-1 cursor-pointer"
                      >
                        {isExpanded ? "Show less" : "Read more"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Footer with Date & Live Links */}
                <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 text-slate-500 truncate">
                    <CalendarDaysIcon className="size-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">
                      {dateValue
                        ? new Date(dateValue).toLocaleString()
                        : "No date"}
                    </span>
                  </div>

                  {liveResult?.platformPostUrl ? (
                    <a
                      href={liveResult.platformPostUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 ml-2 shrink-0"
                    >
                      <span>Live</span>
                      <ExternalLinkIcon className="size-3" />
                    </a>
                  ) : post.status === "failed" ? (
                    <span className="text-[11px] text-red-500 font-medium ml-2 shrink-0">
                      Error details
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 
           OPTION 2: TABLE / LIST VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Platforms</th>
                  <th className="py-3 px-4 min-w-[280px]">Content</th>
                  <th className="py-3 px-4">Media</th>
                  <th className="py-3 px-4 whitespace-nowrap">
                    Schedule / Date
                  </th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredPosts.map((post) => {
                  const postId =
                    post._id || post.postId || Math.random().toString();
                  const mediaItem = post.mediaItems?.[0];
                  const mediaUrl = mediaItem?.url || post.mediaUrl;
                  const liveResult = (post.platformResults || []).find(
                    (r) => r.platformPostUrl,
                  );
                  const dateValue =
                    post.scheduledFor || post.scheduledAt || post.createdAt;

                  return (
                    <tr
                      key={postId}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Platforms */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          {(post.platforms || []).map((plat) => {
                            const Icon = getPlatformIcon(plat);
                            return Icon ? (
                              <div
                                key={plat}
                                className="size-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700"
                                title={String(plat)}
                              >
                                <Icon className="size-3.5" />
                              </div>
                            ) : (
                              <span
                                key={plat}
                                className="text-[10px] uppercase font-bold bg-slate-100 px-1 rounded text-slate-600"
                              >
                                {plat}
                              </span>
                            );
                          })}
                        </div>
                      </td>

                      {/* Content */}
                      <td className="py-3.5 px-4 font-normal text-slate-800 max-w-md">
                        <p className="line-clamp-2 leading-relaxed">
                          {post.content || (
                            <span className="italic text-slate-400">
                              No text content
                            </span>
                          )}
                        </p>
                      </td>

                      {/* Media */}
                      <td className="py-3.5 px-4">
                        {mediaUrl ? (
                          <div className="size-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                            <img
                              src={mediaUrl}
                              alt="media"
                              className="size-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {dateValue ? new Date(dateValue).toLocaleString() : "—"}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {renderStatusBadge(post.status)}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {liveResult?.platformPostUrl ? (
                          <a
                            href={liveResult.platformPostUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/70 rounded-lg transition-colors"
                          >
                            <span>View Live</span>
                            <ExternalLinkIcon className="size-3" />
                          </a>
                        ) : post.status === "failed" ? (
                          <span className="text-xs text-red-500">Failed</span>
                        ) : (
                          <Link
                            to="/schedule"
                            className="text-xs text-slate-500 hover:text-slate-900"
                          >
                            Edit
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
