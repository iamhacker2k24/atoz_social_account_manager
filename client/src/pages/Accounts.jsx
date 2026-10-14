import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { PLATFORMS } from "../assets/assets";
import {
  PlusIcon,
  RefreshCwIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  Loader2Icon,
  XIcon,
} from "lucide-react";
import AccountsLists from "../components/AccountsList";
import PlatfromPicker from "../components/PlatfromPicker";

const API_BASE_URL = "http://localhost:3000/api";

// Retrieve authentication token from cookies (with fallback to localStorage and document.cookie)
const getToken = () => {
  const cookieToken =
    Cookies.get("token") ||
    Cookies.get("jwt") ||
    Cookies.get("authToken");

  if (cookieToken) return cookieToken;

  const localToken =
    localStorage.getItem("token") ||
    localStorage.getItem("jwt");

  if (localToken) return localToken;

  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
  if (match && match[1]) {
    return decodeURIComponent(match[1]);
  }

  return "";
};

// Generate axios request configuration with Bearer token authentication
const getAuthConfig = () => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    // Standard Bearer token authentication from login cookie
    headers["Authorization"] = `Bearer ${token}`;
    // Fallback header for backends checking req.headers.token
    headers["token"] = token;
  }

  return {
    withCredentials: true,
    headers,
  };
};

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [connecting, setConnecting] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showPlatformPicker, setShowPlatformPicker] = useState(false);
  const [notice, setNotice] = useState(null);

  const popupRef = useRef(null);
  const popupTimerRef = useRef(null);

  // Fetch / Sync accounts from backend API
  const fetchAccounts = useCallback(async (isSync = false) => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      setSyncing(false);
      setNotice({
        type: "error",
        message:
          "Authentication token not found in cookies. Please sign in to your account first.",
      });
      return;
    }

    if (isSync) {
      setSyncing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/oauth/sync`,
        getAuthConfig()
      );

      if (response.data && Array.isArray(response.data.accounts)) {
        const normalizedAccounts = response.data.accounts.map((acc) => ({
          ...acc,
          platform: (acc.platform || acc.platfrom || "instagram").toLowerCase(),
          platfrom: (acc.platfrom || acc.platform || "instagram").toLowerCase(),
          status:
            acc.status === true || acc.status === "connected"
              ? "connected"
              : "disconnected",
        }));

        setAccounts(normalizedAccounts);

        if (isSync) {
          setNotice({
            type: "success",
            message: `Accounts synced successfully! (${normalizedAccounts.length} connected)`,
          });
        }
      } else {
        setAccounts([]);
      }
    } catch (error) {
      console.error("Error fetching/syncing accounts:", error);
      const isAuthError = error.response?.status === 401;
      setNotice({
        type: "error",
        message: isAuthError
          ? "Unauthorized: Invalid or expired Bearer token. Please log in again."
          : error.response?.data?.message ||
            error.message ||
            "Failed to sync accounts from server.",
      });
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, []);

  // Auto-call /api/oauth/sync on page mount
  useEffect(() => {
    fetchAccounts(false);
  }, [fetchAccounts]);

  // Clean up popup watcher on unmount
  useEffect(() => {
    return () => {
      if (popupTimerRef.current) {
        clearInterval(popupTimerRef.current);
      }
    };
  }, []);

  // Auto-dismiss notice after 6 seconds
  useEffect(() => {
    if (notice?.type === "success" || notice?.type === "info") {
      const timer = setTimeout(() => {
        setNotice(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [notice]);

  // Connect account via OAuth popup (supports instagram, facebook, linkedin, twitter, etc.)
  const handleConnect = async (platformId) => {
    const platformConfig = PLATFORMS.find((p) => p.id === platformId);
    const platformName = platformConfig
      ? platformConfig.name
      : platformId.charAt(0).toUpperCase() + platformId.slice(1);

    const token = getToken();
    if (!token) {
      setNotice({
        type: "error",
        message: `Authentication token missing from cookies. Please sign in to connect your ${platformName} account.`,
      });
      return;
    }

    setConnecting(platformId);
    setShowPlatformPicker(false);
    setNotice({
      type: "info",
      message: `Requesting ${platformName} authorization link...`,
    });

    try {
      // Step 1: GET http://localhost:3000/api/oauth/${platformId} with Bearer token
      const res = await axios.get(
        `${API_BASE_URL}/oauth/${platformId}`,
        getAuthConfig()
      );

      const authUrl = res.data?.url;
      if (!authUrl) {
        throw new Error(`No authorization URL returned by server for ${platformName}.`);
      }

      // Step 2: Open centered popup window
      const width = 600;
      const height = 720;
      const left = Math.max(
        0,
        window.screenX + (window.outerWidth - width) / 2
      );
      const top = Math.max(
        0,
        window.screenY + (window.outerHeight - height) / 2
      );

      const popup = window.open(
        authUrl,
        `${platformId}OAuthPopup`,
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes,status=no,toolbar=no`
      );

      if (!popup || popup.closed || typeof popup.closed === "undefined") {
        setConnecting(null);
        setNotice({
          type: "error",
          message:
            "Popup was blocked by your browser! Please allow popups for this site and try again.",
        });
        return;
      }

      popupRef.current = popup;
      setNotice({
        type: "info",
        message: `${platformName} authorization window opened. Complete the login, and this page will automatically sync when closed.`,
      });

      // Step 3: Listen for postMessage or popup auto-close
      let syncExecuted = false;
      const handlePopupFinish = () => {
        if (syncExecuted) return;
        syncExecuted = true;

        if (popupTimerRef.current) {
          clearInterval(popupTimerRef.current);
          popupTimerRef.current = null;
        }
        window.removeEventListener("message", handleOAuthMessage);
        setConnecting(null);

        if (popupRef.current && !popupRef.current.closed) {
          try {
            popupRef.current.close();
          } catch {
            // ignore cross-origin error
          }
        }

        // Step 4: Auto-call http://localhost:3000/api/oauth/sync
        fetchAccounts(true);
      };

      const handleOAuthMessage = (event) => {
        try {
          if (
            event.data === "OAUTH_SUCCESS" ||
            event.data?.type === "OAUTH_SUCCESS" ||
            event.data?.success
          ) {
            handlePopupFinish();
          }
        } catch (err) {
          console.error("Message handler error:", err);
        }
      };

      window.addEventListener("message", handleOAuthMessage);

      if (popupTimerRef.current) {
        clearInterval(popupTimerRef.current);
      }

      // Poll every 800ms to detect auto-closure or manual closure
      popupTimerRef.current = setInterval(() => {
        if (!popupRef.current || popupRef.current.closed) {
          handlePopupFinish();
        }
      }, 800);
    } catch (err) {
      console.error(`Error opening ${platformName} OAuth:`, err);
      setConnecting(null);
      setNotice({
        type: "error",
        message:
          err.response?.data?.message ||
          err.message ||
          `Failed to initiate ${platformName} connection.`,
      });
    }
  };

  // Disconnect / Delete account
  const handleDisconnect = async (accountOrId) => {
    const zernioId =
      typeof accountOrId === "object"
        ? (accountOrId.zernioAccountId || accountOrId._id)
        : accountOrId;

    if (!zernioId) {
      setNotice({
        type: "error",
        message: "No account identifier found to delete.",
      });
      return;
    }

    setDeletingId(zernioId);
    setNotice({
      type: "info",
      message: "Deleting account...",
    });

    try {
      // DELETE request with Bearer auth: http://localhost:3000/api/accounts/:zernioAccountId
      const res = await axios.delete(
        `${API_BASE_URL}/accounts/${zernioId}`,
        getAuthConfig()
      );

      // Backend returns: { "msg": "Accout deleted sucessfully " }
      const successMsg = res.data?.msg || "Account deleted successfully.";
      setNotice({
        type: "success",
        message: successMsg,
      });

      // Automatically call /api/oauth/sync again
      await fetchAccounts(true);
    } catch (err) {
      console.error("Error deleting account:", err);
      const isAuthError = err.response?.status === 401;
      setNotice({
        type: "error",
        message: isAuthError
          ? "Unauthorized: Invalid or expired Bearer token. Please log in again."
          : err.response?.data?.msg ||
            err.response?.data?.message ||
            err.message ||
            "Failed to delete account.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Get connected platform IDs
  const connectedIds = accounts
    .filter((a) => a.status === "connected" || a.status === true)
    .map((account) => account.platform || account.platfrom);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Notice Banner */}
      {notice && (
        <div
          className={`flex items-start gap-3 p-4 rounded-xl border text-sm transition-all ${
            notice.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : notice.type === "error"
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-blue-50 border-blue-200 text-blue-800"
          }`}
        >
          {notice.type === "success" && (
            <CheckCircle2Icon className="size-5 text-emerald-600 shrink-0 mt-0.5" />
          )}
          {notice.type === "error" && (
            <AlertCircleIcon className="size-5 text-red-600 shrink-0 mt-0.5" />
          )}
          {notice.type === "info" && (
            <Loader2Icon className="size-5 text-blue-600 animate-spin shrink-0 mt-0.5" />
          )}

          <div className="flex-1 font-medium">{notice.message}</div>

          <button
            onClick={() => setNotice(null)}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <XIcon className="size-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Connected Accounts
          </h2>

          <p className="text-slate-500 text-sm mt-0.5">
            {accounts.length}{" "}
            {accounts.length === 1 ? "profile" : "profiles"} connected across{" "}
            {new Set(connectedIds).size} platforms
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Sync Button */}
          <button
            onClick={() => fetchAccounts(true)}
            disabled={syncing || loading}
            title="Sync all accounts now"
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-full font-medium text-sm transition-all shadow-xs cursor-pointer disabled:opacity-60"
          >
            <RefreshCwIcon
              className={`size-4 ${syncing ? "animate-spin text-red-500" : ""}`}
            />
            <span>{syncing ? "Syncing..." : "Sync"}</span>
          </button>

          {/* Connect Account Button */}
          <button
            onClick={() => setShowPlatformPicker(true)}
            disabled={connecting !== null}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium text-sm transition-all shadow-xs w-full sm:w-auto justify-center cursor-pointer disabled:opacity-60"
          >
            {connecting ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <PlusIcon className="size-4" />
                Connect Account
              </>
            )}
          </button>
        </div>
      </div>

      {/* Platform Picker Modal */}
      {showPlatformPicker && (
        <PlatfromPicker
          connectedIds={connectedIds}
          connecting={connecting}
          accounts={accounts}
          onConnect={handleConnect}
          onClose={() => setShowPlatformPicker(false)}
        />
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 animate-pulse"
            >
              <div className="size-12 bg-slate-200 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded-md w-28" />
                <div className="h-3 bg-slate-100 rounded-md w-20" />
              </div>
              <div className="h-6 bg-slate-100 rounded-full w-16" />
            </div>
          ))}
        </div>
      ) : (
        /* Connected Accounts Grid / Empty State */
        <AccountsLists
          accounts={accounts}
          onDisconnect={handleDisconnect}
          deletingId={deletingId}
          onConnectNew={() => setShowPlatformPicker(true)}
        />
      )}
    </div>
  );
};

export default Accounts;
