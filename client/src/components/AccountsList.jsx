import {
  AlertCircleIcon,
  CheckCircleIcon,
  Loader2Icon,
  PlusIcon,
  UnplugIcon,
} from "lucide-react";
import { PLATFORMS } from "../assets/assets";

const AccountsLists = ({
  accounts,
  onDisconnect,
  onConnectNew,
  deletingId,
}) => {
  const handleDisconnect = async (account) => {
    const handleName = account.handle
      ? account.handle.startsWith("@")
        ? account.handle
        : `@${account.handle}`
      : "this account";

    const confirmDisconnect = window.confirm(
      `Are you sure you want to disconnect ${handleName}?`,
    );

    if (!confirmDisconnect) return;

    await onDisconnect(account);
  };

  // No accounts connected
  if (accounts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center py-20 px-6 text-center shadow-xs">
        <div className="size-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4 shadow-xs">
          <PlusIcon className="size-7" />
        </div>

        <p className="text-slate-800 text-lg font-semibold">
          No accounts connected yet
        </p>

        <p className="text-sm text-slate-500 mt-1 max-w-sm">
          Connect your social platforms to start scheduling, automating, and publishing content seamlessly.
        </p>

        {onConnectNew && (
          <button
            onClick={onConnectNew}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium text-sm transition-all shadow-sm cursor-pointer"
          >
            <PlusIcon className="size-4" />
            Connect Your First Account
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {accounts.map((account, index) => {
        const platformId = (
          account.platform ||
          account.platfrom ||
          "instagram"
        ).toLowerCase();

        const meta = PLATFORMS.find((p) => p.id === platformId) || {
          id: platformId,
          name: platformId.charAt(0).toUpperCase() + platformId.slice(1),
          icon: () => null,
        };

        const Icon = meta.icon;
        const isConnected =
          account.status === "connected" || account.status === true;

        return (
          <div
            key={account._id || account.zernioAccountId || index}
            className="group bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 flex items-center gap-4 transition-all shadow-xs hover:shadow-sm"
          >
            {/* Avatar / Platform Icon */}
            <div className="relative size-12 rounded-xl flex items-center justify-center shrink-0 bg-slate-50 border border-slate-100 overflow-hidden">
              {account.avatarUrl && (
                <img
                  src={account.avatarUrl}
                  alt={account.handle || "Profile"}
                  className="size-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              {/* Fallback Icon */}
              <div
                className={`size-full flex items-center justify-center ${
                  account.avatarUrl ? "-z-10 absolute inset-0" : ""
                }`}
              >
                <Icon className="size-6 text-slate-600" />
              </div>

              {/* Small platform badge indicator if avatar is shown */}
              {account.avatarUrl && (
                <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow-xs border border-slate-100">
                  <Icon className="size-3 text-red-500" />
                </div>
              )}
            </div>

            {/* Account Info */}
            <div className="min-w-0 flex-1">
              <div className="text-slate-900 font-semibold truncate flex items-center gap-1.5">
                <span>{account.handle?.startsWith("@") ? account.handle : `@${account.handle || "account"}`}</span>
              </div>

              <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                <span>{meta.name}</span>
                {account.lastSyncedAt && (
                  <>
                    <span>•</span>
                    <span className="text-slate-400 truncate">
                      Synced {new Date(account.lastSyncedAt).toLocaleDateString()}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-1.5 shrink-0">
              {isConnected ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircleIcon className="size-3.5 text-emerald-600" />
                  Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                  <AlertCircleIcon className="size-3.5 text-amber-600" />
                  Disconnected
                </span>
              )}
            </div>

            {/* Disconnect */}
            {(() => {
              const isDeleting =
                deletingId &&
                (deletingId === account.zernioAccountId ||
                  deletingId === account._id);

              return (
                <button
                  onClick={() => handleDisconnect(account)}
                  disabled={Boolean(isDeleting)}
                  title="Disconnect account"
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <Loader2Icon className="size-4 animate-spin text-red-500" />
                  ) : (
                    <UnplugIcon className="size-4" />
                  )}
                </button>
              );
            })()}
          </div>
        );
      })}
    </div>
  );
};

export default AccountsLists;
