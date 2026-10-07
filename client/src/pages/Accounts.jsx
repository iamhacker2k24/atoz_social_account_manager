import { useState } from "react";
import { PLATFORMS } from "../assets/assets";
import { Plus, PlusIcon } from "lucide-react";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [connecting, setConnecting] = useState(null);
  const [showPlatfromPicker, sethowPlatfromPicker] = useState(false);
  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="">
        <div className="">
          <h2>Concetd Accounts </h2>
          <p>
            {accounts.length} of {PLATFORMS.length} platfrom connected{" "}
          </p>
        </div>
        <button
          onClick={() => {
            sethowPlatfromPicker(!showPlatfromPicker);
          }}
        >
          <PlusIcon /> Connect Account
        </button>
      </div>
      {/* platfrom picket modal  */}
      

      {/* Connected accountes list */}
    </div>
  );
};

export default Accounts;
