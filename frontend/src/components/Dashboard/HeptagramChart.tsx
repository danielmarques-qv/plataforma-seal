import { Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

interface HeptagramChartProps {
  scores: Record<string, number>
}

const DIMENSION_LABELS: Record<string, string> = {
  tecnica: 'Técnica',
  venda: 'Venda',
  comunicacao: 'Comunicação',
  lideranca: 'Liderança',
  resiliencia: 'Resiliência',
  organizacao: 'Organização',
  mindset: 'Mindset',
}

export function HeptagramChart({ scores }: HeptagramChartProps) {
  const labels = Object.keys(DIMENSION_LABELS).map(key => DIMENSION_LABELS[key])
  const values = Object.keys(DIMENSION_LABELS).map(key => scores[key] || 0)

  const data = {
    labels,
    datasets: [
      {
        label: 'Seu Perfil Tático',
        data: values,
        backgroundColor: 'rgba(120, 89, 66, 0.3)',
        borderColor: '#785942',
        borderWidth: 2,
        pointBackgroundColor: '#785942',
        pointBorderColor: '#F2EFE9',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        beginAtZero: true,
        max: 10,
        min: 0,
        ticks: {
          stepSize: 2,
          color: '#C4A88E',
          backdropColor: 'transparent',
        },
        grid: {
          color: 'rgba(120, 89, 66, 0.3)',
        },
        angleLines: {
          color: 'rgba(120, 89, 66, 0.3)',
        },
        pointLabels: {
          color: '#F2EFE9',
          font: {
            size: 12,
            family: 'Roboto',
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Radar data={data} options={options} />
    </div>
  )
}
