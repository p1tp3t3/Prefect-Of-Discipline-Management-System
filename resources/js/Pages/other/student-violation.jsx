import TabSwitcher from "@/Components/other/tab-switcher";
import ProfilePic from "@/Components/other/profile-pic";
import CircleReload from "@/Components/reload/circle-reload";
import AuthLayout from "@/Layouts/auth-layout";
import { RiskPredictionService } from "@/others/services/risk-prediction-service";
import { getProfilePic, readableDate, readableTime } from "@/others/function";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { ShieldHalf, Clock } from "lucide-react";

/* ===============================
   MAIN COMPONENT
================================ */
const StudentViolation = (props, { user = demoProps.user, student = demoProps.student, violations = demoProps.violations}) => {
  const [option, setOption] = useState('recent_violations')

  const optionList = [
    { key: 'recent_violations', label: 'Recent Violations' },
    { key: 'analysis', label: 'Behavioural Analysis' },
  ]

  return (
        <div className="w-full py-4">
            <div className="w-full grid gap-5 relative">
                {/* Header */}
                <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-3">
                    <h1 className="text-[1.3em] sm:text-[1.5em] font-bold">STUDENT VIOLATION</h1>
                </div>
                <div className="flex gap-5">
                    <div>
                        <ProfilePic
                            src={getProfilePic(props.student.profile_picture, props.student.sex)}
                            size={5}
                        />
                    </div>
                    <div>
                        <div className="text-[1.2em]">
                            <b>{props.student.first_name} {props.student.middle_name} {props.student.last_name}</b>
                        </div>
                        <div className="text-[0.9em]">
                            <div>
                                {props.student.program.description}
                            </div>
                            <div>
                                School Year {props.student.student.school_year}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-2">
                    <TabSwitcher tabs={optionList} value={option} onChange={setOption} />
                    <div className="mt-6">
                        {option === "recent_violations" ? (
                            <RecentViolation violations={props.student_violations} />
                        ) : (
                            <BehaviourAnalysis
                                studentId={props.student.id}
                                violation_list={props.violations}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
  );
}

StudentViolation.layout = (page) => <AuthLayout user={page.props.user}>{page}</AuthLayout>

/* ===============================
   RECENT VIOLATIONS TABLE
================================ */
const RecentViolation = ({ violations }) => {
  const columns = [
    {
      field: "id",
      headerName: "#",
      width: 70,
    },
    {
      field: "violation_name",
      headerName: "Violation",
      flex: 1,
    },
    {
      field: "offense_status",
      headerName: "Status",
      flex: 1,
    },
    {
      field: "issued_at",
      headerName: "Date Time Issued",
      flex: 1.5,
    },
  ];

  const rows = violations.map((v, i) => ({
    id: i + 1,
    violation_name: v.violation?.violation_name,
    offense_status: v.violation?.offense_status,
    issued_at: `${readableDate(v.complaint?.offense_issued_at)} (${readableTime(
      v.complaint?.offense_issued_at
    )})`,
  }));

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5, page: 0 },
          },
        }}
        disableRowSelectionOnClick
        showToolbar
      />
    </Box>
  );
};

// BehaviourAnalysis.jsx
// Assumes React + Tailwind + FontAwesome CDN are already included globally.
// Uses <i></i> for icons (no imports).

