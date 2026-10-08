import { useEffect, useState } from "react";
import { dummyAccountsData, PLATFORMS } from "../assets/assets";
import { PlusIcon } from "lucide-react";
import AccountsLists from "../components/AccountsList";
import PlatfromPicker from "../components/PlatfromPicker";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [connecting, setConnecting] = useState(null);
  const [showPlatformPicker, setShowPlatformPicker] = useState(false);

  // Fetch accounts
  const fetchAccounts = async (
    isSync = false,
    platform = null,
    successMsg = "",
  ) => {
    setAccounts(dummyAccountsData);

    console.log(isSync, platform, successMsg);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Connect account
  const handleConnect = async (platformId) => {
    setConnecting(platformId);

    setTimeout(() => {
      setConnecting(null);

      setAccounts((prev) => [...prev, dummyAccountsData[0]]);

      setShowPlatformPicker(false);
    }, 1000);
  };

  // Disconnect account
  const handleDisconnect = async (accountId) => {
    setAccounts((prev) => prev.filter((account) => account._id !== accountId));
  };

  // Get connected platform IDs
  const connectedIds = accounts.map((account) => account.platform);

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Connected Accounts
          </h2>

          <p className="text-slate-500 text-sm mt-0.5">
            {accounts.length} of {PLATFORMS.length} platforms connected
          </p>
        </div>

        <button
          onClick={() => {
            setShowPlatformPicker(!showPlatformPicker);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-all w-full sm:w-auto justify-center"
        >
          <PlusIcon className="size-4" />
          Connect Account
        </button>
      </div>

      {/* Platform Picker */}
      {showPlatformPicker && (
        <PlatfromPicker
          connectedIds={connectedIds}
          connecting={connecting}
          onConnect={handleConnect}
          onClose={() => {
            setShowPlatformPicker(false);
          }}
        />
      )}

      {/* Connected Accounts */}
      <AccountsLists accounts={accounts} onDisconnect={handleDisconnect} />
    </div>
  );
};

export default Accounts;
