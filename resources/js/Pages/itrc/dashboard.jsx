import AuthLayout from "@/Layouts/auth-layout";
import QuantityCard from "@/Components/card/qntty-statistic-card";
import "../style.css";
import BarGraph from "@/Components/card/bar-graph-statistic-card";
import NewUserList from "@/Components/list/new-user-list";
import "../../Responsive/dashboard-responsive.css";
import PendingRequestList from "@/Components/list/pending-request-list";
import { toTitleCase } from "@/others/function";
import { Link } from "@inertiajs/react";
import LatestActiveAccountList from "@/Components/list/latest-active-user-list";
import { motion } from "framer-motion";

const ITRCDashboard = (props) => {
  const bar = props.bargraph;
  const userColor = [
    "#ff6384",
    "#ffce56",
    "#ff3e56",
    "#4bc0c0",
    "#9966ff",
    "#ff9f40",
    "#ff2384",
  ];
  const user = props.role;

  const barDataset = () => {
    const l = [];
    for (let a = 0; a < user.length; a++) {
      const c = Array(6).fill(userColor[a]);
      const r = [];
      bar.forEach((e) => r.push(e.count[a]));
      l.push({
        data: r,
        label: toTitleCase(user[a]),
        backgroundColor: c,
        hoverBackgroundColor: c,
      });
    }
    return l;
  };

  const month = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEPT",
    "OCT",
    "NOV",
    "DEC",
  ];

  const handleBarClick = (e) => {
    console.log(e);
  };

  return (
      <motion.div
        className="w-full py-6 sm:py-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="w-full flex flex-col gap-6 lg:gap-8">
          {/* === TOP SECTION === */}
          <div className="w-full grid gap-5">
            {/* Quantity Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-4">
              <Link href="/super-admin/user-accounts">
                <QuantityCard
                  h="h-[9rem]"
                  num={props.account_total}
                  icon="fa-users"
                  label="Total Registered Users"
                  color={{
                    bg: "bg-white hover:bg-black/5 transition-all",
                  }}
                />
              </Link>
              <Link href="/super-admin/program">
                <QuantityCard
                  h="h-[9rem]"
                  num={props.program}
                  icon="fa-user-graduate"
                  label="Total College Programs"
                  color={{
                    bg: "bg-white hover:bg-black/5 transition-all",
                  }}
                />
              </Link>
              <Link href="/super-admin/report">
                <QuantityCard
                  h="h-[9rem]"
                  num={props.report}
                  icon="fa-file"
                  label="Total Action Logs"
                  color={{
                    bg: "bg-white hover:bg-black/5 transition-all",
                  }}
                />
              </Link>
            </div>

            {/* Bar Graph (Optional / Commented) */}
            {/**
            <div className="w-full flex flex-col lg:flex-row gap-5">
              <div className="w-full">
                <BarGraph
                  dataset={barDataset()}
                  withBorder={true}
                  label={month}
                  onBarClick={handleBarClick}
                  title="Total Number of Users this Year"
                />
              </div>
              <div className="w-full lg:w-[20rem] flex-shrink-0">
                <PendingRequestList type="itrc" />
              </div>
            </div>
             */}
          </div>

          {/* === BOTTOM SECTION === */}
          <div className="w-full flex flex-col lg:flex-row gap-5">
            {/* New Users */}
            <div className="w-full">
              <NewUserList list={props.new_users} />
            </div>

            {/* Latest Active Accounts */}
            <div className="w-full">
              <LatestActiveAccountList list={props.active} />
            </div>
          </div>
        </div>
      </motion.div>
  );
};

ITRCDashboard.layout = (page) => <AuthLayout user={page.props.user}>{page}</AuthLayout>

export default ITRCDashboard;
