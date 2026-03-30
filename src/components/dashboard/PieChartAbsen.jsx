import React from 'react';
import { FiLoader } from 'react-icons/fi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChartAbsen({
  totalKegiatan = 0, 
  hadir = 0, 
  tidakHadir = 0, 
  izin = 0, 
  sakit = 0,
  isLoading = false,
  title = "Riwayat Personal",
  totalLabel = "Total Kegiatan"
}) {
  
  const data = {
    labels: ['Hadir', 'Alpha', 'Izin', 'Sakit'],
    datasets: [
      {
        data: totalKegiatan === 0 ? [1] : [hadir, tidakHadir, izin, sakit],
        backgroundColor: totalKegiatan === 0 
          ? ['#E5E7EB'] 
          : ['#A7E3B4', '#F07E63', '#A7EBF4', '#F3CA6C'],
        borderColor: '#ffffff',
        borderWidth: totalKegiatan === 0 ? 0 : 2,
        hoverOffset: 4
      },
    ],
  };

  const options = {
    cutout: '70%',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: totalKegiatan > 0,
        callbacks: {
          label: (context) => {
            return ` ${context.label}: ${context.raw}`;
          }
        }
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1500,
      easing: 'easeOutQuart'
    }
  };

  const kehadiranPersen = totalKegiatan > 0 ? Math.round((hadir / totalKegiatan) * 100) : 0;

  return (
    <div className="relative flex flex-col items-center w-full min-h-[300px] h-full justify-between">
      {isLoading && (
        <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-md">
          <FiLoader className="animate-spin text-4xl text-[#014421] mb-2" />
          <span className="font-bold text-[#014421]">Memuat Data Absensi...</span>
        </div>
      )}
      <div className="w-full flex-shrink-0">
        <h2 className="text-2xl md:text-3xl font-black mb-28 self-start text-[#004D25] whitespace-pre-line">
          {title}
        </h2>
      </div>
      
      {/* 3. TERAPKAN STYLE DINAMISNYA KE DALAM DIV */}
      <div className="w-48 h-48 md:w-56 md:h-56 mb-8 relative flex items-center justify-center flex-shrink-0">
        <Doughnut data={data} options={options} />
        {/* Teks di tengah Donat */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
           <span className="text-3xl md:text-4xl font-black text-[#133F25] mt-2">{kehadiranPersen}%</span>
        </div>
      </div>

      <div className="w-full mt-auto">
        <p className="font-black text-lg md:text-xl text-black mb-4 uppercase self-start">
          {totalLabel} : {totalKegiatan}
        </p>
        
        <p className="font-black text-sm text-black mb-2 uppercase self-start">Ket :</p>
        
        {/* 4. LEGEND DITAMBAH SAKIT BIAR LENGKAP 4 WARNA */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 w-full justify-start">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#A7E3B4] rounded-md shadow-sm"></div>
            <span className="font-bold text-sm text-black">Hadir: {hadir}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#F07E63] rounded-md shadow-sm"></div>
            <span className="font-bold text-sm text-black">Alpha: {tidakHadir}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#A7EBF4] rounded-md shadow-sm"></div>
            <span className="font-bold text-sm text-black">Izin: {izin}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#F3CA6C] rounded-md shadow-sm"></div>
            <span className="font-bold text-sm text-black">Sakit: {sakit}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PieChartAbsen;