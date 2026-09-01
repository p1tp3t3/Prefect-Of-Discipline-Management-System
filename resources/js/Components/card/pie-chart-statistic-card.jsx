import { useState, useEffect, useRef } from "react"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"


ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({
  label = [],
  dataset = [],
  title = "Doughnut Chart",   
  w = "w-full",
  bg = "bg-white",
  withBorder = true,
  side
}) => {
  const labels = label


  const chartData = {
    labels: labels,
    datasets: dataset,
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    }
  }

  return (
    <div className={`${w} h-full px-4 py-3 ${bg} ${withBorder ? 'rounded-md shadow-md shadow-black/20' : ''} bg-white`}>
        <div className="flex justify-between items-center">
            <h1 className="text-[1em]"><b>{title}</b></h1>
            {side}
        </div>
        <Doughnut data={chartData} options={chartOptions} />  
    </div>
  );
}
export default DoughnutChart