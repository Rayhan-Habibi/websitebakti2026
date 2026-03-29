import React, { useEffect, useCallback } from 'react';
import RekapAbsen from '../../components/RekapAbsen';
import IndikatorDivisi from '../../components/IndikatorDivisi';
import useAuthStore from '../../Store/useAuthStore';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import PieChartAbsen from '../../components/PieChartAbsen';

export default function Absensi() {

  const role = useAuthStore((state) => state.role);
  const qrCode = useAuthStore((state) => state.user.qr_token);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  
  const [chartData, setChartData] = React.useState({});
  const [absenKegiatan, setAbsenKegiatan] = React.useState([]);

  const fetchAbsensiData = useCallback(async () => {
    try {
      // 🔥 PERBAIKAN: Cukup panggil API sekali saja di dalam Promise.all
      const [responseStatistik, responseAbsen] = await Promise.all([
        axios.get(`https://api.baktiunand2026.com/api/absensi/statistik`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`https://api.baktiunand2026.com/api/absensi/rekap-kegiatan`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      console.log("Data chart diterima");
      console.log("Data rekap kegiatan diterima");

      // 🔥 PERBAIKAN: Ambil data dari responseStatistik, bukan response yang error tadi
      setChartData(responseStatistik.data.data);
      setAbsenKegiatan(responseAbsen.data.data);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // alert("Gagal memuat data Dashboard. Silakan coba lagi."); // Boleh dinyalakan kalau mau
    }
    // 🔥 PERBAIKAN: Hapus chartData dari array di bawah agar tidak terjadi Infinite Loop
  }, [token]); 

  useEffect(() => {
    document.title = "Absensi Panitia";
    fetchAbsensiData(); 
  }, [fetchAbsensiData]);

  return (
    <div className="min-h-screen bg-[#F1F3F4] p-3 pt-24 md:p-5 md:pt-5 lg:pl-24 font-sans text-[#133F25] w-full overflow-x-hidden">
      
      {/* --- HEADER --- */}
      <div className="relative flex justify-center items-center mb-6 mt-3 w-full h-12 md:h-16">
        <h1 className="text-3xl md:text-4xl font-[#014421] font-bold uppercase drop-shadow-sm text-center w-full z-10">
          ABSENSI
        </h1>
        <div className="absolute right-2 md:right-6 top-0 md:top-2 z-20 w-fit transform scale-90 md:scale-100 flex-shrink-0">
          <IndikatorDivisi namaDivisi="MIT" warna="#67E8F9" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-2">
        
        {/* KARTU 1: QR ABSENSI */}
        <div className="bg-white rounded-md px-6 py-4 shadow-sm border-2 border-gray-200 flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-black mb-8 self-start">
            Qr Absensi Kamu
          </h2>
          <div className="relative p-2 border-4 border-black rounded-2xl mb-8">
            {qrCode ? (
              <QRCodeSVG 
                value={qrCode.toString()} 
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
            {user.nama}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-5 h-5 bg-[#67E8F9] rounded-sm"></div>
            <span className="font-bold text-sm md:text-base">{user.divisi.nama_divisi}</span>
            {console.log(role)}
          </div>
        </div>

        {/* KARTU 2: RIWAYAT ABSENSI */}
        <div className="bg-white rounded-md px-6 py-4 shadow-sm border-2 border-gray-200 flex flex-col items-center">
          <PieChartAbsen 
            totalKegiatan={user.total_kegiatan}
            hadir={user.hadir}
            tidakHadir={user.tidak_hadir}
            izin={user.izin}
            sakit={user.sakit}
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
          role === 'INTI' && (
            <div className='bg-white rounded-md lg:col-span-2 mt-2 shadow-sm border-2 border-gray-200'>
              {/* 🔥 LEMPAR FUNGSI FETCH SEBAGAI onRefresh */}
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