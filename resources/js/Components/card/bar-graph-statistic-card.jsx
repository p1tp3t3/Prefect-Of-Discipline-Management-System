import { Bar, getElementAtEvent } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"
import { useRef } from "react"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const BarGraph = (props) => {
  const chartRef = useRef(null) // ref for the chart instance
  const labels = props.label

  const chartData = {
    labels: labels,
    datasets: props.dataset,
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: props.xTitle,
        },
      },
      y: {
        title: {
          display: true,
          text: props.yTitle,
        },
      },
    },
  }

  // Handle click event
  const handleClick = (event) => {
    const chart = chartRef.current
    if (!chart) return

    const element = getElementAtEvent(chart, event) // get clicked bar
    if (element.length > 0) {
      const { datasetIndex, index } = element[0]
      const dataset = chartData.datasets[datasetIndex]
      const label = chartData.labels[index]
      const value = dataset.data[index]

      // Call parent handler if provided
      if (props.onBarClick) {
        props.onBarClick({ label, value, dataset })
      } else {
        console.log("Clicked:", { label, value, dataset })
      }
    }
  }

  return (
    <div
      className={`${props.w} h-full px-4 py-3 bg-white ${props.bg} ${
        props.withBorder
          ? "border rounded-md shadow-md shadow-black/20 border-gray-300"
          : ""
      }`}
    >
      <div className="text-[1.1em] flex justify-between">
        <h1>
          <b>{props.title}</b>
        </h1>
        <div>{props.side}</div>
      </div>

      {/* Chart with click event */}
      <Bar
        ref={chartRef}
        data={chartData}
        options={chartOptions}
        onClick={handleClick}
        className="w-full h-full"
      />
    </div>
  )
}

export default BarGraph
