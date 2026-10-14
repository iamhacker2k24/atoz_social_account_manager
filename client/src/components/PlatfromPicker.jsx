import { CheckCircleIcon, ExternalLinkIcon, XIcon } from "lucide-react";
import { PLATFORMS } from "../assets/assets";

const PlatfromPicker = ({ connectedIds = [], connecting, onClose, onConnect, accounts = [] }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              Choose a Platform
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Connect one or more accounts to manage your posts
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        {/* Platforms */}
        <div className="p-6 flex flex-col gap-2.5">
          {PLATFORMS.map((p) => {
            const count = accounts.filter(
              (a) => (a.platform || a.platfrom) === p.id
            ).length;
            const isConnected = count > 0 || connectedIds.includes(p.id);
            const isConnecting = connecting === p.id;

            return (
              <button
                key={p.id}
                onClick={() => !isConnecting && onConnect(p.id)}
                disabled={isConnecting}
                className="w-full flex items-center gap-4 p-3.5 rounded-xl border border-slate-200 hover:border-red-400 hover:bg-red-50/30 transition-all text-left cursor-pointer group disabled:cursor-not-allowed"
              >
                {/* Icon */}
                <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-white transition-colors">
                  <p.icon
                    className={`size-5 ${
                      isConnected ? "text-red-600" : "text-slate-600"
                    }`}
                  />
                </div>

                {/* Label */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-800">
                      {p.name}
                    </span>
                    {isConnected && (
                      <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {count > 1 ? `${count} connected` : "Connected"}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-500 truncate mt-0.5">
                    {isConnected
                      ? "Click to connect another account"
                      : p.description}
                  </div>
                </div>

                {/* Status / Action */}
                {isConnecting ? (
                  <div className="size-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin shrink-0" />
                ) : (
                  <ExternalLinkIcon className="size-4 text-slate-400 group-hover:text-red-500 shrink-0 transition-colors" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlatfromPicker;
