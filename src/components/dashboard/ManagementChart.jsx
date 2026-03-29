import React from 'react';
import { FiLoader, FiUsers, FiActivity } from 'react-icons/fi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip
);

export default function ManagementChart({
  totalKegiatan = 0,
  totalAnggota = 0,
  hadir = 0, 
  tidakHadir = 0, 
  izin = 0, 
  sakit = 0,
  persentaseHadir = 0,
  isLoading = false
}) {

  const data = {
    labels: ['Hadir', 'Alpha', 'Izin', 'Sakit'],
    datasets: [
      {
        label: 'Volume Absensi',
        data: totalKegiatan === 0 ? [0, 0, 0, 0] : [hadir, tidakHadir, izin, sakit],
        backgroundColor: [
          '#A7E3B4', // Hadir
          '#F07E63', // Alpha
          '#A7EBF4', // Izin
          '#F3CA6C'  // Sakit
        ],
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
             return ` ${context.raw} Absen`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          color: '#4B5563'
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
          color: '#133F25'
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

  return (
    <div className="relative flex flex-col items-center w-full min-h-[300px] h-full justify-between">
      {isLoading && (
        <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-md">
          <FiLoader className="animate-spin text-4xl text-[#014421] mb-2" />
          <span className="font-bold text-[#014421]">Memuat Data Tim...</span>
        </div>
      )}
      
      <div className="w-full flex justify-between items-start mb-6 flex-shrink-0">
        <h2 className="text-2xl md:text-3xl font-black text-[#004D25] leading-tight">
          Riwayat<br/>Management
        </h2>
        
        {/* Badge Persentase Kinerja Tim */}
        <div className="bg-[#133F25] text-white px-3 py-2 rounded-lg shadow-sm flex flex-col items-end">
          <span className="text-xs font-semibold text-gray-200">Kinerja Tim</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <FiActivity className="text-white text-sm" />
            <span className="text-xl font-bold">{persentaseHadir}%</span>
          </div>
        </div>
      </div>
      
      {/* Container Chart */}
      <div className="w-full h-48 md:h-56 mb-8 relative flex-shrink-0">
        <Bar data={data} options={options} />
      </div>

      <div className="w-full mt-auto flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <p className="font-black text-xs md:text-sm text-gray-500 uppercase tracking-wider mb-1">
            Total Kapasitas Absen
          </p>
          <div className="flex items-end gap-2 text-[#133F25]">
            <span className="font-black text-2xl md:text-3xl leading-none">{hadir + tidakHadir + izin + sakit}</span>
            <span className="font-bold text-sm mb-1">Entri</span>
          </div>
        </div>
        
        <div className="flex gap-4">
           {/* Info Tambahan Cepat */}
           <div className="flex flex-col items-end bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
             <div className="flex items-center gap-2 text-gray-600 mb-1">
               <FiUsers />
               <span className="text-xs font-bold uppercase tracking-wide">Tim Tercatat</span>
             </div>
             <span className="font-black text-lg text-[#133F25]">{totalAnggota} Anggota</span>
           </div>
        </div>
      </div>
      
    </div>
  );
}
