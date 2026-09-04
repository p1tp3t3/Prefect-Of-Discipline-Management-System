import { toTitleCase } from "@/others/function";
import ListSkeleton from "../reload/list-skeleton";
import { TriangleAlert, Skull, User, AlertCircle, CheckCircle2 } from "lucide-react";

const PossibleIncidentList = ({ list = null }) => {
    return  (
        <div className="w-full">
            <div className="w-full h-[23rem] overflow-hidden overflow-y-auto grid gap-4">
                {((list != null)
                ?
                (list.length != 0)
                ?
                list.map((e, i) => <div key={i}><StatusBar data={e} i={i + 1} /></div>)
                :
                <div className="w-full h-[20rem] grid place-items-center">
                    <div className="text-center text-gray-500 py-10">
                        <TriangleAlert size="2em" />
                        <h1 className="text-[1.2em]">No Possible Incident Found</h1>
                    </div>
                </div>
                :
                <div className="w-full grid place-items-center">
                    <ListSkeleton rows={4} />
                </div>
                )}
            </div>
        </div>
    )
}
const Row = ({ data }) => {
    const percentage = Math.round(data.probability * 100);
    const status = (percentage <= 50) ? 'bg-yellow-500' : 'bg-red-500';  

    return (
        <div className={`${status} w-full bg-gray-50/5 border-l-4 border-gray-500/20`}>
            <div className="px-[1.5rem] py-[0.5rem] flex gap-6 border-b border-t border-r items-center">
                <div className={`text-[1.3em] w-[3rem] h-[3rem] text-gray-300 bg-black/20 flex-shrink-0 rounded-full grid place-items-center`}>
                    <TriangleAlert />
                </div>
                <div className="w-full flex flex-col gap-1">
                    <div>
                        <h1 className="text-[0.8em] text-gray-100">
                            <span>
                                <b>{toTitleCase(data.violation)}</b>
                            </span>
                        </h1>
                    </div>
                    <div>
                         <div class="w-full bg-black/20 rounded-full overflow-hidden">
                            <div class={`text-[0.8em] grid place-items-center font-medium bg-black/20 text-white text-center p-0.5 py-[4px] leading-none rounded-full`} style={{ width: `${percentage}%`}}> {percentage}%</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const StatusBar = ({ data, i }) => {
    const percentage =  Math.round(data.probability * 100)
    const riskStatus = (t = 'color') => {
        const r = percentage
        
        if (t === 'color') {
            if (r >= 85) return 'bg-red-900';        // Critical Risk
            if (r >= 70) return 'bg-red-600';        // Very High Risk
            if (r >= 55) return 'bg-orange-600';     // High Risk
            if (r >= 40) return 'bg-yellow-500';     // Moderate Risk
            return 'bg-green-600';                   // Low Risk
        } if (t === 'hover') {
            if (r >= 85) return 'hover:bg-red-700';        // Critical Risk
            if (r >= 70) return 'hover:bg-red-700';        // Very High Risk
            if (r >= 55) return 'hover:bg-orange-700';     // High Risk
            if (r >= 40) return 'hover:bg-yellow-600';     // Moderate Risk
            return 'hover:bg-green-700';                   // Low Risk
        } if (t === 'level') {
            if (r >= 85) return 'Critical Risk';
            if (r >= 70) return 'Very High Risk';
            if (r >= 55) return 'High Risk';
            if (r >= 40) return 'Moderate Risk';
            return 'Low Risk';
        } if (t === 'icon') {
            if (r >= 85) return Skull;
            if (r >= 70) return User;
            if (r >= 55) return TriangleAlert;
            if (r >= 40) return AlertCircle;
            return CheckCircle2;
        }
    }

    return (
        <div className={`${riskStatus()} w-full bg-gray-50/5 border-l-4 border-gray-500/20`}>
            <div className="px-[1rem] py-[0.3rem] border-b border-t border-r grid gap-1">
                <div className="">
                    <h1 className="text-[0.9em] text-gray-100">
                        <span>
                            <b>{i}. {toTitleCase(data.violation)}</b>
                        </span>
                    </h1>
                </div>
                <div className="flex gap-4 items-center">
                    <div className={`text-[1em] w-[2rem] h-[2rem] text-gray-300 bg-black/20 flex-shrink-0 rounded-full grid place-items-center`}>
                        {(() => { const RiskIcon = riskStatus('icon'); return <RiskIcon size="1em" />; })()}
                    </div>
                    <div className="w-full flex flex-col gap-1">
                        <div>
                            <div class="w-full bg-black/20 rounded-full overflow-hidden">
                                <div class={`text-[0.8em] grid place-items-center font-medium bg-black/20 text-white text-center p-0.5 py-[4px] leading-none rounded-full`} style={{ width: `${percentage}%`}}>
                                    <span className="ml-2">{percentage}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PossibleIncidentList;