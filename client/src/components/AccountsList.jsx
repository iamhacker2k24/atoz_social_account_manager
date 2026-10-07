import { CheckCircleIcon, PlusIcon, UnplugIcon } from "lucide-react";
import { PLATFORMS } from "../assets/assets";


interface AccountListProps {
  accounts: any[];
  onDisconnect: (accountId: string) => Promise<void>;
}

const Accounts = ({accounts,onDisconnect}) => {
  const handleDicnonnect =async(accountId)=>{
    const confirm = window.confirm("Are you want to disconnenct this accouts ?")
    if(!confirm)return ;
    await onDisconnect(accountId);

  }
  if (accounts.length===0){
    return (
      <div className="bg-white rounded-2xl border-dashed border-slate-200">
        <div className="">
          <PlusIcon className="size-6 text-slate-500 opacity-50" />
        </div>
        <p>No accounts connected </p>
        <p className="" >Connect your first social platfrom to start scgeduling and automating your content.  </p>
      </div>
    )
  }
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 " >

{
  accounts.map((account,index)=>{
    const meta = PLATFORMS.find((p)=>p.id===account.platfrom);
    if(!meta) return null ;
    return (
      <div key={index} className="group bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 hover:border-slate-300 tracking-all" >
<div className="">
  <meta.icon className="size-6 text-slate-500" />
  
</div>

      </div>
    )

})
}
  <div className="">
    <div className="">{account.handle}</div>
    <div className="">{meta.name}</div>
  </div>
  <div className="">
    {
      accounts.status==="connected"? (<>
      <CheckCircleIcon className="size-4  text-amber-500" />
      
<span className="text-xs text-emerald-600 " > Conneceted</span>
      </>):(<>
<AlertcircleIcon className="size-4  text-amber-500" />

</>)
    }
  </div>
<button>
  <UnplugIcon/>
</button>
  </div>;

};

export default Accounts;
