import React, { useRef, useState } from "react"
import { Bar, Pie, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js"
import Btn from "@/Components/button/normal-btn"
import LineGraph from "@/Components/card/line-graph-statistic"
import BarGraph from "@/Components/card/bar-graph-statistic-card"
import ProfilePic from "@/Components/other/profile-pic"
import { change, getProfilePic, showUserType } from "@/others/function"
import { router } from "@inertiajs/react"

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

const AnalyticalReport = (props) => {
  const reportRef = useRef()
  const [data, setData] = useState({
    date_from: "",
    date_to: "",
  })

  const monthNames = [
    "JAN", "FEB", "MAR", "APR", "MAY",
    "JUN", "JUL", "AUG", "SEPT", "OCT",
    "NOV", "DEC",
  ]

  return (
    <div className="w-full">
      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-3 mb-6">
        <div className="grid gap-3 w-full">
          <div className="flex flex-wrap gap-3 items-center text-[1em]">
            <input
              type="date"
              name="date_from"
              value={data.date_from}
              onChange={(e) => change(e, setData)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            />
            <span className="text-gray-700">To</span>
            <input
              type="date"
              name="date_to"
              value={data.date_to}
              onChange={(e) => change(e, setData)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>
          <Btn
            onclick={() => {
              const query = new URLSearchParams(data).toString()
              const downloadUrl = `/prefect/analytic-report/generate?${query}`
              window.open(downloadUrl, "_blank")
            }}
          >
            Export as PDF
          </Btn>
        </div>
      </div>

      {/* Report Body */}
      <div className="w-full mx-auto p-4 sm:p-6 bg-white shadow-black/20 shadow-sm rounded-md">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h2 className="text-lg sm:text-xl font-semibold text-blue-800">Total Incidents</h2>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">
              {props.quantity[0]}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h2 className="text-lg sm:text-xl font-semibold text-yellow-800">Total Violations</h2>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-600">
              {props.quantity[2]}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h2 className="text-lg sm:text-xl font-semibold text-green-800">Resolved Complaints</h2>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">
              {props.quantity[1]}
            </p>
          </div>
        </div>

        {/* Violations per Program */}
        <div className="mb-8">
          <h2 className="text-[1.1em] mb-4 font-bold">Violations Per Program</h2>

          <div className="w-full overflow-x-auto">
            <table className="w-full bg-white text-sm">
              <thead>
                <tr className="bg-gray-100 text-[0.8em] sm:text-[1em]">
                  <th className="py-2 px-4 border-b text-left">#</th>
                  <th className="py-2 px-4 border-b text-left">Program</th>
                  <th className="py-2 px-4 border-b text-left">Students With Violations</th>
                  <th className="py-2 px-4 border-b text-left">Total Violations</th>
                </tr>
              </thead>

              <tbody>
                {props.violationProgram.map((e, i) => (
                  <tr key={i} className="text-[0.9em]">
                    <td className="py-2 px-4 border-b">{i + 1}.</td>
                    <td className="py-2 px-4 border-b">{e.program}</td>
                    <td className="py-2 px-4 border-b">{e.students_with_violations}</td>
                    <td className="py-2 px-4 border-b">{e.total_violations}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


        {/* Top Violators */}
<div className="mb-8">
  <h2 className="text-[1.2em] mb-4 font-bold text-blue-700 flex items-center gap-2">
    <i className="fa-solid fa-user-xmark text-blue-600"></i>
    Top 5 Violators
  </h2>

  <div className="space-y-3">
    {props.top5Student.map((violator, index) => (
      <div
        key={index}
        className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border border-gray-300 bg-white shadow-sm hover:shadow-md transition-shadow px-4 py-3 rounded-lg"
        onClick={() => router.visit(`/student-violation/${violator.user.id}`)}
      >
        {/* Left Side (Rank + Profile) */}
        <div className="flex items-center gap-3">
          <span className="font-bold text-blue-700 text-[1em] w-6 text-center">
            {index + 1}.
          </span>

          <ProfilePic
            size={2.3}
            src={getProfilePic(
              violator.user.profile_picture,
              violator.user.sex
            )}
          />

          <div>
            <h1 className="text-[0.9em] font-semibold text-gray-900 leading-tight">
              {`${violator.user.first_name} ${
                violator.user.middle_name ? violator.user.middle_name + " " : ""
              }${violator.user.last_name}`}
            </h1>

            <p className="text-[0.75em] text-gray-500">
              {showUserType(violator.user)}
            </p>

            <p className="text-[0.75em] text-gray-500">
              {violator.user.program?.name}
            </p>
          </div>
        </div>

        {/* Violation Count */}
        <span className="text-[0.9em] font-semibold text-red-600 bg-red-100 px-3 py-1 rounded-full self-start sm:self-auto">
          {violator.total_offenses} Violations
        </span>
      </div>
    ))}
  </div>
</div>

      </div>
    </div>
  )
}

export default AnalyticalReport
