import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip } from 'chart.js';

Chart.register(ArcElement, Tooltip);

const GaugeChart = ({ value, title, label, colorScheme }) => {
  const maxValue = 100;

  const data = {
    datasets: [
      {
        data: [value, maxValue - value],
        backgroundColor: colorScheme,
        borderWidth: 0,
        cutout: '80%',
        circumference: 180,
        rotation: 270,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: { enabled: false },
    },
  };

  return (
    <div className='w-full h-full relative'>
        <div className='text-[1.1em] text-center'>
            <h1><b>{title}</b></h1>
        </div>
        <div className='mt-[-3rem] flex justify-center'>
            <Doughnut data={data} options={options} />
            <div style={{
                position: 'absolute',
                bottom: '60px',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center', 
            }}>
                <div className='text-[2.5em]'><b>{value}%</b></div>
                <div className='text-[1.3em]'>{label}</div>
            </div>
        </div>
    </div>
  );
};

export default GaugeChart;