const BehaviourAnalysis = ({ studentId, violation_list }) => {
  // -----------------------------
  // State
  // -----------------------------
  const [selected, setSelected] = useState("");
  const [violation, setViolation] = useState('')
  const [factors, setFactors] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [data, setData] = useState(null)


  useEffect(() => {
    if (!selected && violation_list.length) {
      setSelected(violation_list[0].id)
      setViolation(violation_list[0].violation_name)
    };
  }, [selected]);

  useEffect(() => {
    if(selected != '') {
      setData(null)
      RiskPredictionService.getViolationRiskPrediction(selected, studentId, setData)
      setViolation(violation_list.filter((e, _) => e.id == selected)[0].violation_name)
    }
  }, [selected]);

  const riskUI = data?.binary
    ? {
        title: "Likely to Commit",
        border: "border-red-200",
        bg: "bg-red-50",
        titleColor: "text-red-600",
        dot: "bg-red-500",
        iconColor: "text-red-600",
        ring: "ring-red-200",
      }
    : {
        title: "Unlikely to Commit",
        border: "border-green-200",
        bg: "bg-green-50",
        titleColor: "text-green-600",
        dot: "bg-green-500",
        iconColor: "text-green-600",
        ring: "ring-green-200",
      };


  return (
    <div className="grid gap-6">
      {/* Recidivism Prediction */}
        <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="min-w-[190px] border rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
            {violation_list.map((t, i) => (
            <option key={i} value={t.id}>
                {t.violation_name}
            </option>
            ))}
        </select>
        {data == null 
        ?
        <CircleReload size={5} />
        :
        <>
        <div className={`border rounded-xl p-6 ${riskUI.bg} ${riskUI.border}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`h-16 w-16 rounded-full bg-white flex items-center justify-center ring-4 ${riskUI.ring}`}>
                <ShieldHalf size={24} className={riskUI.iconColor} />
              </div>

              <div className="space-y-1">
                <div className={`text-xl font-extrabold ${riskUI.titleColor}`}>{data.prediction}</div>
                <div className="text-sm text-slate-600">
                  Prediction for repeating{" "}
                  <span className="font-semibold">"{violation}"</span> based on behavioral analysis.
                </div>

                <div className="pt-3">
                  <div className="text-xs font-semibold tracking-wide text-slate-600">
                    CONTRIBUTING FACTORS
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    {data.insights.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${riskUI.dot}`}></span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-3">
                  <div className="text-xs font-semibold tracking-wide text-slate-600">
                    RECOMMENDATIONS
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    {data.recommendations.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${riskUI.dot}`}></span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Violation Timeline */}
      <div className="border rounded-xl p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
              <Clock className="text-slate-700" />
            </div>
            <div className="font-semibold text-slate-800">Violation Timeline</div>
          </div>

          <div className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700 border">
            {data.violation_timeline.length} records
          </div>
        </div>

        <div className="mt-6">
          <div className="relative pl-6">
            <div className="absolute left-[11px] top-0 bottom-0 w-px bg-slate-200"></div>

            <div className="space-y-6">
              {data.violation_timeline.map((v) => {

                return (
                  <div key={v.id} className="relative">
                    <div className={`absolute -left-[1.2rem] top-1 h-3 w-3 rounded-full bg-gray-800`}></div>

                    <div className="space-y-1">
                      <div className="grid gap-3">
                        <div className="text-sm text-slate-500">
                          {readableDate(v.complaint.offense_issued_at)} ({readableTime(v.complaint.offense_issued_at)})
                        </div>
                        <div className="text-sm text-slate-500 font-bold">
                          From Case No. {v.complaint.case_number}
                        </div>
                      </div>

                      {(v.complaint.incident_summary || v.complaint.complaint_subject?.[0]?.incident_summary) && (
                        <div className="text-sm text-slate-500">
                          {v.complaint.incident_summary || v.complaint.complaint_subject[0].incident_summary}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
        </>}
    </div>
  );
};



export default StudentViolation;

/* ===============================
   20 DEMO DATA
================================ */

export const demoProps = {
  user: { name: "Guidance Officer" },
  student: {
    id: "STU-001",
    full_name: "Juan Dela Cruz",
    grade_level: "Grade 11",
    section: "STEM-A",
  },
  violations: [
    { id: 1, violation_text: "Smoking", created_at: "2026-02-01", status: "open", reported_by: "Guard", notes: "Caught near gate" },
    { id: 2, violation_text: "Smoking", created_at: "2026-01-15", status: "resolved", reported_by: "Guard", notes: "Warning issued" },
    { id: 3, violation_text: "Cheating", created_at: "2026-01-10", status: "open", reported_by: "Teacher A", notes: "Copied answers" },
    { id: 4, violation_text: "Cheating", created_at: "2025-12-10", status: "resolved", reported_by: "Teacher B", notes: "First offense" },
    { id: 5, violation_text: "Stealing", created_at: "2025-11-05", status: "open", reported_by: "Student", notes: "Missing calculator" },
    { id: 6, violation_text: "Littering", created_at: "2025-10-01", status: "resolved", reported_by: "Staff", notes: "Trash in hallway" },
    { id: 7, violation_text: "Bullying", created_at: "2025-09-10", status: "open", reported_by: "Guidance", notes: "Cyber bullying" },
    { id: 8, violation_text: "Bullying", created_at: "2025-08-20", status: "resolved", reported_by: "Teacher", notes: "Warning given" },
    { id: 9, violation_text: "Vandalism", created_at: "2025-07-15", status: "resolved", reported_by: "Staff", notes: "Desk scratched" },
    { id: 10, violation_text: "Tardiness", created_at: "2025-06-01", status: "resolved", reported_by: "Teacher", notes: "Late 3 times" },
    { id: 11, violation_text: "Smoking", created_at: "2025-05-01", status: "resolved", reported_by: "Guard", notes: "Second offense" },
    { id: 12, violation_text: "Cheating", created_at: "2025-04-15", status: "resolved", reported_by: "Teacher", notes: "Plagiarism" },
    { id: 13, violation_text: "Stealing", created_at: "2025-03-12", status: "resolved", reported_by: "Student", notes: "Returned item" },
    { id: 14, violation_text: "Bullying", created_at: "2025-02-10", status: "resolved", reported_by: "Guidance", notes: "Counseling done" },
    { id: 15, violation_text: "Vandalism", created_at: "2025-01-05", status: "resolved", reported_by: "Staff", notes: "Graffiti" },
    { id: 16, violation_text: "Tardiness", created_at: "2024-12-01", status: "resolved", reported_by: "Teacher", notes: "Late again" },
    { id: 17, violation_text: "Smoking", created_at: "2024-11-01", status: "resolved", reported_by: "Guard", notes: "Confiscated lighter" },
    { id: 18, violation_text: "Bullying", created_at: "2024-10-01", status: "resolved", reported_by: "Teacher", notes: "Verbal abuse" },
    { id: 19, violation_text: "Cheating", created_at: "2024-09-01", status: "resolved", reported_by: "Teacher", notes: "Copied homework" },
    { id: 20, violation_text: "Stealing", created_at: "2024-08-01", status: "resolved", reported_by: "Student", notes: "Lost notebook" },
  ],
};
