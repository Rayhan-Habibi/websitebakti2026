import React, { useEffect, useCallback } from 'react';
import RekapAbsen from '../../components/absensi/RekapAbsen';
import IndikatorDivisi from '../../components/dashboard/IndikatorDivisi';
import useAuthStore from '../../Store/useAuthStore';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../config/api';
import PieChartAbsen from '../../components/dashboard/PieChartAbsen';

export default function Absensi() {

  const role = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const fetchUserData = useAuthStore((state) => state.fetchUserData);
  
  const [chartData, setChartData] = React.useState({});
  const [absenKegiatan, setAbsenKegiatan] = React.useState([]);

  // Pastikan user data sudah di-fetch
  useEffect(() => {
    if (!user || !user.nama) {
      fetchUserData();
    }
  }, [user, fetchUserData]);

  const fetchAbsensiData = useCallback(async () => {
    // Menggunakan Promise.allSettled agar jika satu gagal, yang lain tetap jalan
    const [resultStatistik, resultAbsen] = await Promise.allSettled([
      api.get('/api/absensi/statistik'),
      api.get('/api/absensi/rekap-kegiatan'),
    ]);

    // Handle Endpoint 1: Statistik
    if (resultStatistik.status === 'fulfilled') {
      const response = resultStatistik.value;
      setChartData(response.data.data || response.data);
      console.log("Chart Data Murni dari API: ", response.data);
    } else {
      console.error("❌ Gagal menarik API Statistik Absensi:", resultStatistik.reason);
    }

    // Handle Endpoint 2: Rekap Kegiatan
    if (resultAbsen.status === 'fulfilled') {
      const response = resultAbsen.value;
      setAbsenKegiatan(response.data.data || []);
    } else {
      console.error("❌ Gagal menarik API Rekap Kegiatan Absensi:", resultAbsen.reason);
    }

  }, [token]); 

  useEffect(() => {
    document.title = "Absensi | Bakti Unand 2026";
    fetchAbsensiData(); 
  }, [fetchAbsensiData]);

  // Guard: Jangan render konten sampai data user sudah lengkap
  const isUserLoaded = user && user.nama;

  if (!isUserLoaded) {
    return (
      <div className="min-h-screen bg-[#F1F3F4] p-3 pt-24 md:p-5 md:pt-5 lg:pl-24 font-sans text-[#133F25] w-full overflow-x-hidden flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-[#133F25]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="font-bold text-lg text-[#133F25]">Memuat data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F3F4] p-3 pt-24 md:p-5 md:pt-5 lg:pl-24 font-sans text-[#133F25] w-full overflow-x-hidden">
      
      {/* --- HEADER --- */}
      <div className="relative flex justify-center items-center mb-6 mt-3 w-full h-12 md:h-16">
        <h1 className="text-3xl md:text-4xl font-[#014421] font-bold uppercase drop-shadow-sm text-center w-full z-10">
          ABSENSI
        </h1>
        <div className="absolute right-2 md:right-6 top-0 md:top-2 z-20 w-fit transform scale-90 md:scale-100 flex-shrink-0">
          <IndikatorDivisi namaDivisi={user?.divisi?.nama_divisi || 'Memuat...'} warna="#67E8F9" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-2">
        
        {/* KARTU 1: QR ABSENSI */}
        <div className="bg-white rounded-md px-6 py-4 shadow-sm border-2 border-gray-200 flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-black mb-8 self-start">
            Qr Absensi Kamu
          </h2>
          <div className="relative p-2 border-4 border-black rounded-2xl mb-8">
            {user?.qr_token ? (
              <QRCodeSVG 
                value={user.qr_token.toString()} 
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              />
            ) : (
              <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-xl">
                <span className="animate-pulse font-bold text-gray-400">Memuat QR...</span>
              </div>
            )}
          </div>
          <div className="w-full h-0.5 bg-[#133F25] mb-6"></div>
          <h3 className="text-xl md:text-2xl font-black text-center">
            {user?.nama}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-5 h-5 bg-[#67E8F9] rounded-sm"></div>
            <span className="font-bold text-sm md:text-base">{user?.divisi?.nama_divisi}</span>
          </div>
        </div>

        {/* KARTU 2: RIWAYAT ABSENSI */}
        <div className="bg-white rounded-md px-6 py-4 shadow-sm border-2 border-gray-200 flex flex-col items-center">
          <PieChartAbsen 
            totalKegiatan={chartData?.total_kegiatan}
            hadir={chartData?.hadir}
            tidakHadir={chartData?.tidak_hadir}
            izin={chartData?.izin}
            sakit={chartData?.sakit}
          />
        </div>

        {/* KARTU 3: TATA CARA ABSENSI */}
        <div className="bg-white rounded-md px-6 py-4 shadow-sm border-2 border-gray-200 lg:col-span-2 mt-2">
          <h2 className="text-2xl md:text-3xl font-black mb-4">
            Tata Cara Absensi
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-sm md:text-base font-semibold text-black/80">
            <li>Lorem Ipsum is a dummy or placeholder text used in publishing and design to simulate content while focusing on layout and typography.</li>
            <li>Lorem Ipsum is a dummy or placeholder text used in publishing.</li>
            <li>publishing and design to simulate content while focusing on layout and typography.</li>
            <li>balal aoowdm a?n anowdmoamd amowmo dmawm dowa</li>
          </ol>
        </div>

        {/* KARTU 4: Edit Absensi */}
        {
          (role === 'INTI' || role === 'PRESIDIUM') && (
            <div className='bg-white rounded-md lg:col-span-2 mt-2 shadow-sm border-2 border-gray-200'>
              <RekapAbsen 
                data={absenKegiatan} 
                onRefresh={fetchAbsensiData} 
              />
            </div>
          )
        }
        
      </div>
    </div>
  );
}