import { APIRequest } from "@/others/classes/api-req";
import { Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * Student-Friendly Behavioral Risk Card
 * Based on ML prediction from backend
 */

const IncidentRiskCard = ({ user_id }) => {
  const [data, setData] = useState(null);
  const [riskLevel, setRiskLevel] = useState("loading");
  const [repeatRiskChance, setRepeatRiskChance] = useState(0);

  useEffect(() => {
    const api = new APIRequest(
      `/api/student/incident/list/${user_id}`,
      "get",
      {},
      (res) => {
        setData(res);
        evaluateRisk(res);
      }
    );
    api.fetchData();
  }, [user_id]);

  const evaluateRisk = (res) => {
    if (!res || !res.risk_score) {
      setRiskLevel("none");
      setRepeatRiskChance(0);
      return;
    }

    const percent = Math.round(res.risk_score * 100);
    setRepeatRiskChance(percent);

    if (percent >= 85) setRiskLevel("critical");
    else if (percent >= 60) setRiskLevel("high");
    else if (percent >= 31) setRiskLevel("moderate");
    else setRiskLevel("low");
  };

  const getRiskColor = (percent) => {
    if (percent >= 85) return "bg-[#e12b2b] text-red-700";
    if (percent >= 60) return "bg-[#e67e22] text-orange-600";
    if (percent >= 31) return "bg-[#e6a800] text-yellow-600";
    return "bg-[#32a852] text-green-600";
  };

  const studentMessages = {
    low: {
      color: "bg-[#32a852]",
      icon: "fa-circle-check",
      title: "Great Job! Keep It Up",
      message:
        "Your behavior record looks good! Continue practicing positive actions and staying responsible.",
    },
    moderate: {
      color: "bg-[#e6a800]",
      icon: "fa-lightbulb",
      title: "Reminder to Stay Focused",
      message:
        "A few reminders were noted. Stay mindful of your actions and continue making responsible choices.",
    },
    high: {
      color: "bg-[#e67e22]",
      icon: "fa-warning",
      title: "Needs Improvement",
      message:
        "Several concerns were recorded. It's important to reflect and show consistent improvement.",
    },
    critical: {
      color: "bg-[#e12b2b]",
      icon: "fa-skull-crossbones",
      title: "Immediate Attention Needed",
      message:
        "Your behavior requires urgent attention. Please reach out to your Prefect or Guidance Office.",
    },
    none: {
      color: "bg-[#32a852]",
      icon: "fa-check-circle",
      title: "Excellent Behavior",
      message: "No behavioral concerns found. Keep up the great work!",
    },
    loading: {
      color: "bg-gray-400",
      icon: "fa-spinner fa-spin",
      title: "Loading...",
      message: "Fetching your behavior summary...",
    },
  };

  const risk = studentMessages[riskLevel];

  const RepeatRiskBar = ({ chance }) => (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-300">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-800 text-sm">
          Chance of Repeating Another Violation
        </h3>
        <span className={`text-sm font-bold ${getRiskColor(chance).split(" ")[1]}`}>
          {chance}% 
        </span>
      </div>

      <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div
          className={`absolute top-0 left-0 h-full rounded-full ${
            getRiskColor(chance).split(" ")[0]
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${chance}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        ></motion.div>
      </div>

      <p className="text-xs text-gray-600 mt-2">
        This is based on your past behavior. You can lower your risk by making 
        positive choices every day.
      </p>
    </div>
  );

 const StatsCard = ({ data }) => (
  <div className="mt-5 grid lg:grid-cols-2 gap-4 bg-white">

    {/* Total Incidents */}
    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border">
      <h3 className="text-2xl font-bold text-gray-900">
        {data?.total_incidents ?? 0}
      </h3>
      <p className="text-xs text-gray-600 mt-1 text-center">Total Incidents</p>
    </div>

    {/* Total Violations */}
    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border">
      <h3 className="text-2xl font-bold text-gray-900">
        {data?.total_violations ?? 0}
      </h3>
      <p className="text-xs text-gray-600 mt- text-center">Total Violations</p>
    </div>

    {/* Repeated Violations */}
    <div className="flex flex-col items-center p-4 bg-red-50 rounded-lg border border-red-200">
      <h3 className="text-2xl font-bold text-red-600">
        {data?.total_repeated_violations ?? 0}
      </h3>
      <p className="text-xs text-red-700 mt-1 text-center">Repeated Violations</p>
    </div>

    {/* Resolved Without Violations */}
    <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg border border-green-200">
      <h3 className="text-2xl font-bold text-green-600">
        {data?.total_no_violations ?? 0}
      </h3>
      <p className="text-xs text-green-700 mt-1 text-center">Resolved Without Violations</p>
    </div>

  </div>
);


  if (riskLevel === "loading") {
    return (
      <motion.div
        className="p-6 bg-white rounded-xl border border-gray-200 shadow-md h-full"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-300 rounded-2xl"></div>
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full h-full">
      <div
        className={`relative p-6 bg-white rounded-md border grid gap-3 h-full shadow-sm ${
          riskLevel === "critical"
            ? "border-red-400 shadow-red-100"
            : riskLevel === "high"
            ? "border-orange-400 shadow-orange-100"
            : riskLevel === "moderate"
            ? "border-yellow-400 shadow-yellow-100"
            : "border-gray-200"
        }`}
      >
        <div className="relative z-10">
          {/* Risk Icon & Title */}
          <div className="flex items-start gap-4 mb-4">
            <div
              className={`flex-shrink-0 w-14 h-14 flex items-center justify-center text-white text-2xl shadow-md ${risk.color} rounded-xl`}
            >
              <i className={`fa-solid ${risk.icon}`}></i>
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{risk.title}</h2>
              <p className="text-sm text-gray-600">{risk.message}</p>
            </div>
          </div>

          {/* Risk Bar */}
          {repeatRiskChance > 0 && <RepeatRiskBar chance={repeatRiskChance} />}

          {/* Stats (NEW) */}
          {data && <StatsCard data={data} />}

          {!data && riskLevel === "none" && (
            <p className="mt-4 text-center text-gray-500">
              Behavior data not found. Stay disciplined and responsible!
            </p>
          )}
          
        </div>
        <div className="flex justify-end">
          <Link href={`/student-risk/${user_id}`} className="text-sm hover:underline text-blue-500">
            See More Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IncidentRiskCard;
