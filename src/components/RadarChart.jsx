import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { foundationNames, averageScores } from '../constants/normativeData';
import { colors } from '../constants/config';

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function RadarChart({ scores }) {
  const chartRef = useRef(null);

  const data = {
    labels: [
      foundationNames.care,
      foundationNames.fairness,
      foundationNames.loyalty,
      foundationNames.authority,
      foundationNames.sanctity
    ],
    datasets: [
      {
        label: 'Your Scores',
        data: [
          scores.care,
          scores.fairness,
          scores.loyalty,
          scores.authority,
          scores.sanctity
        ],
        backgroundColor: 'rgba(84, 88, 91, 0.2)',
        borderColor: colors.textPrimary,
        borderWidth: 2,
        pointBackgroundColor: colors.textPrimary,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: colors.textPrimary,
        pointRadius: 5,
        pointHoverRadius: 7
      },
      {
        label: 'Average',
        data: [
          averageScores.care,
          averageScores.fairness,
          averageScores.loyalty,
          averageScores.authority,
          averageScores.sanctity
        ],
        backgroundColor: 'rgba(151, 156, 159, 0.1)',
        borderColor: colors.textSecondary,
        borderWidth: 1,
        borderDash: [5, 5],
        pointBackgroundColor: colors.textSecondary,
        pointBorderColor: '#fff',
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.5,
    scales: {
      r: {
        min: 0,
        max: 30,
        ticks: {
          stepSize: 5,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          },
          color: colors.textSecondary
        },
        grid: {
          color: colors.border
        },
        angleLines: {
          color: colors.border
        },
        pointLabels: {
          font: {
            size: 14,
            family: "'Inter', sans-serif",
            weight: '500'
          },
          color: colors.textPrimary,
          padding: 10
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 14,
            family: "'Inter', sans-serif"
          },
          color: colors.textPrimary,
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
          family: "'Inter', sans-serif",
          weight: '600'
        },
        bodyFont: {
          size: 13,
          family: "'Inter', sans-serif"
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.r}/30`;
          }
        }
      }
    }
  };

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '600px', 
      margin: '0 auto',
      padding: 'var(--space-4)'
    }}>
      <Radar ref={chartRef} data={data} options={options} />
    </div>
  );
}

export default RadarChart;
