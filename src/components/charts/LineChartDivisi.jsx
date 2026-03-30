import React from 'react';
import { FiLoader, FiTrendingUp } from 'react-icons/fi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function LineChartDivisi({
  chartData = null,
  isLoading = false
}) {

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        usePointStyle: true,
        callbacks: {
          label: (context) => {
             return ` ${context.dataset.label}: ${context.raw}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          color: '#4B5563',
          callback: function(value) {
            return value + '%';
          }
        },
        grid: {
          color: '#E5E7EB'
        },
        border: {
          display: false
        }
      },
      x: {
        ticks: {
          font: {
            weight: 'bold'
          },
          color: '#133F25',
          maxRotation: 45,
          minRotation: 0,
        },
        grid: {
          display: false
        },
        border: {
          display: false
        }
      }
    },
    animation: {
      duration: 1500,
      easing: 'easeOutQuart'
    }
  };

  // Agar tampilan matching dengan tema desain kita (Warna sidebar green & light green fill)
  const renderData = chartData ? {
    ...chartData,
    datasets: chartData.datasets?.map(ds => ({
      ...ds,
      borderColor: '#133F25', // Deep green sidebar
      backgroundColor: 'rgba(19, 63, 37, 0.1)', // Light transparent green for fill
      fill: true,
      borderWidth: 3,
      pointBackgroundColor: '#133F25',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#133F25',
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.3
    }))
  } : null;

  return (
    <div className="relative flex flex-col w-full min-h-[350px] h-full bg-white rounded-md px-6 py-6 shadow-sm border-2 border-gray-200">
      {isLoading && (
        <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-md">
          <FiLoader className="animate-spin text-4xl text-[#014421] mb-2" />
          <span className="font-bold text-[#014421]">Memuat Data Kinerja...</span>
        </div>
      )}
      
      <div className="w-full flex justify-between items-start mb-6 flex-shrink-0">
        <h2 className="text-2xl md:text-3xl font-black text-[#004D25] leading-tight">
          Grafik Tren<br/>Kinerja Divisi
        </h2>
        
        <div className="bg-[#133F25] text-white px-3 py-2 rounded-lg shadow-sm flex flex-col items-end">
          <span className="text-xs font-semibold text-gray-200">Seluruh Divisi</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <FiTrendingUp className="text-white text-sm" />
            <span className="text-sm font-bold uppercase">Average %</span>
          </div>
        </div>
      </div>
      
      <div className="w-full flex-grow relative min-h-[250px]">
        {renderData ? (
          <Line data={renderData} options={options} />
        ) : (
          !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-400 font-medium">Data grafik tidak tersedia</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
